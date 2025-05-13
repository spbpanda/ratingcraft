import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { SbiOptionalCardSize, SbiOptionalCardType } from './sbi-optional-card.models';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { STATUS_QUESTION_FILL } from '../../const/icons';
import { SbiCheckboxComponent } from '../sbi-checkbox/sbi-checkbox.component';
import { FormControl } from '@angular/forms';
import { NgClass, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { SbiRadioButtonComponent } from '../sbi-radio-button/sbi-radio-button.component';
import { SbiSlideToggleComponent } from '../sbi-slide-toggle/sbi-slide-toggle.component';
import { SbiBadgeComponent } from '../sbi-badge/sbi-badge.component';
import { SbiBadgeSize, SbiBadgeType } from '../sbi-badge/sbi-badge.models';
import { SbiTooltipDirective } from '../sbi-tooltip/sbi-tooltip.directive';
import { SbiIconColor } from '../sbi-icon/sbi-icon.models';
import { SbiTooltipContent, SbiTooltipPosition } from '../sbi-tooltip/sbi-tooltip.models';


/**
 * Компонент, отображающий элемент карточки выбора. В основном используется для отображения доп опций или информации о
 * элементе (например транспортном средстве или человеке).
 *
 * При использовании типа radio нужно оборачивать в компоненте список optional-card в sbi-radio-button-group, чтобы
 * обеспечить выбор только одного элемента, при этом не нужно передавать в optional-card control, но обязательно нужно передать value.
 *
 * Принимает ng-content - active-actions, контейнер, располагающийся в правой части карточки
 *
 * @Component
 * @selector: 'sbi-optional-card'
 * @standalone: true
 * @templateUrl: './sbi-optional-card.component.html'
 * @styleUrl: './sbi-optional-card.component.scss'
 * @imports: [
 *   SbiIconComponent,
 *   SbiCheckboxComponent,
 *   NgSwitch,
 *   NgTemplateOutlet,
 *   NgSwitchCase,
 *   SbiRadioButtonGroupComponent,
 *   SbiSlideToggleComponent,
 *   NgIf,
 *   SbiBadgeComponent,
 *   NgClass,
 *   SbiTooltipDirective,
 * ]
 */
@Component({
  selector: 'sbi-optional-card',
  standalone: true,
  imports: [
    SbiIconComponent,
    SbiCheckboxComponent,
    NgSwitch,
    NgTemplateOutlet,
    NgSwitchCase,
    SbiRadioButtonComponent,
    SbiSlideToggleComponent,
    NgIf,
    SbiBadgeComponent,
    NgClass,
    SbiTooltipDirective,
  ],
  templateUrl: './sbi-optional-card.component.html',
  styleUrl: './sbi-optional-card.component.scss',
})
export class SbiOptionalCardComponent implements OnInit {
  /**
   * @private
   * @readonly
   * @description Контейнер с активными элементами optional card.
   * @type {ElementRef<HTMLElement>}
   */
  @ViewChild('cardContainer') private readonly cardContainer!: ElementRef<HTMLElement>;

  /**
   * @public
   * @description Значение - выбрана данная карточка или нет. Используется, если не предполагается передача control.
   * @type {boolean | string}
   * @defaultValue false
   */
  @Input() public value: boolean | string = false;

  /**
   * @public
   * @description Форм-контроль для управления состоянием карточки.
   * @type {FormControl<boolean | null>}
   */
  @Input() public control!: FormControl<boolean | null>;

  /**
   * @public
   * @description Флаг, обозначающий активность карточки для нажатия.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public static: boolean = false;

  /**
   * @public
   * @description Тип активного элемента карточки.
   * @type {'checkbox' | 'radio' | 'switch' | 'icons' | 'illustration'}
   * @defaultValue ''checkbox
   */
  @Input() public type: SbiOptionalCardType = 'checkbox';

  /**
   * @public
   * @description Лейбл карточки.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public label: string = '';

  /**
   * @public
   * @description Примечание карточки.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public note?: string;

  /**
   * @public
   * @description Показывать или скрыть иконку знака вопроса (при наведении на неё показывается tooltip с описанием).
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public showInfoIcon: boolean = true;

  /**
   * @description Svg код иконки, отображаемой в левой части карточки.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public icon: string = '';

  /**
   * @description Цвет иконки.
   * @type {'primary' | 'tertiary' | 'accent' | 'accenttint' | 'warning' | 'error' | 'information' | 'contrast'}
   * @defaultValue 'primary'
   */
  @Input() public iconColor: SbiIconColor = 'primary';

  /**
   * @public
   * @description Svg код иллюстрации, отображаемой в левой части карточки. Отличие от иконки - размер (у иконки 24px у иллюстрации 44px)
   * @type {string}
   * @defaultValue ''
   */
  @Input() public illustrationIcon: string = '';

  /**
   * @public
   * @description Текст, который будет отображаться внутри badge элемента.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public badgeContent: string = '';

  /**
   * @public
   * @description Тип, отображаемого badge элемента.
   * @type {'neutral' | 'tint' | 'accent'}
   * @defaultValue 'accent'
   */
  @Input() public badgeType: SbiBadgeType = 'accent';

  /**
   * @public
   * @description Размер, отображаемого badge элемента.
   * @type {'large' | 'small'}
   * @defaultValue 'small'
   */
  @Input() public badgeSize: SbiBadgeSize = 'small';

  /**
   * @public
   * @description Является ли текст примечания- ссылкой.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public isLink: boolean = false;

  /**
   * @public
   * @description Скрывать или показывать чекбокс в правой части (используется только в карточках с типом - 'icons' | 'illustration').
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public showCheckbox: boolean = true;

  /**
   * @public
   * @description Размер карточки.
   * @type {'large' | 'small'}
   * @defaultValue 'large'
   */
  @Input() public size: SbiOptionalCardSize = 'large';

  /**
   * @public
   * @description Расположение отображаемого tooltip (при наведении на иконку знака вопроса).
   * @type {'top' | 'bottom' | 'left' | 'right'}
   * @defaultValue 'bottom'
   */
  @Input() public tooltipPosition: SbiTooltipPosition = 'bottom';

  /**
   * @public
   * @description Наполнение tooltip-а.
   * @type {string | TemplateRef<any> | null}
   * @defaultValue null
   */
  @Input() public tooltipContent: SbiTooltipContent = null;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-optional-card-test-id'
   */
  @Input() public testId: string = 'sbi-optional-card-test-id';

  /**
   * @public
   * @description Событие изменения состояния карточки.
   * @type {EventEmitter<void>}
   */
  @Output() public valueChanged: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @public
   * @description Событие нажатия на ссылку - примечание (актуально только при использовании isLink).
   * @type {EventEmitter<void>}
   */
  @Output() public linkClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @public
   * @description Иконка, отображаемая для вывода примечания.
   * @type {string}
   * @defaultValue STATUS_QUESTION_FILL
   */
  public questionIcon: string = STATUS_QUESTION_FILL;

  ngOnInit() {
    if (this.value !== undefined || this.static) {
      this.control = new FormControl(Boolean(this.value));
    }
  }

  /**
   * @description Обрабатывает клик на карточку.
   * Вызывает событие `valueChanged`.
   */
  public onCardClick() {
    if (this.type !== 'radio' || this.control.value == null) {
      this.control.setValue(!this.control.value);
    }
    if (this.type === 'radio' && !this.static) {
      const button = this.cardContainer.nativeElement.getElementsByTagName('mat-radio-button').item(0) as HTMLElement
      const target = this.cardContainer.nativeElement.getElementsByClassName('mat-mdc-radio-touch-target').item(0) as HTMLElement
      button && button.click && button.click();
      target && target.click && target.click();
    }
    this.valueChanged.emit();
  }

  /**
   * @description Обрабатывает клик на активный элемент выбора карточки (checkbox, radio, switch).
   * Вызывает событие `valueChanged`.
   */
  public onClick() {
    this.valueChanged.emit();
  }

  /**
   * @description Обрабатывает клик на ссылку (если isLink = true).
   * Вызывает событие `linkClick` с выбранной опцией.
   */
  public onLinkClick() {
    this.linkClick.emit();
  }
}
