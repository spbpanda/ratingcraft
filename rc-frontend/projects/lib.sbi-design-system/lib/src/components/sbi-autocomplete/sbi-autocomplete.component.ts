import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption, } from '@angular/material/autocomplete';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { SbiUppercaseDirective } from '../../directives/sbi-uppercase.directive';
import { FormControl, FormControlStatus, ReactiveFormsModule } from '@angular/forms';
import { SbiTitleCaseDirective } from '../../directives/sbi-title-case.directive';
import { MaskitoDirective } from '@maskito/angular';
import { SbiCheckboxComponent } from '../sbi-checkbox/sbi-checkbox.component';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiComponentWithAutocomplete } from '../../classes/sbi-component-with-autocomplete';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { debounceTime } from 'rxjs';
import { SbiInputModeDirective } from '../../directives/sbi-input-mode.directive';
import { SbiChipRowComponent } from '../sbi-chip-row/sbi-chip-row.component';
import { SelectionModel } from '@angular/cdk/collections';
import { validator } from './sbi-autocomplete.const';
import { SbiDividerComponent } from '../sbi-divider/sbi-divider.component';
import { SbiSelectableItem } from '../../models/sbi-selectable-item';
import { SbiAutocompleteChipPosition, SbiAutocompleteSelectAll } from './sbi-autocomplete.models';

/**
 * Компонент автозаполнения с поддержкой множественного выбора.
 *
 * Предоставляет поле ввода с автозаполнением и возможностью выбора нескольких значений.
 *
 * Принимает несколько ng-content для отображения контента:
 * 1. prefix-icon - контент для отображения иконки перед полем ввода;
 * 2. suffix-icon - контент для отображения иконки после поля ввода;
 * 3. suffix-content - кастомный контент отображаемый после поля ввода.
 *
 * @Component
 * @selector: 'sbi-autocomplete'
 * @standalone: true
 * @import imports: [
 *   NgIf,
 *   NgForOf,
 *   NgClass,
 *   AsyncPipe,
 *   ReactiveFormsModule,
 *   MatInput,
 *   MatFormField,
 *   MaskitoDirective,
 *   MatAutocompleteTrigger,
 *   MatAutocomplete,
 *   MatOption,
 *   MatSuffix,
 *   MatPrefix,
 *   SbiUppercaseDirective,
 *   SbiTitleCaseDirective,
 *   SbiIconComponent,
 *   SbiCheckboxComponent,
 *   SbiErrorComponent,
 *   SbiInputModeDirective,
 *   SbiChipRowComponent,
 * ],
 * @templateUrl: './sbi-autocomplete.component.html'
 * @styleUrls: ['./sbi-autocomplete.component.scss']
 */
@Component({
  selector: 'sbi-autocomplete',
  templateUrl: './sbi-autocomplete.component.html',
  styleUrls: ['./sbi-autocomplete.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    AsyncPipe,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MaskitoDirective,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatSuffix,
    MatPrefix,
    SbiUppercaseDirective,
    SbiTitleCaseDirective,
    SbiIconComponent,
    SbiCheckboxComponent,
    SbiErrorComponent,
    SbiInputModeDirective,
    SbiChipRowComponent,
    SbiDividerComponent,
  ],
})
export class SbiAutocompleteComponent<T> extends SbiComponentWithAutocomplete<T> implements AfterViewInit {
  /**
   * @private
   * @readonly
   * @description Сервис проверки необходимости пере отрисовки экрана.
   */
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * @public
   * @description Ссылка на элемент ввода в DOM.
   * @description Используется для управления фокусом и получения введенного значения.
   */
  @ViewChild('autocompleteInput') public autocompleteInput!: ElementRef<HTMLInputElement>;

  /**
   * @public
   * @description Ссылка на компонент строки с чипами в DOM.
   * @description Используется для отображения выбранных элементов в виде чипов.
   */
  @ViewChild('autocompleteChipRow') public autocompleteChipRow!: SbiChipRowComponent<T>;

  /**
   * @public
   * @description Ссылка на компонент опций autocomplete-a в DOM.
   * @description Используется для выбора опций.
   */
  @ViewChild('autocompleteOptions') public autocompleteOptions!: ElementRef<HTMLDivElement>;

  /**
   * @public
   * @description Форм-контрол для управления выбранными значениями.
   * @description Переопределяет родительский контрол для поддержки массива значений.
   * @type {FormControl<Array<T> | null>}
   */
  @Input() public declare control: FormControl<Array<T> | null>;

  /**
   * @public
   * @description Максимальное количество элементов, которые можно выбрать.
   * @type {number}
   * @defaultValue 99999999
   */
  @Input() public maxElementsCount: number = 99999999;

  /**
   * @public
   * @experimental
   * @description Расположение chip внутри autocomplete.
   * @type {'row' | 'wrap'}
   * @defaultValue 'row'
   */
  @Input() public chipPosition: SbiAutocompleteChipPosition = 'row';

