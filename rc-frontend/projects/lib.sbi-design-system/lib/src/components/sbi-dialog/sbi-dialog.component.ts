import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SbiResizableDirective } from '../../directives/sbi-resize.directive';
import { SbiSwipeComponent } from '../../classes/sbi-swipe-component';
import { NgClass, NgIf } from '@angular/common';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { BUTTON_CROSS, SUCCESS_DIALOG_ICON } from '../../const/icons';
import { SbiDividerComponent } from '../sbi-divider/sbi-divider.component';
import { SbiButtonComponent } from '../sbi-button/sbi-button.component';
import { SbiDialogSize, SbiDialogType } from "./sbi-dialog.models";
import { SbiButtonAppearance } from "../sbi-button/sbi-button.models";

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
   * @public
   * @description Текст заголовка модального окна.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public title?: string;

  /**
   * @public
   * @description Текст подзаголовка модального окна.
   * @type {string | undefined}
   * @default undefined
   */
  @Input() public note?: string;

  /**
   * @public
   * @description Флаг - показывать иконку в заголовке модального окна.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public showIcon: boolean = false;

  /**
   * @public
   * @description Флаг - показывать иконку закрытия модального окна.
   * @type {boolean}
   * @defaultValie true
   */
  @Input() public showCloseIcon: boolean = true;

  /**
   * @public
   * @description Минимальный размер модального окна.
   * @type {'large' | 'small'}
   * @defaultValue 'large'
   */
  @Input() public size: SbiDialogSize = 'large'

  /**
   * @public
   * @description Svg код иконка заголовка модального окна.
   * @type {string}
   * @defaultValue SUCCESS_DIALOG_ICON
   */
  @Input() public icon: string = SUCCESS_DIALOG_ICON;

  /**
   * @public
   * @description Тип модального окна.
   * @type {'illustration' | 'header'}
   * @defaultValue 'illustration'
   */
  @Input() public type: SbiDialogType = 'illustration';

  /**
   * @public
   * @description Дельта (в пикселях) насколько пользователю нужно свайпнуть модальное окно до его закрытия.
   * @type {number | undefined}
   * @defaultValue undefined
   */
  @Input() public openCloseDelta?: number;

  /**
   * @public
   * @description Максимальная высота модального окна в мобильной версии.
   * @type {number}
   * @defaultValue 700
   */
  @Input() public maxHeight: number = 700;

  /**
   * @public
   * @description Флаг, указывающий на возможность скролить контент модального окна.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public scrollableContent: boolean = true;

  /**
   * @public
   * @description Текст основной кнопки модального окна.
   * @type {string | undefined}
   * @defaultvalue undefined
   */
  @Input() public submitButtonTitle?: string;

  /**
   * @public
   * @description Текст вспомогательной кнопки модального окна.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public secondButtonTitle?: string;

  /**
   * @public
   * @description Тип основной кнопки.
   * @type {'primary' | 'warn' | 'primary-tint' | 'warn-tint' | 'overlay'}
   * @defaultValue 'primary'
   */
  @Input() public submitButtonAppearance: SbiButtonAppearance = 'primary';

  /**
   * @public
   * @description Тип вспомогательной кнопки.
   * @type {'primary' | 'warn' | 'primary-tint' | 'warn-tint' | 'overlay'}
   * @defaultValue 'primary-tint'
   */
  @Input() public secondaryButtonAppearance: SbiButtonAppearance = 'primary-tint';

  /**
   * @public
   * @description Идентификатор для авто тестов.
   * @type {string}
   * @defaultValue 'sbi-dialog-test-id'
   */
  @Input() public testId: string = 'sbi-dialog-test-id';

  /**
   * @public
   * @description Событие клика на крестик.
   * @type {EventEmitter<void>}
   */
  @Output() public close: EventEmitter<void> = new EventEmitter();

  /**
   * @public
   * @description Событие клика на основную кнопку.
   * @type {EventEmitter<void>}
   */
  @Output() public submitClick: EventEmitter<void> = new EventEmitter();

  /**
   * @public
   * @description Событие клика на вспомогательную кнопку.
   * @type {EventEmitter<void>}
   */
  @Output() public secondaryClick: EventEmitter<void> = new EventEmitter();

  /**
   * @public
   * @getter
   * @description возвращает актуальную высоту модального окна.
   * @return {string}
   * */
  public get scrollContainerHeight(): string {
    if (!this.scrollableContent) {
      return '100%';
    }
    const delta = this.type === 'header' ? 64 : 12;
    const height = SbiSwipeComponent.isMobile(window) ? this.maxHeight : window.innerHeight * 0.85;
    return `${height - delta}px`;
  }

  /**
   * @public
   * @getter
   * @description Возвращает SVG иконку для закрытия модального окна.
   * @returns {string} SVG строка иконки закрытия модального окна.
   */
  public get closeIcon(): string {
    return BUTTON_CROSS;
  }

  /**
   * @public
   * @getter
   * @description Возвращает актуальный размер модального окна.
   * @returns {'large' | 'small'} актуальный размер модального окна.
   */
  public get adaptiveSize(): 'large' | 'small' {
    return SbiSwipeComponent.isDesktop(window) ? this.size : 'small';
  }

  /**
   * @public
   * @getter
   * @description Возвращает флаг - текущее устройство мобильное или нет.
   * @returns {boolean} текущее устройство мобильное или нет.
   */
  public get isMobile(): boolean {
    return SbiSwipeComponent.isMobile(window);
  }

  /**
   * @public
   * @getter
   * @description Возвращает флаг - текущее модальное окно активно для закрытия свайпом или нет.
   * @returns {boolean} текущее модальное окно активно для закрытия свайпом или нет.
   */
  public get meIsActive(): boolean {
    return this.swipeService.actualPopUpModalForm === this.modalFormId;
  }

  /**
   * @public
   * @description Обрабатывает закрытие модального окна нажатием на крестик.
   */
  public onClose() {
    this.close.emit();
  }

  /**
   * @public
   * @description Обрабатывает событие нажатия на submit кнопку.
   */
  public onSubmitClick() {
    this.submitClick.emit();
  }

  /**
   * @public
   * @description Обрабатывает событие нажатия на secondary кнопку.
   */
  public onSecondaryClick() {
    this.secondaryClick.emit();
  }
}
