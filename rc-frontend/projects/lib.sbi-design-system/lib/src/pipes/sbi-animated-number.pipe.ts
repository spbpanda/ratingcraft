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

  // Добавляем переменные для хранения предыдущих параметров
  private previousValue: number | null = null;
  private previousEndValue: number | null = null;
  private previousIsFloat = false;
  private previousDuration = 2000;
  private previousTickDelay = 10;

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

    // Проверяем, изменились ли входные параметры
    const paramsChanged = 
      value !== this.previousValue ||
      endValue !== this.previousEndValue ||
      isFloat !== this.previousIsFloat ||
      duration !== this.previousDuration ||
      tickDelay !== this.previousTickDelay;
      
    if (paramsChanged) {
      this.customClearInterval();

      // Сохраняем текущие параметры как предыдущие
      this.previousValue = value;
      this.previousEndValue = endValue;
      this.previousIsFloat = isFloat;
      this.previousDuration = duration;
      this.previousTickDelay = tickDelay;

      this.startValue = value;
      this.currentValue = value;
      this.endValue = endValue;
      this.isFloat = isFloat;
      this.duration = duration;
      this.tickDelay = tickDelay;

      const delta = (endValue - value) / (duration / tickDelay);
      this.startAnimation(delta);
    }

    return this.isFloat 
      ? this.currentValue.toFixed(2) 
      : Math.floor(this.currentValue).toString();
  }

  /**
   * Запускает анимацию изменения числового значения.
   * 
   * @param {number} delta - Величина изменения значения за один тик
   * @private
   */
  private startAnimation(delta: number) {
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / this.duration);
      
      this.currentValue = this.startValue + (this.endValue - this.startValue) * progress;
      this.changeDetector.markForCheck();

      if (progress < 1) {
        this.changeInterval = setTimeout(animate, this.tickDelay);
      } else {
        this.currentValue = this.endValue;
        this.changeInterval = undefined;
      }
    };

    animate();
  }

  /**
   * Очищает интервал анимации.
   * @private
   */
  private customClearInterval() {
    if (this.changeInterval) {
      clearTimeout(this.changeInterval);
      this.changeInterval = undefined;
    }
  }

  /**
   * Метод жизненного цикла, выполняется при уничтожении компонента.
   */
  ngOnDestroy(): void {
    this.customClearInterval();
  }
}
