import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from '@angular/material/autocomplete';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiInputModeDirective } from '../../directives/sbi-input-mode.directive';
import { SbiTitleCaseDirective } from '../../directives/sbi-title-case.directive';
import { SbiUppercaseDirective } from '../../directives/sbi-uppercase.directive';
import { distinctUntilChanged, shareReplay, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, merge, of, Subject, Subscription } from 'rxjs';
import { SelectableItem } from '../../models/selectable-item';
import { CHEVRON_DOWN_ICON_SVG, CLEAR_ICON_SVG } from '../../const/icons';
import { MaskitoDirective } from '@maskito/angular';
import { PrefixIconType, SuffixIconType } from '../../models/input.types';
import { MaskitoOptions } from '@maskito/core';
import { MultiSelectElement } from '../../models/multi-autocomplete';
import { SbiChipComponent } from '../sbi-chip/sbi-chip.component';

/**
 * Компонент множественного автозаполнения с возможностью выбора из нескольких полей ввода.
 *
 * Предоставляет интерфейс для работы с несколькими полями ввода с автозаполнением,
 * где каждое поле может иметь свои опции и валидацию. Поддерживает динамическое
 * отображение/скрытие полей в зависимости от состояния заполнения.
 *
 * @Component
 * @selector: 'sbi-multi-autocomplete'
 * @standalone: true
 * @templateUrl: './sbi-multi-autocomplete.component.html'
 * @styleUrl: './sbi-multi-autocomplete.component.scss'
 */
