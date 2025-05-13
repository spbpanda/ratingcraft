import { AbstractControl, ValidatorFn } from '@angular/forms';
import { INN_10_WEIGHTS, INN_12_WEIGHTS_FIRST_CHECK, INN_12_WEIGHTS_SECOND_CHECK } from './sbi-inn-validator.const';

export class SbiInnValidator {

  /**
   * Создает валидатор для проверки ИНН в зависимости от типа
   * @param {'legal' | 'individual'} type
   * @returns {ValidatorFn} Функция-валидатор, которая возвращает:
   *          - { innLengthLegal: true } если длина ИНН организации не равна 10
   *          - { innLengthIndividual: true } если длина ИНН физлица не равна 12
   *          - { innChecksum: true } если контрольная сумма не совпадает
   *          - null если ИНН валиден
   */
  public static createInnValidator(type: 'legal' | 'individual'): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value || '';

      if (!value) {
        return null;
      }

      if (type === 'legal' && value.length !== 10) {
        return { innLengthLegal: true };
      }

      if (type === 'individual' && value.length !== 12) {
        return { innLengthIndividual: true };
      }

      if (!this.validateDigitInn(value)) {
        return { innChecksum: true };
      }

      return null;
    };
  }

  /**
   * Проверка контрольных сумм для 12-значного ИНН физлиц/ИП и для 10-значного ИНН организаций
   * @param {string} inn Строка с ИНН
   * @returns {boolean} true если контрольная сумма верна, false если неверна
   */
  private static validateDigitInn(inn: string): boolean {
    switch (inn.length) {
      case 10:
        return this.validateInn(inn, INN_10_WEIGHTS, 9);
      case 12:
        return this.validateInn(inn, INN_12_WEIGHTS_FIRST_CHECK, 10) || this.validateInn(inn, INN_12_WEIGHTS_SECOND_CHECK, 11);
      default:
        return false;
    }
  }

  /**
   * Проверка контрольных сумм для ИНН.
   * @param {string} inn Строка с ИНН
   * @param {Array<number>} weights веса каждого числа в ИНН.
   * @param {number} innCheckedIndex индекс контрольного числа в ИНН.
   * @returns {boolean} true если контрольная сумма верна, false если неверна
   */
  private static validateInn(inn: string, weights: Array<number>, innCheckedIndex: number): boolean {
    let sum = 0;

    for (let i = 0; i < innCheckedIndex; i++) {
      sum += parseInt(inn[i]) * weights[i];
    }

    const checksum = (sum % 11) % 10;

    return checksum === parseInt(inn[innCheckedIndex]);
  }
}
