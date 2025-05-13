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
   * @public
   * @description Список чипов.
   * @type {Array<T>}
   * @defaultValue []
   */
  @Input() public suggestChips: Array<T> = [];

  /**
   * @public
   * @description Список выбранных чипов.
   * @type {Array<T>}
   * @defaultValue []
   */
  @Input() public selectedChips: Array<T> = [];

  /**
   * @public
   * @description Функция отображения текста внутри чипа.
   * @type {(value: T) => string}
   * @defaultValue (value): string => JSON.stringify(value)
   */
  @Input() public displayFn: (value: T) => string = (value): string => JSON.stringify(value);

  /**
   * @public
   * @description Функция сопоставления чипов. Нужна для определения активных чипов.
   * @type {(value: T) => string}
   * @defaultValue (elem1, elem2): boolean => JSON.stringify(elem1) === JSON.stringify(elem2)
   */
  @Input() public compareFn: (elem1: T, elem2: T) => boolean = (elem1, elem2): boolean =>
    JSON.stringify(elem1) === JSON.stringify(elem2);

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-suggest-chip-row'
   */
  @Input() public testId: string = 'sbi-suggest-chip-row';

  /**
   * @public
   * @description Событие, которое срабатывает при клике на чип.
   * @type {EventEmitter<T>}
   */
  @Output() public toggleSuggestChip: EventEmitter<T> = new EventEmitter<T>();

  /**
   * @public
   * @description Проверяет активен ли чип или нет.
   * @param {T} suggestChip - Проверяемый чип.
   * @return {boolean}
   */
  public isActiveChip(suggestChip: T): boolean {
    return this.selectedChips.some(elem => this.compareFn(elem, suggestChip));
  }

  /**
   * @public
   * @description Обрабатывает клик на чип.
   * Вызывает событие `toggleSuggestChip` с выбранным чипом.
   * @param {T} suggestChip - Чип, по которому был сделан клик.
   */
  public onClick(suggestChip: T) {
    this.toggleSuggestChip.emit(suggestChip);
  }
}
