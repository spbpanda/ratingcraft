import { SbiFioBase } from '../models/sbi-da-data-models';

/**
 * @description Функция преобразования ФИО в строку.
 * @param {SbiFioBase | string | null} elem - ФИО.
 * @return string - Строковое значение ФИО.
 * */
export function sbiFioToString(elem: SbiFioBase | string | null): string {
  if (!elem) return '';
  if (typeof elem === 'string') return elem;
  return [elem.surname, elem.name, elem.patronymic].filter(elem => !!elem).join(' ');
}

/**
 * @description Функция преобразования ФИО в объект.
 * @param {SbiFioBase | string | null} elem - ФИО.
 * @return {SbiFioBase | null} - Значение ФИО в виде объекта SbiFioBase.
 * */
export function sbiFioToObject(elem: SbiFioBase | string | null): SbiFioBase | null {
  if (!elem) return null;
  if (typeof elem === 'object') return elem;
  const fioArray: Array<string> = elem.split(' ');
  return {
    name: fioArray?.[1] || '',
    surname: fioArray?.[0] || '',
    patronymic: fioArray?.[2] || '',
  }
}
