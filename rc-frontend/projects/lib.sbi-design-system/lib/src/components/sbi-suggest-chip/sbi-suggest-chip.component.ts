import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

/**
 * Компонент для отображения элемента-чипа-выбора.
 *
 * @Component
 * @selector: 'sbi-suggest-chip'
 * @standalone: true
 * @imports: [NgClass]
 * @templateUrl: './sbi-suggest-chip.component.html'
 * @styleUrl: './sbi-suggest-chip.component.scss'
 */
@Component({
  selector: 'sbi-suggest-chip',
  standalone: true,
  imports: [NgClass],
  templateUrl: './sbi-suggest-chip.component.html',
  styleUrl: './sbi-suggest-chip.component.scss'
})
export class SbiSuggestChipComponent<T> {
  /**
   * Лейбл чипа.
   * @type {string}
   */
  @Input() label = '';

  /**
   * Выбран чир или нет.
   * @type {boolean}
   */
  @Input() active = false;

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId = 'sbi-suggest-chip';
}
