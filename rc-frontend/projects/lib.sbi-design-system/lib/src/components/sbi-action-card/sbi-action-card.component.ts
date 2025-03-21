import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ACTION_CARD_ARROW_SVG_ICON } from '../../const/icons';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { NgClass, NgIf } from '@angular/common';

/**
 * Компонент, отображающий элемент активной карточки элемента. В основном используется для отображения информации о  элементе
 * (например транспортном средстве или человеке)
 *
 * @Component
 * @selector: 'sbi-action-card'
 * @standalone: true
 * @imports: [SbiIconComponent, NgIf, NgClass]
 * @templateUrl: './sbi-action-card.component.html'
 * @styleUrl: './sbi-action-card.component.scss'
 */
@Component({
  selector: 'sbi-action-card',
  standalone: true,
  imports: [
    SbiIconComponent,
    NgIf,
    NgClass
  ],
  templateUrl: './sbi-action-card.component.html',
  styleUrl: './sbi-action-card.component.scss'
})
export class SbiActionCardComponent {

  /**
   * Тип карточки.
   * @type {'default' | 'tint'}
   */
  @Input() appearance: 'default' | 'tint' = 'default';

  /**
   * Размер карточки.
   * @type {'large' | 'small'}
   */
  @Input() size: 'large' | 'small' = 'large';

  /**
   * Лейбл для карточки.
   * @type {string}
   */
  @Input() title: string = '';

  /**
   * Примечание для карточки.
   * @type {string | undefined}
   */
  @Input() subtitle?: string;

  /**
   * Какой элемент title или subtitle отображать сверху.
   * @type {boolean}
   */
  @Input() titleFirst = true;

  /**
   * svg код кастомной иконки, располагающейся в правой части карточки.
   * @type {boolean}
   */
  @Input() rightIcon: string = ACTION_CARD_ARROW_SVG_ICON;

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId: string = 'sbi-action-card';

  /**
   * Событие нажатия на карточку.
   * @type {EventEmitter<Event>()}
   */
  @Output() cardClick = new EventEmitter<Event>();

  /**
   * Функция - обработчик. Обрабатывает событие нажатия на карточку.
   * @param {Event} event - ивент события (клик)
   */
  public onClick(event: Event) {
    this.cardClick.emit(event);
  }
}
