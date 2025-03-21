import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SbiSuggestChipComponent } from '../sbi-suggest-chip/sbi-suggest-chip.component';

/**
 * Компонент для отображения списка чипов-выбора.
 *
 * @Component
 * @selector: 'sbi-suggest-chip-row'
 * @standalone: true
 * @imports: [SbiSuggestChipComponent]
 * @templateUrl: './sbi-suggest-chip-row.component.html'
 * @styleUrl: './sbi-suggest-chip-row.component.scss'
 */
@Component({
  selector: 'sbi-suggest-chip-row',
  standalone: true,
  imports: [SbiSuggestChipComponent],
  templateUrl: './sbi-suggest-chip-row.component.html',
  styleUrl: './sbi-suggest-chip-row.component.scss'
})
export class SbiSuggestChipRowComponent<T> {
  /**
   * Список чипов.
   * @type {Array<T>}
   */
  @Input() suggestChips: Array<T> = [];

  /**
   * Список выбранных чипов.
   * @type {Array<T>}
   */
  @Input() selectedChips: Array<T> = [];

  /**
   * Функция отображения текста внутри чипа.
   * @type {(value: T) => string}
   */
  @Input() displayFn: (value: T) => string = value => JSON.stringify(value);

  /**
   * Функция сопоставления чипов. Нужна для определения активных чипов.
   * @type {(value: T) => string}
   */
  @Input() compareFn: (elem1: T, elem2: T) => boolean = (elem1, elem2) =>
    JSON.stringify(elem1) === JSON.stringify(elem2);

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId = 'sbi-suggest-chip-row';

  /**
   * Событие, которое срабатывает при клике на чип.
   * @type {EventEmitter<T>}
   */
  @Output() toggleSuggestChip = new EventEmitter<T>();

  /**
   * Проверяет активен ли чип или нет.
   * @param {T} suggestChip - Проверяемый чип.
   */
  public isActiveChip(suggestChip: T) {
    return this.selectedChips.some(elem => this.compareFn(elem, suggestChip));
  }

  /**
   * Обрабатывает клик на чип.
   * Вызывает событие `toggleSuggestChip` с выбранным чипом.
   * @param {T} suggestChip - Чип, по которому был сделан клик.
   */
  public onClick(suggestChip: T) {
    this.toggleSuggestChip.emit(suggestChip);
  }
}
