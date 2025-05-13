import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { SbiTooltipDirective } from '../sbi-tooltip/sbi-tooltip.directive';
import { SbiDividerComponent } from '../sbi-divider/sbi-divider.component';
import { SbiDynamicPipe } from '../../pipes/sbi-dynamic.pipe';
import { SbiQuestionInfoComponent } from '../sbi-question-info/sbi-question-info.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { DOCUMENT_FILL, PROMO_CODE, SETTINGS_FILL } from '../../const/icons';
import { SbiIconColor } from '../sbi-icon/sbi-icon.models';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  SbiPromoCodeModalFormComponent
} from './components/sbi-promo-code-modal-form/sbi-promo-code-modal-form.component';
import {
  SbiSidebarPromoCodeConfiguration,
  SbiSidebarPromoCodeModalForm
} from './components/sbi-promo-code-modal-form/sbi-promo-code-modal-form.models';
import { takeUntil } from 'rxjs/operators';
import {
  DocumentModalForm,
  SbiSidebarDocument,
  SbiSidebarDocumentConfiguration
} from './components/sbi-document-modal-form/sbi-document-modal-form.models';
import { SbiDocumentModalFormComponent } from './components/sbi-document-modal-form/sbi-document-modal-form.component';
import { SbiSoloAnimatedNumberPipe } from '../../pipes/sbi-solo-animated-number.pipe';
import { SbiSidebarDynamicSumConfiguration, SbiSidebarMainElement, SbiSidebarPriceElement } from './sbi-sidebar.models';
import { SbiTooltipContent, SbiTooltipPosition } from '../sbi-tooltip/sbi-tooltip.models';
import { FormControl } from '@angular/forms';

/**
 * Компонент, предоставляющий вёрстку для отображения информации по полису, заявке, договору и т.д.
 * Как правило отображается справа от основной формы и является справочной информацией, полученной с предыдущих шагов.
 *
 * Принимает несколько видов ng-content:
 * 1. header-content - встраивается в контейнер с заголовочной информацией (блок с градиентом) после стоимости;
 * 2. body-content - встраивается в контейнер с основной информацией (блок следующий после блока с градиентом);
 * 3. added-content - контейнер с информацией, выводится после документов и промокода.
 *
 * @Component
 * @selector: 'sbi-sidebar'
 * @standalone: true
 * @imports: [
 *   SbiTooltipDirective,
 *   SbiDividerComponent,
 *   NgIf,
 *   SbiDynamicPipe,
 *   SbiQuestionInfoComponent,
 *   SbiIconComponent,
 *   SbiSoloAnimatedNumberPipe
 * ]
 * @templateUrl: './sbi-sidebar.component.html'
 * @styleUrls: ['./sbi-sidebar.component.scss']
 */