@Component({
  selector: 'sbi-multi-autocomplete',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatFormField,
    MatInput,
    MatOption,
    MatPrefix,
    MatSuffix,
    NgForOf,
    NgIf,
    SbiErrorComponent,
    SbiIconComponent,
    SbiInputModeDirective,
    SbiTitleCaseDirective,
    SbiUppercaseDirective,
    NgClass,
    ReactiveFormsModule,
    MaskitoDirective,
    SbiChipComponent,
  ],
  templateUrl: './sbi-multi-autocomplete.component.html',
  styleUrl: './sbi-multi-autocomplete.component.scss'
})
export class SbiMultiAutocompleteComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  /**
   * Ссылка на элемент ввода в DOM для автозаполнения.
   * @private
   */
  @ViewChild('autocompleteInput') private autocompleteInput!: ElementRef<HTMLDivElement>;

  /**
   * Ссылка на компонент MatFormField в DOM.
   * Используется для управления состоянием ошибок формы.
   * @private
   */
  @ViewChild(MatFormField) private matFormField!: MatFormField;

  /**
   * Subject для отслеживания уничтожения компонента и отписки от всех наблюдаемых.
   * @private
   */
  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  /**
   * Подписка на отфильтрованные опции.
   * @private
   */
  private filteredOptionSubscription$: Subscription | null = null;

  /**
   * Subject для обновления состояния валидации формы.
   * @private
   */
  private readonly updateFormFieldValidate$ = new Subject<boolean>();

  /**
   * Приватное поле для хранения активного элемента выбора.
   * @private
   */
  private _activeElement: MultiSelectElement | null = null;

  /**
   * Устанавливает активный элемент выбора.
   * @param {MultiSelectElement | null} element - Активный элемент или null, если нет активного.
   */
  set activeElement(element: MultiSelectElement | null) {
    this._activeElement = element;
  }

  /**
   * Возвращает текущий активный элемент выбора.
   * @returns {MultiSelectElement | null} Активный элемент или null.
   */
  get activeElement() {
    return this._activeElement;
  }

  /**
   * Приватное поле для хранения сообщений об ошибках.
   * @private
   */
  private _errorMessages?: Record<string, string>;

  /**
   * Устанавливает сообщения об ошибках.
   * @param {Record<string, string> | undefined} errorMessages - Сообщения об ошибках.
   */
  @Input() set errorMessages(errorMessages: Record<string, string> | undefined) {
    this._errorMessages = errorMessages;
  }

  /**
   * Возвращает текущие сообщения об ошибках.
   * @returns {Record<string, string> | undefined} Сообщения об ошибках.
   */
  get errorMessages() {
    return this._errorMessages;
  }

  /**
   * Приватное поле для хранения ошибок валидации.
   * @private
   */
  private _errors: ValidationErrors | null = null;

  /**
   * Устанавливает ошибки валидации.
   * @param {ValidationErrors | null} errors - Ошибки валидации.
   */
  @Input() set errors(errors: ValidationErrors | null) {
    this._errors = errors;
  }

  /**
   * Возвращает текущие ошибки валидации.
   * @returns {ValidationErrors | null} Ошибки валидации.
   */
  get errors() {
    return this._errors;
  }

  /**
   * Приватное поле для хранения состояния отключения.
   * @private
   */
  private _disabled = false;

  /**
   * Устанавливает состояние отключения.
   * @param {boolean} disabled - True, если компонент должен быть отключен.
   */
  @Input() set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  /**
   * Возвращает текущее состояние отключения.
   * @returns {boolean} True, если компонент отключен.
   */
  get disabled() {
    return this._disabled;
  }

  /**
   * Массив элементов выбора для отображения.
   * @type {Array<MultiSelectElement>}
   */
  @Input() elements: Array<MultiSelectElement> = [];

  /**
   * Компонент доступен только для чтения.
   * @type {boolean}
   */
  @Input() readonly = false;

  /**
   * Массив имен контролов, которые должны быть скрыты.
   * @type {Array<string>}
   */
  @Input() hiddenControlNames: Array<string> = [];

  /**
   * Флаг, указывающий, что находится в невалидном состоянии.
   * @type {boolean}
   */
  @Input() invalid = false;

  /**
   * Тип иконки суффикса для поля ввода.
   * @type {SuffixIconType}
   */
  @Input() suffixIconType: SuffixIconType = 'clear';

  /**
   * Тип иконки префикса для поля ввода.
   * @type {PrefixIconType}
   */
  @Input() prefixIconType: PrefixIconType = 'none';

  /**
   * Подзаголовок.
   * @type {string | undefined}
   */
  @Input() subtitle?: string;

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId: string = 'sbi-multi-autocomplete-test-id';

  /**
   * Функция для установки видимости элементов.
   * @type {() => void | undefined}
   */
  @Input() setVisibleVoid?: () => void;

  /**
   * Флаг, указывающий, нужно ли скрывать маркер обязательного поля.
   * @type {boolean}
   */
  @Input() hideRequiredMarker = true;

  /**
   * Событие изменения фокуса.
   * @type {EventEmitter<boolean>}
   */
  @Output() focusChange = new EventEmitter<boolean>();

  /**
   * Событие потери фокуса элементом выбора.
   * @type {EventEmitter<MultiSelectElement>}
   */
  @Output() blur = new EventEmitter<MultiSelectElement>();

  /**
   * Событие удаления всех элементов.
   * @type {EventEmitter<void>}
   */
  @Output() clearAll = new EventEmitter<void>();

  /**
   * Событие выбора опции в элементе выбора.
   * @type {EventEmitter<MultiSelectElement>}
   */
  @Output() selectedOptionInElement = new EventEmitter<MultiSelectElement>();

  /**
   * Событие удаления одного элемента выбора.
   * @type {EventEmitter<MultiSelectElement>}
   */
  @Output() clearOneElement = new EventEmitter<MultiSelectElement>();

  /**
   * SVG-иконка "шеврон вниз" для выпадающего списка.
   * @type {string}
   * @public
   * @readonly
   */
  public readonly chevronIcon = CHEVRON_DOWN_ICON_SVG;

  /**
   * SVG-иконка удаления элемента.
   * @type {string}
   * @public
   * @readonly
   */
  public readonly clearIcon = CLEAR_ICON_SVG;

  /**
   * Базовая маска Maskito для полей ввода.
   * @type {MaskitoOptions}
   * @public
   * @readonly
   */
  public readonly baseMaskitoMask: MaskitoOptions = {mask: /\.*/};

  /**
   * Базовая функция отображения выбранного значения.
   * @type {(elem: any) => string}
   * @public
   * @readonly
   */
  public readonly baseDisplayFn = (elem: any) => typeof elem === 'string' || typeof elem === 'number' ? elem.toString() : JSON.stringify(elem);

  /**
   * Базовая функция сравнения элементов.
   * @type {(elem1: any, elem2: any) => boolean}
   * @public
   * @readonly
   */
  public readonly baseCompareFn = (elem1: any, elem2: any) => JSON.stringify(elem1) == JSON.stringify(elem2);

  /**
   * BehaviorSubject для отфильтрованных опций активного элемента.
   * @type {BehaviorSubject<SelectableItem<any>[]>}
   * @public
   */
  public filteredOptions$ = new BehaviorSubject<SelectableItem<any>[]>([]);

  /**
   * Сигнал, указывающий на наличие фокуса на компоненте.
   * @type {signal<boolean>}
   * @public
   */
  public focused = signal(false);

  /**
   * Сигнал, указывающий на невалидное состояние поля формы.
   * @type {signal<boolean>}
   * @public
   */
  public formFieldInvalid = signal(false);

  /**
   * Инициализирует компонент.
   * Устанавливает опции для элементов.
   */
  ngOnInit(): void {
    this.setOptions();
  }

  /**
   * Инициализирует компонент после отрисовки шаблона.
   * Подключает отслеживание изменения статуса формы и устанавливает начальное состояние валидации.
   */
  ngAfterViewInit() {
    this.connectChangeFormFieldStatus();
    this.changeFormFieldValidStatus(this.invalid);
  }

  /**
   * Подключает отслеживание изменения статуса формы.
   * Отслеживает изменения значений контролов и обновляет состояние валидации формы.
   * @private
   */
  private connectChangeFormFieldStatus() {
    const controls = this.elements.map(elem => elem.control);
    merge(...controls.map(control => control.valueChanges), this.updateFormFieldValidate$)
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(() => {
        const invalidControlIdx = controls.findIndex(control => control.touched && control.invalid);
        if (invalidControlIdx > -1 && this.hiddenControlNames.includes(this.elements[invalidControlIdx].fieldName)) {
          return;
        }
        const invalidControl = controls[invalidControlIdx];
        if (this.invalid) {
          this.changeFormFieldValidStatus(true);
        } else {
          if (this.formFieldInvalid() !== !!invalidControl) {
            this.changeFormFieldValidStatus(!!invalidControl);
          }
          this.errorMessages = invalidControlIdx > -1 ? this.elements[invalidControlIdx].errorMessages : undefined;
          this.errors = invalidControl ? invalidControl.errors : null;
        }
      })
  }

  /**
   * Обрабатывает изменения входных свойств.
   * @param {SimpleChanges} changes - Объект с изменениями входных свойств.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['elements']) {
      this.setOptions();
    }
    if (Object.prototype.hasOwnProperty.call(changes, 'invalid')) {
      this.changeFormFieldValidStatus(changes['invalid'].currentValue);
    }
    if (Object.prototype.hasOwnProperty.call(changes, 'disabled')) {
      if (changes['disabled'].currentValue) {
        this.elements.forEach(element => element.control.disable())
      } else {
        this.elements.forEach(element => element.control.enable())
      }
    }
  }

  /**
   * Изменяет статус валидации формы.
   * @param {boolean} valid - Указывает, валидна ли форма.
   * @private
   */
  private changeFormFieldValidStatus(valid: boolean = true) {
    if (!this.matFormField) {
      return
    }
    this.formFieldInvalid.set(valid);
    (this.matFormField._formFieldControl as any).errorState = this.formFieldInvalid();
  }

  /**
   * Устанавливает опции для элементов выбора.
   * Преобразует статические опции в Observable, если они еще не преобразованы.
   * @private
   */
  private setOptions() {
    this.elements.forEach(element => {
      if (element.options && !element.options$) {
        element.options$ = of(element.options)
      }
    })
  }

  /**
   * Устанавливает все опции для активного элемента.
   * @private
   */
  private setAllOptions() {
    this.activeElement?.options$!.pipe(take(1), shareReplay(1)).subscribe(options => {
      this.filteredOptions$.next(options);
    })
  }

  /**
   * Фильтрует опции на основе введенного значения.
   * @param {string} value - Значение для фильтрации.
   * @private
   */
  private filterFunc(value: string) {
    if (!this.activeElement || this.activeElement.useCustomFilterVoid) {
      return;
    }
    this.activeElement.options$!.pipe(take(1), shareReplay(1)).subscribe(options => {
      if (!options) {
        this.filteredOptions$.next([]);
        return;
      }
      const newOpts = options.filter(option => option.viewValue?.toLowerCase()?.includes(value.toLowerCase()));
      this.setNewOptionsIfNotEquals(newOpts);
    })
  }

  /**
   * Устанавливает новые опции, если они отличаются от текущих.
   * @param {SelectableItem<any>[]} opts - Новые опции для установки.
   * @private
   */
  private async setNewOptionsIfNotEquals(opts: SelectableItem<any>[]) {
    let equals = true;
    const actualValues = this.filteredOptions$.value;
    if (actualValues.length !== opts.length) {
      this.filteredOptions$.next(opts);
      return;
    }
    const compareFn = this.activeElement?.compareFn ?? this.baseCompareFn;
    actualValues.forEach((elem, idx) => equals = equals && compareFn(elem.value, opts[idx].value));
    if (!equals) {
      this.filteredOptions$.next(opts);
    }
  }

  /**
   * Обрабатывает выбор опции из выпадающего списка.
   * @param {MatAutocompleteSelectedEvent} event - Событие выбора опции.
   * @public
   */
  public onSelectionChange(event: MatAutocompleteSelectedEvent) {
    this.focused.set(false);
    if (!this.activeElement) {
      return
    }
    this.selectedOptionInElement.emit(this.activeElement);
    this.selectNextInput(this.activeElement.fieldName);
    this.activeElement.control.setValue(event.option.value);
    this.activeElement.visible = false;
    this.updateElementsVisible(this.activeElement);
    this.activeElement = null;
    this.filteredOptions$.next([]);
  }

  /**
   * Выбирает следующее поле ввода после выбора опции в текущем.
   * @param {string} controlFieldName - Имя текущего контрола.
   * @private
   */
  private async selectNextInput(controlFieldName: string) {
    const idx = this.elements.findIndex(elem => elem.fieldName === controlFieldName);
    const newSelectIdx = this.elements.slice(idx, this.elements.length).findIndex(elem => elem.visible);
    newSelectIdx > -1 && this.activeClearedInput(newSelectIdx);
  }

  /**
   * Функция для отслеживания элементов в ngFor.
   * Используется для оптимизации производительности при рендеринге списков.
   * @param {number} index - Индекс элемента.
   * @param {any} item - Элемент списка.
   * @returns {number} Индекс для идентификации элемента.
   * @public
   */
  public trackByFn(index: number, item: any): any {
    return index;
  }

  /**
   * Устанавливает активный элемент и настраивает его в зависимости от типа.
   * @param {MultiSelectElement} elem - Элемент для активации.
   * @public
   */
  public setActiveElement(elem: MultiSelectElement) {
    this.filteredOptionSubscription$?.unsubscribe();
    switch (elem.controlType) {
      case 'autocomplete':
        this.setActiveAutoComplete(elem);
        break
      case 'input':
        this.filteredOptions$.next([]);
        this.activeElement = elem;
        break;
    }
  }

  /**
   * Настраивает активный элемент автозаполнения.
   * @param {MultiSelectElement} elem - Элемент автозаполнения для активации.
   * @private
   */
  private setActiveAutoComplete(elem: MultiSelectElement) {
    this.activeElement = elem;
    this.setAllOptions();
    this.filteredOptionSubscription$ = elem.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.filterFunc(typeof value === 'string' ? value : '');
    });
  }

  /**
   * Обрабатывает потерю фокуса полем формы.
   * @public
   */
  public formFieldBlur() {
    this.updateFormFieldValidate$.next(true);
  }

  /**
   * Обрабатывает потерю фокуса элементом.
   * @param {MultiSelectElement} elem - Элемент, потерявший фокус.
   * @public
   */
  public onBlur(elem: MultiSelectElement) {
    this.blur.emit(elem);
    switch (elem.controlType) {
      case 'autocomplete':
        break
      case 'input':
        this.onInputBlur(elem);
        break
    }
    this.updateFormFieldValidate$.next(true);
  }

  /**
   * Обрабатывает потерю фокуса полем ввода.
   * @param {MultiSelectElement} elem - Элемент ввода, потерявший фокус.
   * @private
   */
  private onInputBlur(elem: MultiSelectElement) {
    if (!elem.control.value || elem.control.invalid) {
      return
    }
    this.activeElement = null;
    elem.visible = false;
    this.updateElementsVisible(elem);
  }

  /**
   * Обрабатывает изменение фокуса.
   * @param {boolean} focus - Новое состояние фокуса.
   * @public
   */
  public onFocusChange(focus: boolean) {
    this.focused.set(focus);
    this.focusChange.emit(focus);
  }

  /**
   * Очищает все контролы.
   * @public
   */
  public onClearControl() {
    this.activeElement = null;
    this.clearAll.emit();
    this.elements = this.elements.map(element => {
      element.control.setValue('');
      element.control.markAsUntouched();
      return {...element, visible: element.prevControlName == null};
    })
    this.updateFormFieldValidate$.next(true);
  }

  /**
   * Активирует первое видимое поле ввода.
   * @public
   */
  public activeInput() {
    const children = this.autocompleteInput.nativeElement.children;
    const inputsCount = children.length;
    for (let i = 1; i < inputsCount; i++) {
      if (this.elements[i - 1].visible) {
        this.activeClearedInput(i);
        break;
      }
    }
  }

  /**
   * Удаляет значение элемента.
   * @param {MultiSelectElement} elem - Элемент, значение которого нужно удалить.
   * @param {number} idx - Индекс элемента.
   * @public
   */
  public removeElementValue(elem: MultiSelectElement, idx: number) {
    this.clearOneElement.emit(elem);
    this.activeElement = elem;
    this.elements = this.elements.map(item => {
      if (item.fieldName === elem.fieldName || item.prevControlName === elem.fieldName) {
        item.control.setValue('');
        return {...item, visible: true};
      }
      return item;
    });
    this.removeRelatedElementsValue(elem);
    this.activeClearedInput(idx + 1);
  }

  /**
   * Удаляет значения связанных элементов.
   * @param {MultiSelectElement} elem - Элемент, для которого нужно удалить связанные значения.
   * @private
   */
  private removeRelatedElementsValue(elem: MultiSelectElement) {
    this.elements.forEach(item => {
      if (item.prevControlName === elem.fieldName) {
        item.control.setValue('');
        item.visible = false;
        this.removeRelatedElementsValue(item);
      }
    });
  }

  /**
   * Активирует очищенное поле ввода по индексу.
   * @param {number} idx - Индекс поля для активации.
   * @private
   */
  private activeClearedInput(idx: number) {
    setTimeout(() => {
      const element = (this.autocompleteInput.nativeElement.children.item(idx) as HTMLElement);
      element.focus();
      element.click();
    }, 50);
  }

  /**
   * Обновляет видимость элементов в зависимости от текущего состояния.
   * @param {MultiSelectElement} elem - Элемент, на основе которого обновляется видимость.
   * @private
   */
  private updateElementsVisible(elem: MultiSelectElement) {
    this.elements = this.elements.map(item => {
      if (item.prevControlName != null) {
        return {...item, visible: item.prevControlName === elem.fieldName || item.visible};
      }
      return item;
    });
    this.setVisibleVoid?.();
  }

  /**
   * Отписывается от всех подписок.
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    if (this.filteredOptionSubscription$) {
      this.filteredOptionSubscription$.unsubscribe();
    }
  }
}
