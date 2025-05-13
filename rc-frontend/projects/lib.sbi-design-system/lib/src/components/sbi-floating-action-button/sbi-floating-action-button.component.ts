import { Component, Input } from '@angular/core';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiFloatingActionButtonAppearance, SbiFloatingActionButtonSize, } from './sbi-floating-action-button.model';
import { SbiButtonType } from "../sbi-button/sbi-button.models";

/**
 * Компонент плавающей кнопки действия (FAB)
 *
 * Плавающая кнопка действия (FAB) — это круглая кнопка с иконкой, которая выполняет основное
 * действие на странице.
 *
 * @Component
 * @selector: 'sbi-floating-action-button'
 * @standalone: true
 * @imports: [SbiIconComponent]
 * @templateUrl: './sbi-floating-action-button.component.html'
 * @styleUrl: './sbi-floating-action-button.component.scss'
 */
@Component({
  selector: 'sbi-floating-action-button',
  standalone: true,
  imports: [SbiIconComponent],
  templateUrl: './sbi-floating-action-button.component.html',
  styleUrl: './sbi-floating-action-button.component.scss'
})
export class SbiFloatingActionButtonComponent {
  /**
   * @public
   * @requred
   * @description SVG иконка.
   * @type {string}
   * @defaultValue ''
   */
  @Input({ required: true }) public icon: string = '';

  /**
   * @public
   * @description Внешний вид кнопки.
   * @type {'accent' | 'overlay' | 'neutral'}
   * @defaultValue 'accent'
   */
  @Input() public appearance: SbiFloatingActionButtonAppearance = 'accent';

  /**
   * @public
   * @description Размер кнопки.
   * @type {'L' | 'S'}
   * @defaultValue 'L'
   */
  @Input() public size: SbiFloatingActionButtonSize = 'L';

  /**
   * @public
   * @description Активное/неактивное состояние.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public disabled: boolean = false;

  /**
   * @public
   * @description Тип кнопки.
   * @type {SbiButtonType}
   * @defaultValue 'button'
   */
  @Input() public type: SbiButtonType = 'button';

  /**
   * @public
   * @description ID для авто тестов.
   * @type {string}
   * @defaultValue 'sbi-floating-action-button'
   */
  @Input() testId: string = 'sbi-floating-action-button';
}
