import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { BUTTON_ARROWS_DOWN } from '../../const/icons';
import { SbiMenuButtonSize, SbiMenuButtonType } from '../../models/sbi-menu-button.types';

/**
 * Компонент кнопки с выпадающим меню
 *
 * @Component
 * @selector: 'sbi-menu-button'
 * @standalone: true
 * @imports: [NgClass, NgIf, SbiIconComponent]
 * @templateUrl: './sbi-menu-button.component.html'
 * @styleUrl: './sbi-menu-button.component.scss'
 * @host: { '[class.disabled]': 'disabled' },
 */
@Component({
  selector: 'sbi-menu-button',
  standalone: true,
  imports: [NgClass, NgIf, SbiIconComponent],
  templateUrl: './sbi-menu-button.component.html',
  styleUrl: './sbi-menu-button.component.scss',
  host: {
    '[class.disabled]': 'disabled',
  },
})
export class SbiMenuButtonComponent {
  public BUTTON_ARROWS_DOWN = BUTTON_ARROWS_DOWN;
  
  /**
   * @public
   * @description Тип кнопки
   * @type {'outline' | 'ghost'}
   * @defaultValue 'outline'
   */
  @Input() public type: SbiMenuButtonType = 'outline';

  /**
   * @public
   * @description Размер кнопки
   * @type {'large' | 'small'}
   * @defaultValue 'large'
   */
  @Input() public size: SbiMenuButtonSize = 'large';

  /**
   * @public
   * @description Если true, кнопка будет отключена
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public disabled: boolean = false;

  /**
   * @public
   * @description Текст кнопки
   * @type {string}
   * @defaultValue ''
   */
  @Input() public label: string = '';

  /**
   * @public
   * @description Id для авто тестов
   * @type {string}
   * @defaultValue 'sbi-menu-button'
   */
  @Input() public testId: string = 'sbi-menu-button';

  /**
   * @public
   * @description Событие при открытии меню
   * @type {EventEmitter<void>}
   */
  @Output() public menuOpen = new EventEmitter<void>();

  /**
   * @public
   * @description Событие при закрытии меню
   * @type {EventEmitter<void>}
   */
  @Output() public menuClose: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @public
   * @description Ссылка на контейнер меню для отслеживания кликов вне меню
   * @type {ElementRef}
   */
  @ViewChild('menuContainer') menuContainer!: ElementRef;

  /**
   * @public
   * @description Флаг, указывающий открыто ли выпадающее меню
   * @type {boolean}
   * @defaultValue false
   */
  public isMenuOpen: boolean = false;

  /**
   * @public
   * @description Переключение состояния меню (открытие/закрытие)
   * @returns {void}
   */
  public toggleMenu(): void {
    if (this.disabled) {
      return;
    }

    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * @public
   * @description Закрывает меню и эмитит событие menuClose
   * @returns {void}
   */
  public closeMenu(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      this.menuClose.emit();
    }
  }

  /**
   * @public
   * @description Открывает меню (если не отключено) и эмитит событие menuOpen
   * @returns {void}
   */
  public openMenu(): void {
    if (!this.isMenuOpen && !this.disabled) {
      this.isMenuOpen = true;
      this.menuOpen.emit();
    }
  }

  /**
   * @public
   * @description Обработчик клика вне меню для автоматического закрытия меню
   * @param {MouseEvent} event - Событие клика мыши
   */
  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent): void {
    if (this.menuContainer && !this.menuContainer.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }
} 