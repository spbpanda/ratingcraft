import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
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

/**
 * Вспомогательная функция для создания валидатора, который всегда возвращает заданное состояние ошибки.
 * Используется для управления визуальным состоянием ошибки компонента ввода с автозаполнением.
 * 
 * @param {boolean} invalid - Признак ошибки, который будет возвращать валидатор.
 * @returns {Function} Функция-валидатор, которая возвращает null (валидно) или объект с ошибкой.
 */
function validator(invalid: boolean = false) {
  return () => (invalid ? { invalid: true } : null);
}

/**
 * Компонент автозаполнения с поддержкой множественного выбора.
 * 
 * Предоставляет поле ввода с автозаполнением и возможностью выбора нескольких значений.
 *
 * @Component
 * @selector: 'sbi-autocomplete'
 * @standalone: true
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
  ],
})
export class SbiAutocompleteComponent<T> extends SbiComponentWithAutocomplete<T> implements AfterViewInit {
  /**
   * Ссылка на элемент ввода в DOM.
   * Используется для управления фокусом и получения введенного значения.
   */
  @ViewChild('autocompleteInput') autocompleteInput!: ElementRef<HTMLInputElement>;
  
  /**
   * Ссылка на компонент строки с чипами в DOM.
   * Используется для отображения выбранных элементов в виде чипов.
   */
  @ViewChild('autocompleteChipRow') autocompleteChipRow!: SbiChipRowComponent<T>;

  /**
   * Форм-контрол для управления выбранными значениями.
   * Переопределяет родительский контрол для поддержки массива значений.
   * @type {FormControl<any>}
   */
  @Input() declare control: FormControl<any>;
  
  /**
   * Максимальное количество элементов, которые можно выбрать.
   * @type {number}
   */
  @Input() maxElementsCount = 99999999;
  
  /**
   * Флаг, указывающий, был ли компонент "затронут" (touched).
   * Используется для контроля отображения состояния ошибок валидации.
   * @type {boolean}
   */
  @Input() touched = false;

  /**
   * События изменения текста поиска.
   * Эмитится при вводе текста в поле поиска.
   * @type {EventEmitter<string | null>}
   */
  @Output() searchChangeEvent = new EventEmitter<string | null>();

  /**
   * Модель выбранных элементов.
   * Используется для отслеживания состояния выбора для каждого элемента.
   * @type {SelectionModel<T>}
   * @public
   */
  public selection = new SelectionModel<T>(true, [], true, this.compareFn);
  
  /**
   * Контрол для управления текстом поиска.
   * Отделен от основного контрола, который хранит выбранные значения.
   * @type {FormControl<string | null>}
   * @public
   */
  public searchControl = new FormControl('');

  /**
   * Возвращает признак, что достигнуто максимальное количество выбранных элементов.
   * @returns {boolean} True, если нельзя выбрать больше элементов.
   * @public
   */
  get disabledByMaxElems() {
    return (this.control.value as T[]).length >= this.maxElementsCount;
  }

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
   * Подключает фильтрацию опций на основе изменений в поле поиска.
   * @private
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
   * Подключает отслеживание изменений выбранных опций.
   * @private
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
    this.connectControlStatusChange();
  }

  /**
   * Подключает отслеживание изменений статуса основного контрола.
   * Обновляет статус контрола поиска в соответствии с основным контролом.
   * @private
   */
  private connectControlStatusChange() {
    this.updateSearchControlStatus(this.control.status);
    this.control.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(status => {
      this.updateSearchControlStatus(status);
    });
  }

  /**
   * Обновляет статус контрола поиска в соответствии с переданным статусом.
   * @param {FormControlStatus} status - Статус контрола.
   * @private
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
   * Обработчик изменений входных свойств компонента.
   * @param {SimpleChanges} changes - Объект с изменениями входных свойств.
   * @override
   */
  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['options']) {
      this.setSelectedByControlValue()
    }
    if (changes['touched'] && this.control.touched && !this.searchControl.touched) {
      this.searchControl.markAsTouched();
    }
  }

  /**
   * Устанавливает выбранные элементы на основе значения контрола.
   * @private
   */
  private setSelectedByControlValue() {
    this.selection.clear();
    ((this.control.value as T[]) || []).forEach(elem => this.selection.select(elem))
  }

  /**
   * Удаляет выбранный чип.
   * @param {T} value - Значение, которое нужно удалить.
   * @public
   */
  public removeChip(value: T) {
    this.changeControlValue(value);
    this.searchControl.setValue('');
  }

  /**
   * Обрабатывает событие выбора элемента из выпадающего списка.
   * @param {MatAutocompleteSelectedEvent} val - Событие выбора элемента.
   * @override
   * @public
   */
  public override onSelectionChange(val: MatAutocompleteSelectedEvent) {
    super.onSelectionChange(val);
    this.changeControlValue(val.option.value as T);
    this.searchControl.setValue('');
    this.scrollToRight();
  }

  /**
   * Изменяет значение контрола, добавляя или удаляя выбранный элемент.
   * @param {T} value - Значение для добавления или удаления.
   * @private
   */
  private changeControlValue(value: T) {
    const values: T[] = Array.isArray(this.control.value) ? this.control.value : [];
    if (this.selection.isSelected(value)) {
      this.control.setValue(values.filter(elem => !this.compareFn(elem, value)));
    } else {
      this.control.setValue(values.concat(value));
    }
  }

  /**
   * Прокручивает строку с чипами вправо для отображения последнего добавленного элемента.
   * @private
   */
  private scrollToRight() {
    setTimeout(() => {
      const element = this.autocompleteChipRow.sbiChipRow.nativeElement;
      element.scrollBy({ left: 999999, behavior: 'smooth' });
      setTimeout(() => this.autocompleteInput.nativeElement.click(), 100);
    });
  }

  /**
   * Очищает контрол при нажатии на кнопку очистки.
   * @param {Event} event - Событие клика.
   * @override
   * @public
   */
  public override onClearControl(event: Event) {
    super.onClearControl(event);
    this.control.setValue([]);
    this.searchControl.setValue('');
  }

  /**
   * Обрабатывает событие потери фокуса полем ввода.
   * @param {Event} event - Событие потери фокуса.
   * @public
   */
  public onInputBlur(event: Event) {
    this.control.markAsTouched();
  }
}
