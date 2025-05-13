import { Pipe, PipeTransform } from '@angular/core';
import { SbiCountedCaptions } from './counted-caption.models';

/**
 * Пайп для форматирования числового значения с подходящим склонением существительного.
 *
 * Выбирает правильное склонение существительного в зависимости от числового значения
 * согласно правилам русского языка.
 *
 * @Pipe
 * @name: 'sbiCountedCaption'
 * @standalone: true
 */
@Pipe({
  name: 'sbiCountedCaption',
  standalone: true,
})
export class SbiCountedCaptionPipe implements PipeTransform {
  /**
   * Трансформирует число в строку с правильным склонением существительного.
   *
   * @param {number | null} value - Числовое значение
   * @param {SbiCountedCaptions} captions - Объект с тремя вариантами склонения
   * @returns {string} - Строка с числом и правильным склонением
   */
  transform(value: number | null, captions: SbiCountedCaptions): string {
    const count = value ?? 0;
    const remainder100 = count % 100;
    const remainder10 = count % 10;

    if ((remainder100 < 10 || remainder100 > 20) && remainder10 < 5 && count > 0 && remainder10 > 0) {
      if (remainder10 === 1) {
        return `${count} ${captions.oneCaption}`;
      }
      return `${count} ${captions.twoCaption}`;
    }
    return `${count} ${captions.multipleCaption}`;
  }
}
