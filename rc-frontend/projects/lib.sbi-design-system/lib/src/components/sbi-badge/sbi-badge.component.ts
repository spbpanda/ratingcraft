import { Component, Input } from '@angular/core';
import { SbiBadgeSize, SbiBadgeType } from './sbi-badge.models';
import { NgClass, NgIf } from '@angular/common';

/**
 * Компонент для отображения бейджа с текстовым содержимым.
 *
 * Поддерживает различные размеры и типы стилей.
 * Можно дополнительно использовать ng-content с селекторами "before-label" и "after-label" для размещения
 * контента до и после основного текста бейджа.
 *
 * Принимает несколько ng-content для отображения контента:
 * 1. before-label - контент, отображаемы до label;
 * 2. after-label - контент, отображаемы после label;
 *
 * @Component
 * @selector: 'sbi-badge'
 * @standalone: true
 * @imports: [NgIf, NgClass]
 * @templateUrl: './sbi-badge.component.html'
 * @styleUrl: './sbi-badge.component.scss'
 */
@Component({
  selector: 'sbi-badge',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './sbi-badge.component.html',
  styleUrl: './sbi-badge.component.scss'
})
export class SbiBadgeComponent {
  /**
   * @public
   * @description Размер бейджа. Может быть 'small' или 'large'.
   * @type {'small' | 'large'}
   * @defaultValue 'large'
   */
  @Input() public size: SbiBadgeSize = 'large';

  /**
   * @public
   * @description Тип (стиль) бейджа. Определяет цветовую схему и визуальное оформление.
   * Возможные значения: 'neutral', 'tint', 'accent'.
   * @type {'neutral' | 'tint' | 'accent'}
   * @defaultValue 'accent'
   */
  @Input() public type: SbiBadgeType = 'accent';

  /**
   * @public
   * @description Текстовое содержимое бейджа.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public content: string = '';
}
