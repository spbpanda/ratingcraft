import { Component, Input } from '@angular/core';
import { BadgeSize, BadgeTypes } from '../../models/badge.types';
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
   * Размер бейджа. Может быть 'small' или 'large'.
   * @type {BadgeSize}
   */
  @Input() size: BadgeSize = 'large';

  /**
   * Тип (стиль) бейджа. Определяет цветовую схему и визуальное оформление.
   * Возможные значения: 'neutral', 'tint', 'accent'.
   * @type {BadgeTypes}
   */
  @Input() type: BadgeTypes = 'accent';

  /**
   * Текстовое содержимое бейджа.
   * @type {string}
   */
  @Input() content = '';
}
