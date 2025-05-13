import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BUTTON_ARROWS_RIGHT } from '../../const/icons';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { NgClass, NgIf } from '@angular/common';
import { SbiActionCardAppearance, SbiActionCardSize } from './sbi-action-card.models';

/**
 * Компонент, отображающий элемент активной карточки элемента. В основном используется для отображения информации о  элементе
 * (например транспортном средстве или человеке)
 *
 * Принимает ng-content для отображения контента.
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
  imports: [SbiIconComponent, NgIf, NgClass],
  templateUrl: './sbi-action-card.component.html',
  styleUrl: './sbi-action-card.component.scss'
})
export class SbiActionCardComponent {

  /**
   * @public
   * @description Тип карточки.
   * @type {'default' | 'tint'}
   * @defaultValue 'default'
   */
  @Input() public appearance: SbiActionCardAppearance = 'default';

  /**
   * @public
   * @description Размер карточки.
   * @type {'large' | 'small'}
   * @defaultValue 'large'
   */
  @Input() public size: SbiActionCardSize = 'large';

  /**
   * @public
   * @description Лейбл для карточки.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public title: string = '';

  /**
   * @public
   * @description Примечание для карточки.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public subtitle?: string;

  /**
   * @public
   * @description Какой элемент title или subtitle отображать сверху.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public titleFirst: boolean = true;

  /**
   * @public
   * @description svg код кастомной иконки, располагающейся в правой части карточки.
   * @type {boolean}
   * @defaultValue BUTTON_ARROWS_RIGHT
   */
  @Input() public rightIcon: string = BUTTON_ARROWS_RIGHT;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-action-card'
   */
  @Input() public testId: string = 'sbi-action-card';

  /**
   * @public
   * @description Событие нажатия на карточку.
   * @type {EventEmitter<Event>()}
   */
  @Output() public cardClick: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * @public
   * @description Функция - обработчик. Обрабатывает событие нажатия на карточку.
   * @param {Event} event - ивент события (клик)
   */
  public onClick(event: Event) {
    this.cardClick.emit(event);
  }
}
