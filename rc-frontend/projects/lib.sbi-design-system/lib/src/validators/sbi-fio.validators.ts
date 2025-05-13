import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SbiFioBase } from '../models/sbi-da-data-models';

export class SbiFioValidator {

  /**
   * @public
   * @description Создаёт функцию валидации ФИО.
   * @param {Array<string>} fioSpecialCharacters - Специальные символы допустимые в ФИО.
   * @return {ValidatorFn} - Функция валидации ФИО.
   * */
  public static fioValidator<T extends SbiFioBase>(fioSpecialCharacters: Array<string> = ['-']): ValidatorFn {
    return (control: AbstractControl) => {
      const value: T | string | null = control.value;
      if (value) {
        return typeof value === 'string' ? this.validateStringFio(value, fioSpecialCharacters) : this.validateObjectFio(value);
      }
      return null;
    };
  }

  /**
   * @private
   * @description Проверка объекта ФИО на валидность.
   * @param {T extends SbiFioBase} value - Объект ФИО.
   * @return {ValidationErrors | null} - Результат проверки валидности ФИО.
   * */
  private static validateObjectFio<T extends SbiFioBase>(value: T): ValidationErrors | null {
    if (!value.name || !value.surname) {
      return { patternErrorMessage: true };
    }
    return null;
  }

  /**
   * @private
   * @description Проверка строки ФИО на валидность.
   * @param {string} value - Строка ФИО.
   * @param {T extends SbiFioBase} fioSpecialCharacters - Специальные символы допустимые в ФИО.
   * @return {ValidationErrors | null} - Результат проверки валидности ФИО.
   * */
  private static validateStringFio(value: string, fioSpecialCharacters: string[]): ValidationErrors | null {
    const fio = this.deleteSpaces(value).split(' ');
    // Строка содержит одно слово => нет фамилии и имени
    if (fio.length <= 1 || fio[0].length < 2 || fio[1].length < 2) {
      return { customFioError: true };
    }
    if (!!fio.find(elem => elem[0].toUpperCase() !== elem[0])) {
      return { patternErrorMessage: true };
    }
    if (fioSpecialCharacters.some(character => value.startsWith(character) || value.endsWith(character))) {
      return { patternErrorMessage: true };
    }
    if (fioSpecialCharacters.some(character => this.checkAddSpacesForCharacter(value, character))) {
      return { patternErrorMessage: true };
    }

    return null;
  }

  /**
   * @private
   * @description Проверка, что в строке ФИО не содержится двух подряд идущий спец символов, фио не начинается и
   * не заканчивается спец символов, спец символ не разделён от слов пробелами.
   * @param {string} value - Строка ФИО.
   * @param {string} character - Специальный символ.
   * @return {boolean} - Результат проверки.
   * */
  private static checkAddSpacesForCharacter(value: string, character: string): boolean {
    return (
      value.includes(`${character}${character}`) ||
      value.includes(` ${character} `) ||
      value.includes(`${character} `) ||
      value.includes(` ${character}`)
    );
  }

  /**
   * @private
   * @description Удаляет пробелы из начала и конца строки, так же удаляет все множественные пробелы в строке.
   * @param {string} str - Строка.
   * @return {ValidationErrors | null} - Результат удаления пробелов.
   * */
  private static deleteSpaces(str: string): string {
    return str.trim().split(' ').filter(elem => !!elem).join(' ');
  }
}
