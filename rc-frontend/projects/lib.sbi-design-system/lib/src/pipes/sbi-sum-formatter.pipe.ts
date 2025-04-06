import { Pipe, PipeTransform } from '@angular/core';

/**
 * Пайп для форматирования числовых значений в денежный формат.
 *
 * Форматирует числовое значение, добавляя пробелы между группами по три цифры
 * и добавляет символ валюты в конце. По умолчанию используется символ рубля (₽).
 *
 * @Pipe
 * @name: 'sbiSumFormatter'
 * @standalone: true
 */
@Pipe({
  name: 'sbiSumFormatter',
  standalone: true,
})
export class SbiSumFormatterPipe implements PipeTransform {
  /**
   * Форматирует числовое значение как денежную сумму.
   *
   * @param {number | string | null} value - Значение для форматирования
   * @param {string} curr - Символ валюты, по умолчанию '₽'
   * @param {string} separator - Символ разделитель. Разделение целой и десятичной частей.
   * @returns {string} - Отформатированная строка с символом валюты
   */
  transform(value: number | string | null, curr: string = '₽', separator: string = ','): string {
    if (value == null) {
      return '';
    }
    const normalizeValue = value.toString().replaceAll(' ', '');
    if (isNaN(Number(normalizeValue))) {
      return normalizeValue.toString();
    }
    const strValue = Number(normalizeValue).toString().split('.');

    const formatedSum = (strValue[0] ?? '')
      .toString()
      .split('')
      .reverse()
      .map((char, idx) => (idx && !(idx % 3) ? `${char} ` : char))
      .reverse()
      .join('');
    return `${formatedSum}${strValue.length > 1 ? `${separator}${strValue[1]}` : ''} ${curr}`;
  }
}
