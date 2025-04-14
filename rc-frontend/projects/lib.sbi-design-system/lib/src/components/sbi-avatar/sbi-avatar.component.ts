import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SbiAvatarGender, SbiAvatarSize } from '../../models/avatar.types';
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
   * Размер аватара. Может быть 'large', 'regular', 'small' или 'extra-small'.
   * @type {SbiAvatarSize}
   */
  @Input() size: SbiAvatarSize = 'regular';

  /**
   * URL изображения аватара. Если задан, показывается изображение.
   * @type {string}
   */
  @Input() imageUrl = '';

  /**
   * Пол пользователя
   * @type {SbiAvatarGender}
   */
  @Input() gender: SbiAvatarGender = 'MALE';

  /**
   * Инициалы пользователя. Используются, если не задан imageUrl.
   * @type {string}
   */
  @Input() initials = '';

  /**
   * Показывать ли бейдж (зеленую точку).
   * @type {boolean}
   */
  @Input() showBadge = true;
  
  /**
   * Иконка из Дизайн Системы, отображаемой в правом нижнем углу аватара (только для размера 'large').
   * @type {string}
   */
  @Input() sbiIcon = CHEVRON_DOWN_OUTLINE;
  
  /**
   * Событие клика по иконке.
   * @type {EventEmitter<MouseEvent>}
   */
  @Output() iconClick = new EventEmitter<MouseEvent>();
  
  /**
   * Событие клика по аватару.
   * @type {EventEmitter<MouseEvent>}
   */
  @Output() avatarClick = new EventEmitter<MouseEvent>();
  
  /**
   * Обработчик клика по иконке.
   * @param {MouseEvent} event - событие клика
   */
  onIconClick(event: MouseEvent): void {
    event.stopPropagation();
    this.iconClick.emit(event);
  }
  
  /**
   * Обработчик клика по аватару.
   * @param {MouseEvent} event - событие клика
   */
  onAvatarClick(event: MouseEvent): void {
    // Если иконка не отображается или iconClick не имеет подписчиков,
    // то клик по аватару будет обработан
    this.avatarClick.emit(event);
  }
} 