import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { MatLabel } from '@angular/material/select';
import { SbiComponentWithAutocomplete } from '../../classes/sbi-component-with-autocomplete';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { debounceTime } from 'rxjs';
import { SbiMultiUppercaseDirective } from '../../directives/sbi-multi-uppercase.directive';
import { SbiInputModeDirective } from '../../directives/sbi-input-mode.directive';
import { SbiTitleCaseDirective } from '../../directives/sbi-title-case.directive';
import { SbiNameUppercaseDirective } from '../../directives/sbi-name-uppercase.directive';
import { MaskitoDirective } from '@maskito/angular';

/**
 * Компонент выпадающего списка (dropdown) с функцией автозаполнения.
 *
 * Предоставляет поле ввода с выпадающим списком опций и возможностью фильтрации.
 *
 * Принимает несколько ng-content для отображения контента:
 * 1. prefix-icon - контент для отображения иконки перед полем ввода;
 * 2. suffix-icon - контент для отображения иконки после поля ввода;
 * 3. suffix-content - кастомный контент отображаемый после поля ввода.
 *
 * @Component
 * @selector: 'sbi-dropdown'
 * @standalone: true
 * @templateUrl: './sbi-dropdown.component.html'
 * @styleUrls: ['./sbi-dropdown.component.scss']
 */
@Component({
  selector: 'sbi-dropdown',
  templateUrl: './sbi-dropdown.component.html',
  styleUrls: ['./sbi-dropdown.component.scss'],
  standalone: true,
  imports: [
    MatFormField,
    NgIf,
    MatInput,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    SbiErrorComponent,
    MatSuffix,
    SbiIconComponent,
    MatLabel,
    MatPrefix,
    MatOption,
    AsyncPipe,
    SbiMultiUppercaseDirective,
    SbiInputModeDirective,
    SbiTitleCaseDirective,
    SbiNameUppercaseDirective,
    MaskitoDirective,
    NgForOf,
  ],
})
export class SbiDropdownComponent<T> extends SbiComponentWithAutocomplete<T> {
  /**
   * Ссылка на элемент ввода в DOM.
   * @private
   */
  @ViewChild('input') private input!: ElementRef<HTMLInputElement>;

  /**
   * Флаг, определяющий, нужно ли удалять специальные символы при вводе.
   * @type {boolean}
   */
  @Input() dropSpecialCharacters = true;

  /**
   * Флаг, определяющий, активно ли автоматическое преобразование текста в верхний регистр по определенным правилам.
   * @type {boolean}
   */
  @Input() inputMultiUppercaseActive = false;

  /**
   * Флаг, определяющий, активно ли автоматическое преобразование имен в верхний регистр.
   * @type {boolean}
   */
  @Input() inputNameUppercaseActive = false;

  /**
   * Флаг, определяющий, нужно ли показывать иконку стрелки (шеврон) для выпадающего списка.
   * @type {boolean}
   */
  @Input() showChevron = true;

  /**
   * Инициализирует компонент.
   * Вызывает родительский метод ngOnInit и подключает фильтрацию опций.
   * @override
   */
  override ngOnInit() {
    super.ngOnInit();
    this.connectFilterOptions();
  }

  /**
   * Подключает фильтрацию опций на основе изменений значения контрола.
   * Использует debounceTime и distinctUntilChanged для оптимизации частоты вызовов.
   * @private
   */
  private connectFilterOptions() {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(50), distinctUntilChanged())
      .subscribe(value => !this.customFilterVoid && this.filterFunc(value || ''));
  }

  /**
   * Обрабатывает изменения входных свойств компонента.
   * Фильтрует опции на основе текущего значения и обновляет значение элемента ввода при изменении маски.
   * @param {SimpleChanges} changes - Объект с изменениями входных свойств.
   * @override
   */
  override ngOnChanges(changes: SimpleChanges) {
    this.filterFunc(this.control.value || '');
    if (changes['mask'] && typeof this.control.value === 'string' && this.input?.nativeElement) {
      this.input.nativeElement.value = this.control.value;
    }
  }

  /**
   * Очищает контрол при нажатии на кнопку очистки.
   * @param {Event} event - Событие клика.
   * @override
   * @public
   */
  public override onClearControl(event: Event) {
    super.onClearControl(event);
    this.control.setValue(null);
  }
}