  /**
   * @public
   * @description Флаг, указывающий, был ли компонент "затронут" (touched). Используется для контроля отображения состояния ошибок валидации.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public touched: boolean = false;

  /**
   * @description Флаг, указывающий, показывать кнопку выделения всех элементов или нет.
   * @type {boolean}
   * @defaultValue true
   */
  private _showSelectAll: boolean = true;
  @Input()
  public set showSelectAll(showSelectAll: boolean) {
    this._showSelectAll = showSelectAll;
  };

  public get showSelectAll(): boolean {
    return this._showSelectAll && this.maxElementsCount >= (this.options || []).length;
  }

  /**
   * @public
   * @description События изменения текста поиска. Эмитится при вводе текста в поле поиска.
   * @type {EventEmitter<string | null>}
   */
  @Output() public searchChangeEvent: EventEmitter<string | null> = new EventEmitter<string | null>();

  /**
   * @public
   * @description События выделения\развыделения всех элементов списка.
   * @type {EventEmitter<'clear' | 'selectAll'>}
   */
  @Output() public selectAllEvent: EventEmitter<SbiAutocompleteSelectAll> = new EventEmitter<SbiAutocompleteSelectAll>();

  /**
   * @public
   * @description Модель выбранных элементов. Используется для отслеживания состояния выбора для каждого элемента.
   * @type {SelectionModel<T>}
   */
  public selection: SelectionModel<T> = new SelectionModel<T>(true, [], true, this.compareFn);

  /**
   * @public
   * @description Контрол для управления текстом поиска. Отделен от основного контрола, который хранит выбранные значения.
   * @type {FormControl<string | null>}
   */
  public searchControl: FormControl<string | null> = new FormControl('');

  /**
   * Инициализирует компонент.
   * Настраивает подписки на изменения для фильтрации и отслеживания выбранных элементов.
   * @override
   */
  override ngOnInit() {
    super.ngOnInit();
    this.connectFilterOptions();
    this.connectChangeSelectedOptions();
  }

