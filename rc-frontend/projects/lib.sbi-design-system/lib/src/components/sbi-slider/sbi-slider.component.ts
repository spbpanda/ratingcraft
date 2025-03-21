import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { NgClass, NgIf } from '@angular/common';
import { SbiInputComponent } from '../sbi-input/sbi-input.component';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiComponentWithInput } from '../../classes/sbi-component-with-input.component';
import { DEFAULT_MAX_VALUE, DEFAULT_MIN_VALUE, DEFAULT_STEP_SLIDER_VALUE } from '../../const/default-values';

/**
 * Компонент для отображения слайдера с полем ввода значения.
 *
 * Наследуется от базового компонента SbiComponentWithInput.
 *
 * @Component
 * @selector: 'sbi-slider'
 * @standalone: true
 * @imports: [SbiInputComponent, MatSlider, MatSliderThumb, SbiErrorComponent, NgIf, ReactiveFormsModule, NgClass]
 * @templateUrl: './sbi-slider.component.html'
 * @styleUrls: ['./sbi-slider.component.scss']
 */
@Component({
  selector: 'sbi-slider',
  templateUrl: './sbi-slider.component.html',
  styleUrls: ['./sbi-slider.component.scss'],
  imports: [
    SbiInputComponent,
    MatSlider,
    MatSliderThumb,
    SbiErrorComponent,
    NgIf,
    ReactiveFormsModule,
    NgClass,
  ],
  standalone: true
})
export class SbiSliderComponent extends SbiComponentWithInput<number> {

  /**
   * Максимальное значение.
   * @type {number}
   */
  @Input() max = DEFAULT_MAX_VALUE;

  /**
   * Заголовок slider-а.
   * @type {string | undefined}
   */
  @Input() mainLabel?: string;

  /**
   * Минимальное значение.
   * @type {number}
   */
  @Input() min = DEFAULT_MIN_VALUE;

  /**
   * Шаг изменения значения.
   * @type {number}
   */
  @Input() step = DEFAULT_STEP_SLIDER_VALUE;

  /**
   * Суффикс для отображения после значения.
   * @type {string}
   */
  @Input() suffix = '';

  /**
   * Префикс для отображения перед значением.
   * @type {string}
   */
  @Input() prefix = '';

  /**
   * Текст под слайдером слева.
   * @type {string}
   */
  @Input() underTitleLeft = '';

  /**
   * Текст под слайдером справа.
   * @type {string}
   */
  @Input() underTitleRight = '';

  /**
   * Событие, которое срабатывает при фокусировке.
   * @type {EventEmitter<boolean>}
   */
  @Output() sliderFocus = new EventEmitter<boolean>();

  /**
   * Функция отображения значения.
   * Также обновляет значение, если оно изменилось извне и не в фокусе.
   * @param {number} value - Текущее числовое значение.
   * @returns {string} Строковое представление значения.
   */
  displayFn = (value: number) => {
    if (this.sliderValue !== value && !this.focused()) {
      this.sliderValue = value;
    }
    return value.toString();
  };

  /**
   * Получает текущее значение из контрола.
   * @returns {number | null} Текущее значение.
   */
  public get sliderValue() {
    return this.control.value;
  }

  /**
   * Устанавливает значение в контрол.
   * @param {number | null} value - Новое значение.
   */
  public set sliderValue(value: number | null) {
    this.control.setValue(value);
  }

  /**
   * Обрабатывает изменение фокуса на поле ввода.
   * Ограничивает введенное значение диапазоном min-max.
   * @param {boolean} focus - Состояние фокуса.
   */
  public onInputFocusChange(focus: boolean) {
    super.onFocusChange(focus);

    if (this.control.value != null && this.control.value < this.min) {
      this.control.setValue(this.min)
    }
    if (this.control.value != null && this.control.value > this.max) {
      this.control.setValue(this.max)
    }
  }

  /**
   * Обрабатывает изменение фокуса.
   * Эмитит событие sliderFocus с новым состоянием фокуса.
   * @param {boolean} focus - Состояние фокуса.
   */
  public onSliderFocusChange(focus: boolean) {
    this.sliderFocus.emit(focus);
  }
}
