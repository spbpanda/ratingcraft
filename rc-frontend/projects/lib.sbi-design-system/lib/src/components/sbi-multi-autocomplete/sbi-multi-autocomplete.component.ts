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
  ViewChild,
  WritableSignal
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
import { SbiSelectableItem } from '../../models/sbi-selectable-item';
import { BUTTON_CROSS, CHEVRON_DOWN_OUTLINE } from '../../const/icons';
import { MaskitoDirective } from '@maskito/angular';
import { SbiPrefixIconType, SbiSuffixIconType } from '../sbi-input/sbi-input.models';
import { MaskitoOptions } from '@maskito/core';
import { SbiMultiSelectElement } from './sbi-multi-autocomplete.models';
import { SbiChipComponent } from '../sbi-chip/sbi-chip.component';

/**
 * Компонент множественного автозаполнения с возможностью выбора из нескольких полей ввода.
 *
 * Предоставляет интерфейс для работы с несколькими полями ввода с автозаполнением,
 * где каждое поле может иметь свои опции и валидацию. Поддерживает динамическое
 * отображение/скрытие полей в зависимости от состояния заполнения.
 *
 * Принимает несколько ng-content для отображения контента:
 * 1. prefix-icon - контент для отображения иконки перед полем ввода;
 * 2. suffix-icon - контент для отображения иконки после поля ввода;
 * 3. suffix-content - кастомный контент отображаемый после поля ввода.
 *
 * @Component
 * @selector: 'sbi-multi-autocomplete'
 * @standalone: true
 * @templateUrl: './sbi-multi-autocomplete.component.html'
 * @styleUrl: './sbi-multi-autocomplete.component.scss'
 * @imports: [
 *   AsyncPipe,
 *   FormsModule,
 *   MatAutocomplete,
 *   MatAutocompleteTrigger,
 *   MatFormField,
 *   MatInput,
 *   MatOption,
 *   MatPrefix,
 *   MatSuffix,
 *   NgForOf,
 *   NgIf,
 *   SbiErrorComponent,
 *   SbiIconComponent,
 *   SbiInputModeDirective,
 *   SbiTitleCaseDirective,
 *   SbiUppercaseDirective,
 *   NgClass,
 *   ReactiveFormsModule,
 *   MaskitoDirective,
 *   SbiChipComponent,
 * ]
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
   * @private
   * @description Ссылка на элемент ввода в DOM для автозаполнения.
   * @type {ElementRef<HTMLDivElement>}
   * @defaultValue ElementRef<HTMLDivElement>
   */
  @ViewChild('autocompleteInput') private autocompleteInput!: ElementRef<HTMLDivElement>;

  /**
   * @private
   * @description Ссылка на компонент MatFormField в DOM.
   * Используется для управления состоянием ошибок формы.
   * @type {MatFormField}
   * @defaultValue MatFormField
   */
  @ViewChild(MatFormField) private matFormField!: MatFormField;

  /**
   * @private
   * @description Subject для отслеживания уничтожения компонента и отписки от всех наблюдаемых.
   * @type {Subject<boolean>}
   */
  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  /**
   * @private
   * @description Подписка на отфильтрованные опции.
   * @type {Subscription | null}
   * @defaultValue null
   */
  private filteredOptionSubscription$: Subscription | null = null;

  /**
   * @private
   * @description Subject для обновления состояния валидации формы.
   * @type {Subject<boolean>}
   */
  private readonly updateFormFieldValidate$: Subject<boolean> = new Subject<boolean>();

  /**
   * @private
   * @description Приватное поле для хранения активного элемента выбора.
   * @type {SbiMultiSelectElement<unknown> | null}
   * @defaultValue null
   */
  private _activeElement: SbiMultiSelectElement<unknown> | null = null;

  /**
   * @public
   * @setter
   * @description Устанавливает активный элемент выбора.
   * @param {SbiMultiSelectElement<unknown> | null} element - Активный элемент или null, если нет активного.
   */
  public set activeElement(element: SbiMultiSelectElement<unknown> | null) {
    this._activeElement = element;
  }

  /**
   * @public
   * @getter
   * @description Возвращает текущий активный элемент выбора.
   * @returns {SbiMultiSelectElement<unknown> | null} Активный элемент или null.
   */
  public get activeElement(): SbiMultiSelectElement<unknown> | null {
    return this._activeElement;
  }

  /**
   * @private
   * @description Приватное поле для хранения сообщений об ошибках.
   * @type {Record<string, string> | undefined}
   * @defaultValue undefined
   */
  private _errorMessages?: Record<string, string>;

  /**
   * @public
   * @setter
   * @description Устанавливает сообщения об ошибках.
   * @param {Record<string, string> | undefined} errorMessages - Сообщения об ошибках.
   */
  @Input()
  public set errorMessages(errorMessages: Record<string, string> | undefined) {
    this._errorMessages = errorMessages;
  }

  /**
   * @public
   * @getter
   * @description Возвращает текущие сообщения об ошибках.
   * @returns {Record<string, string> | undefined} Сообщения об ошибках.
   */
  public get errorMessages(): Record<string, string> | undefined {
    return this._errorMessages;
  }

  /**
   * @private
   * @description Приватное поле для хранения ошибок валидации.
   * @type {ValidationErrors | null}
   * @defaultValue null
   */
  private _errors: ValidationErrors | null = null;

  /**
   * @public
   * @setter
   * @description Устанавливает ошибки валидации.
   * @param {ValidationErrors | null} errors - Ошибки валидации.
   */
  @Input()
  public set errors(errors: ValidationErrors | null) {
    this._errors = errors;
  }

  /**
   * @public
   * @getter
   * @description Возвращает текущие ошибки валидации.
   * @returns {ValidationErrors | null} Ошибки валидации.
   */
  public get errors(): ValidationErrors | null {
    return this._errors;
  }

  /**
   * @private
   * @description Приватное поле для хранения состояния отключения.
   * @type {boolean}
   * @defaultValue false
   */
  private _disabled: boolean = false;

  /**
   * @public
   * @setter
   * @description Устанавливает состояние отключения.
   * @param {boolean} disabled - True, если компонент должен быть отключен.
   */
  @Input()
  public set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  /**
   * @public
   * @getter
   * @description Возвращает текущее состояние отключения.
   * @returns {boolean} True, если компонент отключен.
   */
  public get disabled(): boolean {
    return this._disabled;
  }

  /**
   * @public
   * @description Массив элементов выбора для отображения.
   * @type {Array<SbiMultiSelectElement<any>>}
   * @defaultValue []
   */
  @Input() public elements: Array<SbiMultiSelectElement<any>> = [];

  /**
   * @public
   * @description Компонент доступен только для чтения.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public readonly: boolean = false;

  /**
   * @public
   * @description Массив имен контролов, которые должны быть скрыты.
   * @type {Array<string>}
   * @defaultValue []
   */
  @Input() public hiddenControlNames: Array<string> = [];

  /**
   * @public
   * @description Флаг, указывающий, что находится в невалидном состоянии.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public invalid: boolean = false;

  /**
   * @public
   * @description Тип иконки суффикса для поля ввода.
   * @type {'clear' | 'custom'}
   * @defaultValue 'clear'
   */
  @Input() public suffixIconType: SbiSuffixIconType = 'clear';

  /**
   * @public
   * @description Тип иконки префикса для поля ввода.
   * @type {'search' | 'custom' | 'none'}
   * @defaultValue 'none'
   */
  @Input() public prefixIconType: SbiPrefixIconType = 'none';

  /**
   *
   * @public
   * @description Подзаголовок.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public subtitle?: string;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-multi-autocomplete-test-id'
   */
  @Input() public testId: string = 'sbi-multi-autocomplete-test-id';

  /**
   * @public
   * @description Функция для установки видимости элементов.
   * @type {() => void | undefined}
   * @defaultValue undefined
   */
  @Input() public setVisibleVoid?: () => void;

  /**
   * @public
   * @description Флаг, указывающий, нужно ли скрывать маркер обязательного поля.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public hideRequiredMarker: boolean = true;

  /**
   * @public
   * @description Событие изменения фокуса.
   * @type {EventEmitter<boolean>}
   */
  @Output() public focusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @public
   * @description Событие потери фокуса элементом выбора.
   * @type {EventEmitter<SbiMultiSelectElement<unknown>>}
   */
  @Output() public blur: EventEmitter<SbiMultiSelectElement<unknown>> = new EventEmitter<SbiMultiSelectElement<unknown>>();

  /**
   * @public
   * @description Событие удаления всех элементов.
   * @type {EventEmitter<void>}
   */
  @Output() public clearAll: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Событие выбора опции в элементе выбора.
   * @type {EventEmitter<SbiMultiSelectElement<unknown>>}
   */
  @Output() public selectedOptionInElement: EventEmitter<SbiMultiSelectElement<unknown>> = new EventEmitter<SbiMultiSelectElement<unknown>>();

  /**
   * Событие удаления одного элемента выбора.
   * @type {EventEmitter<SbiMultiSelectElement<unknown>>}
   */
  @Output() public clearOneElement: EventEmitter<SbiMultiSelectElement<unknown>> = new EventEmitter<SbiMultiSelectElement<unknown>>();

  /**
   * @public
   * @readonly
   * @description SVG-иконка "шеврон вниз" для выпадающего списка.
   * @type {string}
   * @defaultValue CHEVRON_DOWN_OUTLINE
   */
  public readonly chevronIcon: string = CHEVRON_DOWN_OUTLINE;

  /**
   * @public
   * @readonly
   * @description SVG-иконка удаления элемента.
   * @type {string}
   * @defaultValue BUTTON_CROSS
   */
  public readonly clearIcon: string = BUTTON_CROSS;

  /**
   * @public
   * @readonly
   * @description Базовая маска Maskito для полей ввода.
   * @type {MaskitoOptions}
   * @defaultValue { mask: /\.* / }
   */
  public readonly baseMaskitoMask: MaskitoOptions = { mask: /\.*/ };

  /**
   * @public
   * @readonly
   * @description Базовая функция отображения выбранного значения.
   * @type {(elem: any) => string}
   * @defaultValue (elem: any): string => typeof elem === 'string' || typeof elem === 'number' ? elem.toString() : JSON.stringify(elem)
   */
  public readonly baseDisplayFn: (elem: any) => string = (elem: any): string => typeof elem === 'string' || typeof elem === 'number' ? elem.toString() : JSON.stringify(elem);

  /**
   * @public
   * @readonly
   * @description Базовая функция сравнения элементов.
   * @type {(elem1: any, elem2: any) => boolean}
   * @defaultValue (elem1: any, elem2: any): boolean => JSON.stringify(elem1) == JSON.stringify(elem2)
   */
  public readonly baseCompareFn: (elem1: any, elem2: any) => boolean = (elem1: any, elem2: any): boolean => JSON.stringify(elem1) == JSON.stringify(elem2);

  /**
   * @public
   * @description BehaviorSubject для отфильтрованных опций активного элемента.
   * @type {BehaviorSubject<Array<SbiSelectableItem<any>>>}
   * @defaultValue []
   */
  public filteredOptions$: BehaviorSubject<Array<SbiSelectableItem<any>>> = new BehaviorSubject<Array<SbiSelectableItem<any>>>([]);

  /**
   * @public
   * @description Сигнал, указывающий на наличие фокуса на компоненте.
   * @type {WritableSignal<boolean>}
   * @defaultValue false
   */
  public focused: WritableSignal<boolean> = signal(false);

  /**
   * @public
   * @description Сигнал, указывающий на невалидное состояние поля формы.
   * @type {WritableSignal<boolean>}
   * @defaultValue false
   */
  public formFieldInvalid: WritableSignal<boolean> = signal(false);

  /**
   * @description Инициализирует компонент. Устанавливает опции для элементов.
   */
  ngOnInit(): void {
    this.setOptions();
  }

  /**
   * @description Инициализирует компонент после отрисовки шаблона.
   * Подключает отслеживание изменения статуса формы и устанавливает начальное состояние валидации.
   */
  ngAfterViewInit() {
    this.connectChangeFormFieldStatus();
    this.changeFormFieldValidStatus(this.invalid);
  }

  /**
   * @private
   * @description Подключает отслеживание изменения статуса формы.
   * Отслеживает изменения значений контролов и обновляет состояние валидации формы.
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
   * @description Обрабатывает изменения входных свойств.
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
   * @private
   * @description Изменяет статус валидации формы.
   * @param {boolean} valid - Указывает, валидна ли форма.
   */
  private changeFormFieldValidStatus(valid: boolean = true) {
    if (!this.matFormField) {
      return
    }
    this.formFieldInvalid.set(valid);
    (this.matFormField._formFieldControl as any).errorState = this.formFieldInvalid();
  }

  /**
   * @private
   * @description Устанавливает опции для элементов выбора.
   * Преобразует статические опции в Observable, если они еще не преобразованы.
   */
  private setOptions() {
    this.elements.forEach(element => {
      if (element.options && !element.options$) {
        element.options$ = of(element.options)
      }
    })
  }

  /**
   * @description Устанавливает все опции для активного элемента.
   * @private
   */
  private setAllOptions() {
    this.activeElement?.options$!.pipe(take(1), shareReplay(1)).subscribe(options => {
      this.filteredOptions$.next(options);
    })
  }

  /**
   * @private
   * @description Фильтрует опции на основе введенного значения.
   * @param {string} value - Значение для фильтрации.
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
   * @private
   * @description Устанавливает новые опции, если они отличаются от текущих.
   * @param {Array<SbiSelectableItem<any>>} opts - Новые опции для установки.
   */
  private async setNewOptionsIfNotEquals(opts: Array<SbiSelectableItem<any>>) {
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
   * @public
   * @description Обрабатывает выбор опции из выпадающего списка.
   * @param {MatAutocompleteSelectedEvent} event - Событие выбора опции.
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
   * @private
   * @description Выбирает следующее поле ввода после выбора опции в текущем.
   * @param {string} controlFieldName - Имя текущего контрола.
   */
  private async selectNextInput(controlFieldName: string) {
    const idx = this.elements.findIndex(elem => elem.fieldName === controlFieldName);
    const newSelectIdx = this.elements.slice(idx, this.elements.length).findIndex(elem => elem.visible);
    newSelectIdx > -1 && this.activeClearedInput(newSelectIdx);
  }

  /**
   * @public
   * @description Функция для отслеживания элементов в ngFor.
   * Используется для оптимизации производительности при рендеринге списков.
   * @param {number} index - Индекс элемента.
   * @param {any} item - Элемент списка.
   * @returns {number} Индекс для идентификации элемента.
   */
  public trackByFn(index: number, item: any): any {
    return index;
  }

  /**
   * @public
   * @description Устанавливает активный элемент и настраивает его в зависимости от типа.
   * @param {SbiMultiSelectElement<unknown>} elem - Элемент для активации.
   */
  public setActiveElement(elem: SbiMultiSelectElement<unknown>) {
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
   * @private
   * @description Настраивает активный элемент автозаполнения.
   * @param {SbiMultiSelectElement<unknown>} elem - Элемент автозаполнения для активации.
   */
  private setActiveAutoComplete(elem: SbiMultiSelectElement<unknown>) {
    this.activeElement = elem;
    this.setAllOptions();
    this.filteredOptionSubscription$ = elem.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.filterFunc(typeof value === 'string' ? value : '');
    });
  }

  /**
   * @public
   * @description Обрабатывает потерю фокуса полем формы.
   */
  public formFieldBlur() {
    this.updateFormFieldValidate$.next(true);
  }

  /**
   * @public
   * @description Обрабатывает потерю фокуса элементом.
   * @param {SbiMultiSelectElement<unknown>} elem - Элемент, потерявший фокус.
   */
  public onBlur(elem: SbiMultiSelectElement<unknown>) {
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
   * @private
   * @description Обрабатывает потерю фокуса полем ввода.
   * @param {SbiMultiSelectElement<unknown>} elem - Элемент ввода, потерявший фокус.
   */
  private onInputBlur(elem: SbiMultiSelectElement<unknown>) {
    if (!elem.control.value || elem.control.invalid) {
      return
    }
    this.activeElement = null;
    elem.visible = false;
    this.updateElementsVisible(elem);
  }

  /**
   * @public
   * @description Обрабатывает изменение фокуса.
   * @param {boolean} focus - Новое состояние фокуса.
   */
  public onFocusChange(focus: boolean) {
    this.focused.set(focus);
    this.focusChange.emit(focus);
  }

  /**
   * @public
   * @description Очищает все контролы.
   */
  public onClearControl() {
    this.activeElement = null;
    this.clearAll.emit();
    this.elements = this.elements.map(element => {
      element.control.setValue('');
      element.control.markAsUntouched();
      return { ...element, visible: element.prevControlName == null };
    })
    this.updateFormFieldValidate$.next(true);
  }

  /**
   * @public
   * @description Активирует первое видимое поле ввода.
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
   * @public
   * @description Удаляет значение элемента.
   * @param {SbiMultiSelectElement<unknown>} elem - Элемент, значение которого нужно удалить.
   * @param {number} idx - Индекс элемента.
   */
  public removeElementValue(elem: SbiMultiSelectElement<unknown>, idx: number) {
    this.clearOneElement.emit(elem);
    this.activeElement = elem;
    this.elements = this.elements.map(item => {
      if (item.fieldName === elem.fieldName || item.prevControlName === elem.fieldName) {
        item.control.setValue('');
        return { ...item, visible: true };
      }
      return item;
    });
    this.removeRelatedElementsValue(elem);
    this.activeClearedInput(idx + 1);
  }

  /**
   * @private
   * @description Удаляет значения связанных элементов.
   * @param {SbiMultiSelectElement<unknown>} elem - Элемент, для которого нужно удалить связанные значения.
   */
  private removeRelatedElementsValue(elem: SbiMultiSelectElement<unknown>) {
    this.elements.forEach(item => {
      if (item.prevControlName === elem.fieldName) {
        item.control.setValue('');
        item.visible = false;
        this.removeRelatedElementsValue(item);
      }
    });
  }

  /**
   * @private
   * @description Активирует очищенное поле ввода по индексу.
   * @param {number} idx - Индекс поля для активации.
   */
  private activeClearedInput(idx: number) {
    setTimeout(() => {
      const element = (this.autocompleteInput.nativeElement.children.item(idx) as HTMLElement);
      element.focus();
      element.click();
    }, 50);
  }

  /**
   * @private
   * @description Обновляет видимость элементов в зависимости от текущего состояния.
   * @param {SbiMultiSelectElement<unknown>} elem - Элемент, на основе которого обновляется видимость.
   */
  private updateElementsVisible(elem: SbiMultiSelectElement<unknown>) {
    this.elements = this.elements.map(item => {
      if (item.prevControlName != null) {
        return { ...item, visible: item.prevControlName === elem.fieldName || item.visible };
      }
      return item;
    });
    this.setVisibleVoid?.();
  }

  /**
   * @description Отписывается от всех подписок.
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    if (this.filteredOptionSubscription$) {
      this.filteredOptionSubscription$.unsubscribe();
    }
  }
}
