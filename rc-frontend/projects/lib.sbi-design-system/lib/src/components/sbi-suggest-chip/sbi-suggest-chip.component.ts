import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

/**
 * Компонент для отображения элемента-чипа-выбора.
 *
 * @Component
 * @selector: 'sbi-suggest-chip'
 * @standalone: true
 * @imports: [NgClass]
 * @templateUrl: './sbi-suggest-text-list.component.html'
 * @styleUrl: './sbi-suggest-text-list.component.scss'
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
   * @public
   * @description Лейбл чипа.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public label: string = '';

  /**
   * @public
   * @description Выбран чир или нет.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public active: boolean = false;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-suggest-chip'
   */
  @Input() public testId: string = 'sbi-suggest-chip';
}
