import { AbstractControl, ValidatorFn } from '@angular/forms';

export class SbiKppValidator {
  /**
   * Создает валидатор для проверки КПП
   * @returns {ValidatorFn} Функция-валидатор, которая возвращает:
   *          - { kppLength: true } если длина КПП не равна 9
   *          - { incorrectKpp: true } - если причина постановки на учет некорректна                      
   *          - null если КПП валиден
   */
  public static createKppValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = (control.value || '').replace(/[^\w]/g, '');

      if (!value) {
        return null;
      }

      // Проверка длины
      if (value.length !== 9) {
        return { kppLength: true };
      }

      // 5-6 знаки: причина постановки на учет (цифры от 01 до 50 или заглавные буквы латинского алфавита от A до Z)
      const reasonCode = value.substring(4, 6);
      if (!/^(0[1-9]|[1-4][0-9]|50|[A-Z]{2})$/.test(reasonCode)) {
        return { incorrectKpp: true };
      }

      return null;
    };
  }
}