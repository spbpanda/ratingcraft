import { AbstractControl, ValidatorFn } from "@angular/forms";

export class SbiBikValidator {
  /**
   * Создает валидатор для проверки БИК
   * @returns {ValidatorFn} Функция-валидатор, которая возвращает:
   *          - { bikLength: true } если длина БИК не равна 9
   *          - { incorrectBik: true } - если код страны не "04" (1-2 цифры)
   *                                   - если код региона "00" (3-4 цифры)
   *                                   - если код кредитной организации не в диапазоне 050-999 (7-9 цифры)
   *          - null если БИК валиден
   */
  public static createBikValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = (control.value || "").replace(/[^\w]/g, "");

      if (!value) {
        return null;
      }

      // Проверка длины
      if (value.length !== 9) {
        return { bikLength: true };
      }

      // 1-2 цифры: код страны (04 - Россия)
      if (value.substring(0, 2) !== "04") {
        return { incorrectBik: true };
      }

      // 3-4 цифры: код региона (должен быть не "00")
      if (value.substring(2, 4) === "00") {
        return { incorrectBik: true };
      }

      // 7-9 цифры: код кредитной организации (050-999)
      const bankCode = parseInt(value.substring(6), 10);

      if (bankCode < 50 || bankCode > 999) {
        return { incorrectBik: true };
      }

      return null;
    };
  }
}
