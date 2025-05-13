import { AbstractControl, ValidatorFn } from "@angular/forms";

export class SbiOgrnValidator {
  /**
   * Создает валидатор для проверки ОГРН или ОГРНИП
   * @param {'ogrn' | 'ogrnip'} type
   * @returns {ValidatorFn} Функция-валидатор, которая возвращает:
   *          - { incorrectLength: true } - если длина некорректна
   *          - { incorrectNumber: true } - неверный ОГРН или ОГРНИП
   *          - null если валиден
   */
  public static createOgrnValidator(type: 'ogrn' | 'ogrnip'): ValidatorFn {
    return (control: AbstractControl) => {
      const value = (control.value || "").replace(/[^\w]/g, "");

      if (!value) {
        return null;
      }

      // Проверка длины
      const length = type === 'ogrn' ? 13 : 15;
      if (value.length !== length) {
        return { incorrectLength: true };
      }

      // Проверка 1 цифры
      const firstChar = value.charAt(0);
      if (type === 'ogrn' && !['1', '5'].includes(firstChar)) {
        return { incorrectNumber: true };
      }
      if (type === 'ogrnip' && firstChar !== '3') {
        return { incorrectNumber: true };
      }

      // 4-5 цифры: код региона (не '00')
      if (value.substring(3, 5) === "00") {
        return { incorrectNumber: true };
      }

      // Проверка контрольного числа
      if (!this.validateChecksum(value, type)) {
        return { incorrectNumber: true };
      }

      return null;
    };
  }

  /**
   * Проверка контрольного числа
   * @param {string} value Строка с ОГРН или ОГРНИП
   * @param {'ogrn' | 'ogrnip'} type
   * @returns {boolean} true если контрольное число верно, false если неверно
   */
  private static validateChecksum(value: string, type: 'ogrn' | 'ogrnip'): boolean {
    const divider = type === 'ogrn' ? 11 : 13;
    const remainder = parseInt((parseInt(value.slice(0, -1)) % divider).toString().slice(-1));
    return remainder === parseInt(value[type === 'ogrn' ? 12 : 14]);
  }
}
