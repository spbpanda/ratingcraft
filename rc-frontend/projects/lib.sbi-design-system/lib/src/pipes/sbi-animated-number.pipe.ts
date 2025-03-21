import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';

const DEFAULT_START_VALUE = -999999999999;
const DEFAULT_END_VALUE = 99999999999999;

/**
 * Пайп для анимированного отображения изменения числовых значений.
 * 
 * Позволяет плавно анимировать изменение числа от начального значения к конечному 
 * с настраиваемыми параметрами длительности и интервала обновления.
 *
 * @Pipe
 * @name: 'sbiAnimatedNumber'
 * @pure: false
 * @standalone: true
 */
@Pipe({
  name: 'sbiAnimatedNumber',
  pure: false,
  standalone: true,
})
export class SbiAnimatedNumberPipe implements PipeTransform, OnDestroy {
  /**
   * Идентификатор интервала для анимации.
   * @private
   */
  // @ts-ignore
  private changeInterval?: NodeJS.Timeout;
  
  /**
   * Текущее отображаемое значение в процессе анимации.
   * @private
   */
  private currentValue = 0;
  
  /**
   * Начальное значение для анимации.
   * @private
   */
  private startValue = DEFAULT_START_VALUE;
  
  /**
   * Конечное значение для анимации.
   * @private
   */
  private endValue = DEFAULT_END_VALUE;
  
  /**
   * Флаг, указывающий нужно ли отображать значение как число с плавающей точкой.
   * @private
   */
  private isFloat = false;
  
  /**
   * Длительность анимации в миллисекундах.
   * @private
   */
  private duration = 2000;
  
  /**
   * Интервал между обновлениями значения в миллисекундах.
   * @private
   */
  private tickDelay = 10;

  /**
   * ChangeDetectorRef для обновления представления при изменении значения.
   * @private
   */
  private changeDetector = inject(ChangeDetectorRef)

  /**
   * Трансформирует входное значение в анимированное числовое значение.
   * 
   * @param {number | null} value - Начальное значение
   * @param {number | null} endValue - Конечное значение
   * @param {boolean} isFloat - Флаг для отображения числа с плавающей точкой
   * @param {number} duration - Длительность анимации в миллисекундах
   * @param {number} tickDelay - Интервал между обновлениями в миллисекундах
   * @returns {string} - Строковое представление текущего значения
   */
  transform(
    value: number | null,
    endValue: number | null,
    isFloat: boolean = false,
    duration: number = 2000,
    tickDelay: number = 10,
  ): string {
    if (value == null || endValue == null) {
      return value?.toString() ?? endValue?.toString() ?? '';
    }

    if (
      value !== this.startValue ||
      endValue !== this.endValue ||
      this.isFloat !== isFloat ||
      this.duration !== this.duration ||
      this.tickDelay !== tickDelay
    ) {
      this.customClearInterval();

      this.startValue = value;
      this.currentValue = value;
      this.endValue = endValue;
      this.isFloat = isFloat;
      this.duration = duration;
      this.tickDelay = tickDelay;

      const delta = (endValue - value) / duration * tickDelay;
      this.startAnimation(delta);
    }

    if (this.isFloat) {
      return this.currentValue.toFixed(2);
    }
    return Math.floor(this.currentValue).toString();
  }

  /**
   * Запускает анимацию изменения числового значения.
   * 
   * @param {number} delta - Величина изменения значения за один тик
   * @private
   */
  private startAnimation(delta: number) {
    this.changeInterval = setInterval(() => {
      this.currentValue += delta;
      if (Math.abs(delta) > Math.abs(this.currentValue - this.endValue)) {
        this.currentValue = this.endValue;
        this.customClearInterval();
      }

      this.changeDetector.markForCheck();
    }, this.tickDelay);
  }

  /**
   * Очищает интервал анимации.
   * @private
   */
  private customClearInterval() {
    clearInterval(this.changeInterval);
    this.changeInterval = undefined;
  }

  /**
   * Метод жизненного цикла, выполняется при уничтожении компонента.
   */
  ngOnDestroy(): void {
    this.customClearInterval();
  }
}
