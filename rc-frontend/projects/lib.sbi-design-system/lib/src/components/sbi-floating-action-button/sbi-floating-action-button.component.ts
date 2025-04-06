import { Component, Input } from '@angular/core';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';

/**
 * Размер кнопки плавающего действия
 * - L - большой размер (56px)
 * - S - малый размер (44px)
 */
export type SbiFloatingActionButtonSize = 'L' | 'S';

/**
 * Внешний вид кнопки плавающего действия
 * - accent - акцентный стиль (цветной фон)
 * - overlay - полупрозрачный стиль
 * - neutral - нейтральный стиль (белый фон)
 */
export type SbiFloatingActionButtonAppearance = 'accent' | 'overlay' | 'neutral';

/**
 * Тип кнопки плавающего действия
 * - button - обычная кнопка
 * - submit - кнопка отправки
 * - reset - кнопка сброса
 */
export type SbiFloatingActionButtonType = 'button' | 'submit' | 'reset';

/**
 * Компонент плавающей кнопки действия (FAB)
 * 
 * Плавающая кнопка действия (FAB) — это круглая кнопка с иконкой, которая выполняет основное 
 * действие на странице.
 * 
 * @example
 * <sbi-floating-action-button
 *   [icon]="plusIcon"
 *   [appearance]="'accent'"
 *   [size]="'L'"
 * ></sbi-floating-action-button>
 */
@Component({
  selector: 'sbi-floating-action-button',
  standalone: true,
  imports: [
    SbiIconComponent
  ],
  templateUrl: './sbi-floating-action-button.component.html',
  styleUrl: './sbi-floating-action-button.component.scss'
})
export class SbiFloatingActionButtonComponent {
  /**
   * SVG иконка
   */
  @Input({ required: true }) icon: string = '';

  /**
   * Внешний вид кнопки
   */
  @Input() appearance: SbiFloatingActionButtonAppearance = 'accent';

  /**
   * Размер кнопки
   */
  @Input() size: SbiFloatingActionButtonSize = 'L';

  /**
   * Активное/неактивное состояние
   */
  @Input() disabled: boolean = false;

  /**
   * Тип кнопки
   */
  @Input() type: SbiFloatingActionButtonType = 'button';

  /**
   * ID для автотестов
   */
  @Input() testId: string = 'sbi-floating-action-button';
} 