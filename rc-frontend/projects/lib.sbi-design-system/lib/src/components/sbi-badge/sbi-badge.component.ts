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
   * Возможные значения: 'accent', 'primary', 'secondary', 'warning', 'error', 'success'.
   * @type {BadgeTypes}
   */
  @Input() type: BadgeTypes = 'accent';

  /**
   * Текстовое содержимое бейджа.
   * @type {string}
   */
  @Input() content = '';
}
