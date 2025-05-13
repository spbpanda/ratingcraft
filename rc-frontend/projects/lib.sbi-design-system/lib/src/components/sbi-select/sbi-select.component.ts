import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectChange, MatSuffix } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiComponentWithOptions } from '../../classes/sbi-component-with-options';

/**
 * Компонент выбора из списка предопределенных опций.
 *
 * Представляет собой выпадающий список с возможностью выбора одного значения.
 * Расширяет базовый класс SbiComponentWithOptions для управления списком опций.
 *
 * Принимает ng-content - suffix-content - кастомный контент отображаемый после поля ввода.
 *
 * @Component
 * @selector: 'sbi-select'
 * @standalone: true
 * @templateUrl: './sbi-select.component.html'
 * @styleUrls: ['./sbi-select.component.scss']
 * @imports: [
 *   MatFormField,
 *   NgIf,
 *   MatSelect,
 *   ReactiveFormsModule,
 *   MatOption,
 *   SbiErrorComponent,
 *   NgForOf,
 *   MatSuffix,
 *   SbiIconComponent,
 *   MatLabel,
 * ]
 */
@Component({
  selector: 'sbi-select',
  templateUrl: './sbi-select.component.html',
  styleUrls: ['./sbi-select.component.scss'],
  standalone: true,
  imports: [
    MatFormField,
    NgIf,
    MatSelect,
    ReactiveFormsModule,
    MatOption,
    SbiErrorComponent,
    NgForOf,
    MatSuffix,
    SbiIconComponent,
    MatLabel,
  ],
})
export class SbiSelectComponent<T> extends SbiComponentWithOptions<T | string | null> {
  /**
   * @public
   * @description Функция сравнения для определения, какие элементы считать эквивалентными.
   * Используется при поиске и выделении выбранного элемента в списке опций.
   * @type {(elem1: T | string | number, elem2: T | string | number) => boolean}
   * @defaultValue (elem1, elem2): boolean => elem1 && elem2 && typeof elem1 === 'object' && typeof elem2 === 'object' ? JSON.stringify(elem1) === JSON.stringify(elem2) : elem1 === elem2;
   */
  @Input() public compareFn: (elem1: T | string | number, elem2: T | string | number) => boolean = (elem1, elem2): boolean =>
    elem1 && elem2 && typeof elem1 === 'object' && typeof elem2 === 'object'
      ? JSON.stringify(elem1) === JSON.stringify(elem2)
      : elem1 === elem2;

  /**
   * @public
   * @description Обрабатывает событие изменения выбранного значения в селекте.
   * Устанавливает фокус в неактивное состояние и эмитит событие с выбранным значением.
   * @param {MatSelectChange} val - Событие изменения селекта, содержащее новое выбранное значение.
   */
  public onSelectionChange(val: MatSelectChange) {
    this.focused.set(false);
    this.selectionChange.emit(val.value);
  }
}
