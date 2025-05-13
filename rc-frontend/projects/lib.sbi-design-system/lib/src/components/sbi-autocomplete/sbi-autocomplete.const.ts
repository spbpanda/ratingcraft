import { ValidatorFn } from '@angular/forms';

/**
 * Вспомогательная функция для создания валидатора, который всегда возвращает заданное состояние ошибки.
 * Используется для управления визуальным состоянием ошибки компонента ввода с автозаполнением.
 *
 * @param {boolean} invalid - Признак ошибки, который будет возвращать валидатор.
 * @returns {ValidatorFn} Функция-валидатор, которая возвращает null (валидно) или объект с ошибкой.
 */
export function validator(invalid: boolean = false): ValidatorFn {
  return () => (invalid ? { invalid: true } : null);
}
