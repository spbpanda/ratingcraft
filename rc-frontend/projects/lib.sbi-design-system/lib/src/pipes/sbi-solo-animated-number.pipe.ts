import { ChangeDetectorRef, inject, OnDestroy, Pipe, PipeTransform } from '@angular/core';

/**
 * Пайп для анимированного отображения изменения числовых значений. Принимает 1 параметр - дату окончания анимации, за начало отсчёта при
 * первой анимации берёт 0, а дальше последнее переданное значение
 *
 * Позволяет плавно анимировать изменение числа от начального значения к конечному
 * с настраиваемыми параметрами длительности и интервала обновления.
 *
 * @Pipe
 * @name: 'sbiSoloAnimatedNumber'
 * @pure: false
 * @standalone: true
 */
@Pipe({
  name: 'sbiSoloAnimatedNumber',
  pure: false,
  standalone: true,
})
export class SbiSoloAnimatedNumberPipe implements PipeTransform, OnDestroy {
  /**
   * Верхняя граница анимации.
   * @private
   */
  private end = 0;

  /**
   * Нижняя граница анимации.
   * @private
   */
  private start = 0;

  /**
   * Текущее отображаемое значение.
   * @private
   */
  private currentValue = 0;

  /**
   * Идентификатор интервала для анимации.
   * @private
   */
    // @ts-ignore
  private changeInterval?: NodeJS.Timeout;

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
  private previousIsFloat = false;
  private previousDuration = 2000;
  private previousTickDelay = 10;

  /**
   * Трансформирует входное значение в анимированное числовое значение.
   *
   * @param {number | null} value - Начальное значение
   * @param {boolean} isFloat - Флаг для отображения числа с плавающей точкой
   * @param {number} duration - Длительность анимации в миллисекундах
   * @param {number} tickDelay - Интервал между обновлениями в миллисекундах
   * @returns {string} - Строковое представление текущего значения
   */
  transform(value: number | null, isFloat: boolean = false, duration: number = 2000, tickDelay: number = 10): string {
    if (value == null) {
      return '';
    }

    if (isNaN(Number(value))) {
      return value.toString();
    }

    // Проверяем, изменились ли входные параметры
    const paramsChanged =
      value !== this.previousValue ||
      isFloat !== this.previousIsFloat ||
      duration !== this.previousDuration ||
      tickDelay !== this.previousTickDelay;

    if (paramsChanged) {
      this.customClearInterval();

      if (value !== this.end) {
        this.start = this.end;
        this.end = Number(value);
      }

      // Сохраняем текущие параметры как предыдущие
      this.previousValue = value;
      this.previousIsFloat = isFloat;
      this.previousDuration = duration;
      this.previousTickDelay = tickDelay;

      this.isFloat = isFloat;
      this.duration = duration;
      this.tickDelay = tickDelay;

      this.startAnimation();
    }

    return this.isFloat
      ? this.currentValue.toFixed(2)
      : Math.floor(this.currentValue).toString();
  }

  /**
   * Запускает анимацию изменения числового значения.
   */
  private startAnimation() {
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / this.duration);

      this.currentValue = this.start + (this.end - this.start) * progress;
      this.changeDetector.markForCheck();

      if (progress < 1) {
        this.changeInterval = setTimeout(animate, this.tickDelay);
      } else {
        this.currentValue = this.end;
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
