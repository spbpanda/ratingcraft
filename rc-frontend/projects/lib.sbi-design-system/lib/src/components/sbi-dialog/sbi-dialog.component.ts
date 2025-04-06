import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SbiResizableDirective } from '../../directives/sbi-resize.directive';
import { SbiSwipeComponent } from '../../classes/sbi-swipe-component';
import { NgClass, NgIf } from '@angular/common';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { CLEAR_ICON_SVG, SUCCESS_DIALOG_ICON } from '../../const/icons';
import { SbiDividerComponent } from '../sbi-divider/sbi-divider.component';
import { SbiButtonComponent } from '../sbi-button/sbi-button.component';

/**
 * Компонент - обёртка для отображения модального окна.
 *
 * Позволяет выводить контент в модальном окне. Модальное окно адаптировано под десктоп, планшет и мобильное устройство.
 * На мобильном устройстве есть возможность свайпом вниз закрыть модальное окно.
 *
 * Может принимать ng-content
 * 1. dialog-header - заголовок;
 * 2. dialog-buttons - контейнер кнопок;
 * 3. dialog-icon - иконка заголовка модального окна.
 *
 * @Component
 * @selector: 'sbi-dialog'
 * @standalone: true
 * @imports: [SbiResizableDirective, NgIf, SbiIconComponent, NgClass, SbiDividerComponent, SbiButtonComponent]
 * @templateUrl: './sbi-dialog.component.html'
 * @styleUrls: [./sbi-dialog.component.scss]
 */
@Component({
  selector: 'sbi-dialog',
  standalone: true,
  imports: [SbiResizableDirective, NgIf, SbiIconComponent, NgClass, SbiDividerComponent, SbiButtonComponent],
  templateUrl: './sbi-dialog.component.html',
  styleUrls: ['./sbi-dialog.component.scss'],
})
export class SbiDialogComponent extends SbiSwipeComponent {

  /**
   * Текст заголовка модального окна.
   * @type {string | undefined}
   */
  @Input() title?: string;

  /**
   * Текст подзаголовка модального окна.
   * @type {string | undefined}
   */
  @Input() note?: string;

  /**
   * Флаг - показывать иконку в заголовке модального окна.
   * @type {boolean}
   */
  @Input() showIcon: boolean = false;

  /**
   * Флаг - показывать иконку закрытия модального окна.
   * @type {boolean}
   */
  @Input() showCloseIcon: boolean = true;

  /**
   * Минимальный размер модального окна.
   * @type {'large' | 'small'}
   */
  @Input() size: 'large' | 'small' = 'large'

  /**
   * Svg код иконка заголовка модального окна.
   * @type {string}
   */
  @Input() icon: string = SUCCESS_DIALOG_ICON;

  /**
   * Тип модального окна.
   * @type {'illustration' | 'header'}
   */
  @Input() type: 'illustration' | 'header' = 'illustration';

  /**
   * Дельта (в пикселях) насколько пользователю нужно свайпнуть модальное окно до его закрытия.
   * @type {number | undefined}
   */
  @Input() openCloseDelta?: number;

  /**
   * Максимальная высота модального окна в мобильной вестии.
   * @type {number}
   */
  @Input() maxHeight: number = 700;

  /**
   * Флаг, указывающий на возможность скролить контент модального окна.
   * @type {boolean}
   */
  @Input() scrollableContent: boolean = true;

  /**
   * Текст основной кнопки модального окна.
   * @type {string | undefined}
   */
  @Input() submitButtonTitle?: string;

  /**
   * Текст вспомогательной кнопки модального окна.
   * @type {string | undefined}
   */
  @Input() secondButtonTitle?: string;

  /**
   * Идентификатор для авто тестов.
   * @type {string}
   */
  @Input() testId: string = 'sbi-dialog-test-id';

  /**
   * Событие клика на крестик.
   * @type {EventEmitter<void>}
   */
  @Output() close: EventEmitter<void> = new EventEmitter();

  /**
   * Событие клика на основную кнопку.
   * @type {EventEmitter<void>}
   */
  @Output() submitClick: EventEmitter<void> = new EventEmitter();

  /**
   * Событие клика на вспомогательную кнопку.
   * @type {EventEmitter<void>}
   */
  @Output() secondaryClick: EventEmitter<void> = new EventEmitter();

  /**
   * Возвращает SVG иконку для закрытия модального окна.
   * @returns {string} SVG строка иконки закрытия модального окна.
   */
  public get closeIcon(): string {
    return CLEAR_ICON_SVG;
  }

  /**
   * Возвращает актуальный размер модального окна.
   * @returns {'large' | 'small'} актуальный размер модального окна.
   */
  public get adaptiveSize(): 'large' | 'small' {
    return SbiSwipeComponent.isDesktop(window) ? this.size : 'small';
  }

  /**
   * Возвращает флаг - текущее устройство мобильное или нет.
   * @returns {boolean} текущее устройство мобильное или нет.
   */
  public get isMobile(): boolean {
    return SbiSwipeComponent.isMobile(window);
  }

  /**
   * Возвращает флаг - текущее модальное окно активно для закрытия свайпом или нет.
   * @returns {boolean} текущее модальное окно активно для закрытия свайпом или нет.
   */
  public get meIsActive(): boolean {
    return this.swipeService.actualPopUpModalForm === this.modalFormId;
  }

  /**
   * Обрабатывает закрытие модального окна нажатием на крестик.
   */
  public onClose() {
    this.close.emit();
  }

  /**
   * Обрабатывает событие нажатия на submit кнопку.
   */
  public onSubmitClick() {
    this.submitClick.emit();
  }

  /**
   * Обрабатывает событие нажатия на secondary кнопку.
   */
  public onSecondaryClick() {
    this.secondaryClick.emit();
  }
}