@Component({
  selector: 'sbi-sidebar',
  templateUrl: './sbi-sidebar.component.html',
  styleUrls: ['./sbi-sidebar.component.scss'],
  standalone: true,
  imports: [
    SbiTooltipDirective,
    SbiDividerComponent,
    NgIf,
    SbiDynamicPipe,
    SbiQuestionInfoComponent,
    SbiIconComponent,
    SbiSoloAnimatedNumberPipe,
    NgTemplateOutlet
  ],
})
export class SbiSidebarComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * @private
   * @readonly
   * @description Событие применения промокода.
   * @type {Subject<string>}
   * */
  private readonly applyPromo$: Subject<string> = new Subject<string>();

  /**
   * @private
   * @readonly
   * @description Состояние валиден ли промокод.
   * @type {BehaviorSubject<boolean>}
   * @defaultValue false
   * */
  private readonly promoCodeCheck$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * @private
   * @readonly
   * @description Экземпляр класса MatDialog.
   * @type {MatDialog}
   * @defaultValue MatDialog
   * */
  private readonly dialog: MatDialog = inject(MatDialog);

  /**
   * @private
   * @readonly
   * @description Событие уничтожения компонента, используется для отписок.
   * @type {Subject<void>}
   * */
  private readonly destroy$: Subject<void> = new Subject<void>();

  /**
   * @public
   * @description Заголовок блока суммы.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public priceLabel: string = '';

  /**
   * @public
   * @description Контент всплывающей подсказки в заголовочном контейнере.
   * @type {string | null | TemplateRef<any>}
   * @defaultValue null
   */
  @Input() public tooltipContent: SbiTooltipContent = null;

  /**
   * @public
   * @description Расположение всплывающей подсказки в заголовочном контейнере.
   * @type {'bottom' | 'top' | 'left' | 'right'}
   * @defaultValue 'bottom'
   */
  @Input() public tooltipPosition: SbiTooltipPosition = 'bottom';

  /**
   * @public
   * @description Список документов, отображаемых в модальном окне.
   * @type {Array<SbiSidebarDocument>}
   * @defaultValue []
   */
  @Input() public documents: Array<SbiSidebarDocument> = [];

  /**
   * @public
   * @description Объект конфигурации для модального окна с промокодом.
   * @type {SbiSidebarPromoCodeConfiguration}
   * @defaultValue {}
   */
  @Input() public promoCodeModalFormConfig: SbiSidebarPromoCodeConfiguration = {};

  /**
   * @public
   * @description Объект конфигурации для модального окна с документами.
   * @type {SbiSidebarDocumentConfiguration}
   * @defaultValue {}
   */
  @Input() public documentModalFormConfig: SbiSidebarDocumentConfiguration = {};

  /**
   * @public
   * @description Текст блока промокода.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public promoCodeLabel: string = '';

  /**
   * @public
   * @description Текст блока документа.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public docLabel: string = '';

  /**
   * @public
   * @description Текст блока настроек.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public settingLabel: string = '';

  /**
   * @public
   * @description Флаг, обозначающий использование анимации для стоимости.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public useAnimationForPrice: boolean = true;

  /**
   * @public
   * @description Флаг, обозначающий автоматическую фокусировку на поле ввода промокода.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public useAutoFocusForPromoCode: boolean = false;

  /**
   * @public
   * @description Иконка промокода.
   * @type {string}
   * @value PROMO_CODE
   * */
  @Input() public promoCodeIcon: string = PROMO_CODE;

  /**
   * @public
   * @description Цвет иконки промокода.
   * @type {'primary' | 'tertiary' | 'accent' | 'accenttint' | 'warning' | 'error' | 'information' | 'contrast'}
   * @value 'primary'
   * */
  @Input() public promoCodeIconColor: SbiIconColor = 'primary';

  /**
   * @public
   * @description Стоимость\цена\сумма со скидкой (если скидка есть), если скидки нет, то просто отображаемая сумма.
   * @type {SbiSidebarPriceElement | number | string | null | undefined}
   * @defaultValue undefined
   */
  @Input() public price?: SbiSidebarPriceElement | string | number | null;

  /**
   * @public
   * @description Стоимость\цена\сумма со скидкой.
   * @type {SbiSidebarPriceElement | number | string | null | undefined}
   * @defaultValue undefined
   */
  @Input() public fullPrice?: SbiSidebarPriceElement | string | number | null;

  /**
   * @public
   * @description Список отображаемой информации по полису.
   * @type {Array<SbiSidebarMainElement>}
   * @defaultValue []
   */
  @Input() public mainElements: Array<SbiSidebarMainElement> = [];

  /**
   * @public
   * @description Флаг, обозначающий применён ли промокод.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public promoIsActive: boolean = true;

  /**
   * @public
   * @description Контрол поля промокода.
   * @type {FormControl<string | null>}
   * @defaultValue new FormControl<string | null>('')
   */
  @Input() public promoCodeControl: FormControl<string | null> = new FormControl<string | null>('');

  /**
   * @deprecated После стандартизации модального окна с промокодом - убрать.
   * @public
   * @description Флаг, обозначающий кастомную обработку события нажатия на промокод.
   * @type {boolean}
   * @defaultValue false
   * */
  @Input() public customPromoCode: boolean = false;

  /**
   * @deprecated После стандартизации модального окна с документами - убрать.
   * @public
   * @description Флаг, обозначающий кастомную обработку события нажатия на документы.
   * @type {boolean}
   * @defaultValue false
   * */
  @Input() public customDocuments: boolean = false;

  /**
   * @public
   * @description Конфигурация динамически отображаемой суммы.
   * @type {SbiSidebarDynamicSumConfiguration | undefined}
   * @defaultValue undefined
   * */
  @Input() public dynamicSumSettings?: SbiSidebarDynamicSumConfiguration;

  /**
   * @public
   * @description Идентификатор для авто тестов.
   * @type {string}
   * @defaultValue 'sbi-sidebar'
   * */
  @Input() public testId: string = 'sbi-sidebar';

  /**
   * @public
   * @description Событие применения промокода.
   * @type {EventEmitter<string>}
   * */
  @Output() public applyPromoCode: EventEmitter<string> = new EventEmitter<string>();

  /**
   * @public
   * @description Событие нажатия на настройки.
   * @type {EventEmitter<void>}
   * */
  @Output() public settingClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @deprecated После стандартизации модального окна с промокодом - убрать.
   * @public
   * @description Событие нажатия на промокод.
   * @type {EventEmitter<void>}
   * */
  @Output() public promoCodeClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @deprecated После стандартизации модального окна с документами - убрать.
   * @public
   * @description Событие нажатия на документы.
   * @type {EventEmitter<void>}
   * */
  @Output() public documentsClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @public
   * @readonly
   * @description Иконка настроек.
   * @type {string}
   * @value SETTINGS_FILL
   * */
  public readonly settingIcon: string = SETTINGS_FILL;

  /**
   * @public
   * @readonly
   * @description Иконка документов.
   * @type {string}
   * @value DOCUMENT_FILL
   * */
  public readonly documentIcon: string = DOCUMENT_FILL;

  ngOnInit() {
    this.applyPromo$.pipe(takeUntil(this.destroy$)).subscribe(val => this.applyPromoCode.emit(val));
    this.promoCodeCheck$.next(this.promoIsActive);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['promoIsActive']) {
      this.promoCodeCheck$.next(changes['promoIsActive'].currentValue);
    }
  }

  /**
   * @public
   * @description Открывает модальное окно с вводом промокода.
   * */
  public openPromoModal() {
    if (this.customPromoCode) {
      this.promoCodeClick.emit();
      return;
    }
    const data: SbiSidebarPromoCodeModalForm = {
      applyPromo$: this.applyPromo$,
      promoCodeCheck$: this.promoCodeCheck$.asObservable(),
      promoCodeControl: this.promoCodeControl,
      ...this.promoCodeModalFormConfig,
    }
    this.dialog.open(SbiPromoCodeModalFormComponent, { data, autoFocus: this.useAutoFocusForPromoCode });
  }

  /**
   * @public
   * @description Открывает модальное окно с документами.
   * */
  public openDocModal() {
    if (this.customDocuments) {
      this.documentsClick.emit();
      return;
    }
    const data: DocumentModalForm = {
      documents: this.documents,
      ...this.documentModalFormConfig,
    }
    this.dialog.open(SbiDocumentModalFormComponent, { data })
  }

  /**
   * @public
   * @description Обрабатывает событие нажатия на настройки.
   * */
  public onSettingClick() {
    this.settingClick.emit();
  }

  public typeOf<T>(value: T | string | number): string {
    if (typeof value === 'object') return 'object';
    return 'value';
  }

  public get objPrice(): SbiSidebarPriceElement {
    return this.price as SbiSidebarPriceElement;
  }

  public get valPrice(): string | number {
    return this.price as string | number;
  }

  public get objFullPrice(): SbiSidebarPriceElement {
    return this.fullPrice as SbiSidebarPriceElement;
  }

  public get valFullPrice(): string | number {
    return this.fullPrice as string | number;
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete();
  }
}
