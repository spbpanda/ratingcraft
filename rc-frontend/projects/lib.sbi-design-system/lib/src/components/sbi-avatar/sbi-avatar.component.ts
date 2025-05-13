import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SbiAvatarGender, SbiAvatarSize } from './sbi-avatar.models';
import { SbiBadgeComponent } from '../sbi-badge/sbi-badge.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { CHEVRON_DOWN_OUTLINE } from '../../public-api';


/**
 * Компонент для отображения аватара пользователя.
 *
 * Поддерживает различные размеры.
 * Если передан imageUrl, отображается изображение, иначе - инициалы.
 * Может отображать бейдж и иконку с возможностью клика.
 *
 * @Component
 * @selector: 'sbi-avatar'
 * @standalone: true
 * @imports: [NgIf, SbiBadgeComponent]
 * @templateUrl: './sbi-avatar.component.html'
 * @styleUrl: './sbi-avatar.component.scss'
 */
@Component({
  selector: 'sbi-avatar',
  standalone: true,
  imports: [
    SbiBadgeComponent,
    SbiIconComponent
  ],
  templateUrl: './sbi-avatar.component.html',
  styleUrl: './sbi-avatar.component.scss'
})
export class SbiAvatarComponent {
  /**
   * @public
   * @description Размер аватара. Может быть 'large', 'regular', 'small' или 'extra-small'.
   * @type {'large' | 'regular' | 'small' | 'extra-small'}
   * @defaultValue 'regular'
   */
  @Input() public size: SbiAvatarSize = 'regular';

  /**
   * @public
   * @description URL изображения аватара. Если задан, показывается изображение.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public imageUrl: string = '';

  /**
   * @public
   * @description Пол пользователя
   * @type {SbiAvatarGender}
   * @defaultValue 'MALE'
   */
  @Input() public gender: SbiAvatarGender = 'MALE';

  /**
   * @public
   * @description Инициалы пользователя. Используются, если не задан imageUrl.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public initials: string = '';

  /**
   * @public
   * @description Показывать ли бейдж (зеленую точку).
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public showBadge: boolean = true;

  /**
   * @public
   * @description Иконка из Дизайн Системы, отображаемой в правом нижнем углу аватара (только для размера 'large').
   * @type {string}
   * @defaultValue CHEVRON_DOWN_OUTLINE
   */
  @Input() public sbiIcon: string = CHEVRON_DOWN_OUTLINE;

  /**
   * @public
   * @description Событие клика по иконке.
   * @type {EventEmitter<MouseEvent>}
   */
  @Output() public iconClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * @public
   * @description Событие клика по аватару.
   * @type {EventEmitter<MouseEvent>}
   */
  @Output() public avatarClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  /**
   * @public
   * @description Обработчик клика по иконке.
   * @param {MouseEvent} event - событие клика
   */
  public onIconClick(event: MouseEvent): void {
    event.stopPropagation();
    this.iconClick.emit(event);
  }

  /**
   * @public
   * @description Обработчик клика по аватару.
   * @param {MouseEvent} event - событие клика
   */
  public onAvatarClick(event: MouseEvent): void {
    // Если иконка не отображается или iconClick не имеет подписчиков,
    // то клик по аватару будет обработан
    this.avatarClick.emit(event);
  }
}