  /**
   * @private
   * @description Подключает фильтрацию опций на основе изменений в поле поиска.
   */
  private connectFilterOptions() {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(100), distinctUntilChanged())
      .subscribe(search => {
        this.filterFunc(search || '');
        this.searchChangeEvent.emit(search);
      });
  }

  /**
   * @private
   * @description Подключает отслеживание изменений выбранных опций.
   */
  private connectChangeSelectedOptions() {
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setSelectedByControlValue();
    });
  }

  /**
   * Инициализация после отрисовки представления компонента.
   * Вызывает настройку отслеживания изменения статуса контрола.
   */
  ngAfterViewInit() {
    this.connectDisablePanel();
    this.connectControlStatusChange();
    this.connectChangeControlValue();
  }

  /**
   * @private
   * @description Блокирует закрытие выбора опций при клике и обновляет значение опций.
   */
  private connectDisablePanel() {
    this.autocompleteOptions.nativeElement.addEventListener('click', (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault();
      this.updateOptions(event);
    }, true);
  }

  /**
   * @private
   * @description Осуществляет выбор\удаление опции при клике.
   * @param {UIEvent} event событие нажатия или tap-а.
   */
  private updateOptions(event: UIEvent) {
    let optionIdx = this.getOptionIndexByClick(event.target as HTMLElement)
    if (!this.options || isNaN(optionIdx) || optionIdx < 0) {
      return;
    }
    const option = this.options[optionIdx];
    if ((this.hasDisabledOptions && !option?.disabled) || !this.hasDisabledOptions) {
      this.onSelectionChange(option.value);
    }
  }

  /**
   * @private
   * @description Поиск индекса опции на которую кликнули.
   * @param {HTMLElement} element элемент выбранной опции.
   * @return {number} - индекс выбранной опции в масиве options.
   */
  private getOptionIndexByClick(element: HTMLElement): number {
    let optionIdx = -1;
    if (element.nodeName === 'MAT-OPTION') {
      optionIdx = Number(element.id?.split('-').reverse()?.[0])
    } else if (element.offsetParent?.nodeName === 'MAT-OPTION') {
      optionIdx = Number(element.offsetParent?.id?.split('-').reverse()?.[0]);
    }
    return optionIdx;
  }

  /**
   * @private
   * @description Подключает отслеживание изменений статуса основного контрола.
   * @description Обновляет статус контрола поиска в соответствии с основным контролом.
   */
  private connectControlStatusChange() {
    this.updateSearchControlStatus(this.control.status);
    this.control.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(status => {
      this.updateSearchControlStatus(status);
    });
  }

  /**
   * @private
   * @description Проверяет изменение значения контрола и производит скролл вправо.
   * */
  private connectChangeControlValue() {
    this.control.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(100)).subscribe(() => {
      this.cdr.detectChanges();
      this.scrollToRight();
    });
  }

  /**
   * @public
   * @description Производит скролл вправо.
   * */
  public scrollToRightByClick() {
    this.autocompleteChipRow.sbiChipRow.nativeElement?.scrollBy({ left: 24, behavior: 'smooth' });
  }

  /**
   * @private
   * @description Обновляет статус контрола поиска в соответствии с переданным статусом.
   * @param {FormControlStatus} status - Статус контрола.
   */
  private updateSearchControlStatus(status: FormControlStatus) {
    if (status === 'INVALID') {
      this.searchControl.addValidators(validator(true));
    } else {
      this.searchControl.clearValidators();
    }
    this.searchControl[status === 'DISABLED' ? 'disable' : 'enable']();
  }

  /**
   * @override
   * Обработчик изменений входных свойств компонента.
   * @param {SimpleChanges} changes - Объект с изменениями входных свойств.
   */
  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['options']) {
      this.setSelectedByControlValue();
    }
    if (changes['touched'] && this.control.touched && !this.searchControl.touched) {
      this.searchControl.markAsTouched();
    }
  }

  /**
   * @private
   * @description Устанавливает выбранные элементы на основе значения контрола.
   */
  private setSelectedByControlValue() {
    this.selection.clear();
    (this.control.value || []).forEach(elem => this.selection.select(elem));
  }

  /**
   * @public
   * @description Удаляет выбранный чип.
   * @param {T} value - Значение, которое нужно удалить.
   */
  public removeChip(value: T) {
    this.changeControlValue(value);
    this.searchControl.setValue('');
  }

  /**
   * @public
   * @override
   * @description Обрабатывает событие выбора элемента из выпадающего списка.
   * @param {T} val - Событие выбора элемента.
   */
  public override onSelectionChange(val: T) {
    super.onSelectionChange(val);
    this.changeControlValue(val as T);
    this.searchControl.setValue('');
    this.scrollToRight();
  }

  /**
   * @private
   * @description Изменяет значение контрола, добавляя или удаляя выбранный элемент.
   * @param {T} value - Значение для добавления или удаления.
   */
  private changeControlValue(value: T) {
    const values: T[] = this.control.value || [];
    if (this.selection.isSelected(value)) {
      this.control.setValue(values.filter(elem => !this.compareFn(elem, value)));
    } else {
      this.control.setValue(values.concat(value));
    }
  }

  /**
   * @public
   * @description Функция скролла chip-ов вправо.
   * */
  public scrollToRight() {
    this.autocompleteChipRow.sbiChipRow.nativeElement?.scrollBy({ left: 9999, behavior: 'smooth' });
  }

  /**
   * @public
   * @description После задержки в 100 миллисекунд кликает по полю.ввода, чтобы активировать элемент.
   */
  public activeInput() {
    this.cdr.detectChanges();
    setTimeout(() => this.autocompleteInput.nativeElement.click(), 100);
  }

  /**
   * @public
   * @override
   * @description Очищает контрол при нажатии на кнопку очистки.
   * @param {Event} event - Событие клика.
   */
  public override onClearControl(event: Event) {
    super.onClearControl(event);
    this.control.setValue([]);
    this.searchControl.setValue('');
  }

  /**
   * @public
   * @description Обрабатывает событие потери фокуса полем ввода.
   * @param {Event} event - Событие потери фокуса.
   */
  public onInputBlur(event: Event) {
    this.control.markAsTouched();
  }

  /**
   * @public
   * @description Выделяет или убирает выделение всех элементов в списке.
   */
  public changeSelectionAll() {
    if (this.allIsSelected) {
      this.selection.clear();
      this.control.setValue([]);
      this.searchControl.setValue('');
      this.selectAllEvent.emit('clear');
    } else {
      const values = (this.options || []).map(option => option.value);
      this.selection.select(...values);
      this.control.setValue(values);
      this.selectAllEvent.emit('selectAll');
    }
  }

  /**
   * @public
   * @getter
   * @description Проверяет выделены ли все элементы.
   * @return {boolean}
   */
  public get allIsSelected(): boolean {
    if (!this.options) {
      return false;
    }
    return this.selection.selected.length === this.options.length;
  }

  /**
   * @public
   * @override
   * @description Определяет заблокирована опция для выбора или нет.
   * @param {SbiSelectableItem<T>} option
   * @return boolean
   */
  public override isDisabledOption(option: SbiSelectableItem<T>) {
    if (!this.selection.isSelected(option.value) && this.selection.selected.length >= this.maxElementsCount) {
      return true
    }
    return super.isDisabledOption(option);
  }

  /**
   * @override
   * Обработчик уничтожения компонента.
   */
  override ngOnDestroy() {
    super.ngOnDestroy();

    this.autocompleteOptions.nativeElement.removeEventListener('click', () => {
    }, true);
  }
}
