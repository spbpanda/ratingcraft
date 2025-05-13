import { AbstractControl, ValidatorFn } from '@angular/forms';

export class SbiEmailValidator {
  /**
   * Создает валидатор для email с учетом возможности ввода кириллицы
   * @param {boolean} hasRussianCharacters - Разрешить кириллические символы
   * @returns {ValidatorFn} Функция-валидатор
   */
  static createEmailValidator(hasRussianCharacters: boolean): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value || '';

      if (!value) {
        return null;
      }

      const chars = hasRussianCharacters ? 'а-яА-ЯёЁa-zA-Z0-9' : 'a-zA-Z0-9';
      const special = '._\\-–';

      const localPart = `[${chars}${special}]*[${chars}]`;
      const domainPart = `[${chars}][${chars}.\\-–]*[${chars}]`;
      const tld = `[${chars}]{2,}`;

      const pattern = new RegExp(
        `^(?!.*\\.\\.)(?!.*[.]{2})${localPart}@${domainPart}\\.${tld}$`
      );
      
      return pattern.test(value) ? null : { email: true };
    };
  }
}