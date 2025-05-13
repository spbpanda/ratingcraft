import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
   * @public
   * @description Форм контролл.
   * @type {FormControl<number | null>}
   */
  @Input() public declare control: FormControl<number | null>;

  /**
   * @public
   * @description Максимальное значение.
   * @type {number}
   * @defaultValue DEFAULT_MAX_VALUE
   */
  @Input() public max: number = DEFAULT_MAX_VALUE;

  /**
   * @public
   * @description Заголовок slider-а.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public mainLabel?: string;

  /**
   * @public
   * @description Минимальное значение.
   * @type {number}
   * @defaultValue DEFAULT_MIN_VALUE
   */
  @Input() public min: number = DEFAULT_MIN_VALUE;

  /**
   * @public
   * @description Шаг изменения значения.
   * @type {number}
   * @defaultValue DEFAULT_STEP_SLIDER_VALUE
   */
  @Input() public step: number = DEFAULT_STEP_SLIDER_VALUE;

  /**
   * @public
   * @description Суффикс для отображения после значения.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public suffix: string = '';

  /**
   * @public
   * @description Префикс для отображения перед значением.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public prefix: string = '';

  /**
   * @public
   * @description Текст под слайдером слева.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public underTitleLeft: string = '';

  /**
   * @public
   * @description Текст под слайдером справа.
   * @type {string}
   * @defaultValue ''
   */
  @Input() underTitleRight: string = '';

  /**
   * @public
   * @description Событие, которое срабатывает при фокусировке.
   * @type {EventEmitter<boolean>}
   * @defaultValue ''
   */
  @Output() sliderFocus: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @public
   * @description Функция отображения значения.
   * Также обновляет значение, если оно изменилось извне и не в фокусе.
   * @param {number} value - Текущее числовое значение.
   * @returns {string} Строковое представление значения.
   */
  public displayFn(value: number): string {
    if (this.sliderValue !== value && !this.focused()) {
      this.sliderValue = value;
    }
    return value.toString();
  };

  /**
   * @public
   * @getter
   * @description Получает текущее значение из контрола.
   * @returns {number | null} Текущее значение.
   */
  public get sliderValue(): number | null {
    return this.control.value;
  }

  /**
   * @public
   * @setter
   * @description Устанавливает значение в контрол.
   * @param {number | null} value - Новое значение.
   */
  public set sliderValue(value: number | null) {
    this.control.setValue(value);
  }

  /**
   * @public
   * @description Обрабатывает изменение фокуса на поле ввода.
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
   * @public
   * @description Обрабатывает изменение фокуса.
   * Эмитит событие sliderFocus с новым состоянием фокуса.
   * @param {boolean} focus - Состояние фокуса.
   */
  public onSliderFocusChange(focus: boolean) {
    this.sliderFocus.emit(focus);
  }
}
