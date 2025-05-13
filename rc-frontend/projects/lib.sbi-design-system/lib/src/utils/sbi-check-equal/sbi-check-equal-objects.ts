import { DateTime } from 'luxon';
import { SbiEqualTypes } from './sbi-check-equal-objects.models';

/**
 * @description Функция преобразования объекта в мапу ключей (пути до объекта в структуре json) и значений (значений лежащий по этому ключу).
 * @param {T extends object} obj - Преобразуемый объект.
 * @return {Record<string, string>} - Мапа, полученная в результате преобразования объекта.
 * */
function objectToRecord<T extends object>(obj: T): Record<string, string> {
  const flattened: Record<string, string> = {};

  function flatten(obj: T, prefix: string = '') {
    for (const [key, value] of Object.entries(obj)) {
      const propName = prefix ? `${prefix}.${key}` : key;
      if (value instanceof DateTime) {
        flattened[propName] = value.toString();
      } else if (typeof value === 'object' && value !== null) {
        flatten(value, propName);
      } else if (['boolean', 'string', 'number'].includes(typeof value)) {
        flattened[propName] = (value as string | number | boolean).toString();
      } else {
        flattened[propName] = value == null ? 'null' : 'undefined';
      }
    }
  }

  flatten(obj);

  return flattened;
}

/**
 * @description Функция проверки двух объектов на равенство.
 * @param {SbiEqualTypes} arg1 - Первый объект.
 * @param {arg1 | string | null} arg2 - Второй объект.
 * @param {arg1 | string | null} skipTypes - Игнорирование жесткого сравнения типов.
 * @return {boolean} - Являются ли оба объекта одинаковыми.
 * */
export function SbiIsEqual(arg1: SbiEqualTypes, arg2: SbiEqualTypes, skipTypes: boolean = false): boolean {
  if (typeof arg1 !== typeof arg2) {
    return false;
  }
  if (typeof arg1 !== 'object' || typeof arg2 !== 'object' || arg1 == null || arg2 == null) {
    return skipTypes ? arg1 == arg2 : arg1 === arg2;
  }

  const flattenObj1 = objectToRecord(arg1);
  const flattenObj2 = objectToRecord(arg2);
  if (Object.keys(flattenObj1).length !== Object.keys(flattenObj2).length) {
    return false;
  }
  for (const [key, value] of Object.entries(flattenObj1)) {
    if (flattenObj2[key] !== value) {
      return false;
    }
  }
  return true;
}

/**
 * @async
 * @description Асинхронная функция проверки двух объектов на равенство.
 * @param {SbiEqualTypes} arg1 - Первый объект.
 * @param {arg1 | string | null} arg2 - Второй объект.
 * @param {arg1 | string | null} skipTypes - Игнорирование жесткого сравнения типов.
 * @return {Promise<boolean>} - Являются ли оба объекта одинаковыми.
 * */
export async function SbiIsEqualAsync(arg1: SbiEqualTypes, arg2: SbiEqualTypes, skipTypes: boolean = false): Promise<boolean> {
  return SbiIsEqual(arg1, arg2, skipTypes);
}
