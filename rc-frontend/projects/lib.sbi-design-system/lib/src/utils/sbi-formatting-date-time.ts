import { DateTime } from 'luxon';

/**
 * @description Функция преобразования даты\времени в строку.
 * @param {DateTime | string | null} dateTime - Дата\время.
 * @param {string} format - Формат к которому приводится дата\время.
 * @return {string} - Значение даты\времени в виде строки.
 * */
export function sbiFormatDateTime(dateTime: DateTime | string | null, format: string = 'dd.MM.yyyy'): string {
  if (!dateTime) {
    return '';
  }
  const objectDateTime = typeof dateTime === 'string' ? DateTime.fromISO(dateTime) : dateTime;
  return objectDateTime.toFormat(format);
}

/**
 * @description Функция преобразования даты\времени в объект.
 * @param {DateTime | string | null} dateTime - Дата\время.
 * @return {DateTime | null} - Значение даты\времени в виде объекта.
 * */
export function sbiToDateTimeObject(dateTime: DateTime | string | null): DateTime | null {
  if (typeof dateTime === 'string') {
    return DateTime.fromISO(dateTime);
  }
  return dateTime;
}
