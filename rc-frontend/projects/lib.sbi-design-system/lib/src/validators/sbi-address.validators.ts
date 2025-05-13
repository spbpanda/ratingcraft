import { AbstractControl, ValidationErrors } from '@angular/forms';
import { SbiAddressBase } from '../models/sbi-da-data-models';
import { SbiDaDataAddress } from '../components/sbi-dadata-address/sbi-dadata-address.model';

export class SbiAddressValidator {

  /**
   * Валидатор проверки выбран ли адрес из списка предложенных
   * @param control
   * @returns Объект с ошибкой `{ manualEnter: true }`, если значение не выбрано из списка,
   *          null - адрес выбран из подсказок
   */
  public static manualEnter(control: AbstractControl): ValidationErrors | null {
    if (control.value && typeof control.value !== 'object') {
      return { manualEnter: true };
    }
    return null;
  };

  /**
   * Валидация адреса до региона
   * @returns null - адрес введен до региона
   *          Объект с ошибкой `{ regionNotFound: true }` - адрес выбран из списка cdi, но не выбран регион
   */
  public static regionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as undefined | null | string | SbiAddressBase | SbiDaDataAddress;

    if (value && typeof value === 'object') {
      if (!value?.region) {
        return { regionNotFound: true };
      }
    }

    return null;
  };

  /**
   * Валидация адреса до города или поселения
   * @returns null - адрес введен до города или поселения
   *          Объект с ошибкой `{ cityNotFound: true } - адрес выбран из списка cdi, но не выбран город или поселение
   */
  public static cityValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as undefined | null | string | SbiAddressBase | SbiDaDataAddress;


    if (value && typeof value === 'object') {
      if (!value?.city && !value?.settlement) {
        return { cityNotFound: true };
      }
    }

    return null;
  };

  /**
   * Валидация адреса до номера дома
   * @returns null - адрес введен до номера дома
   *          Объект с ошибкой `{ houseNotFound: true } - адрес выбран из списка cdi, но не выбран номер дома
   */
  public static houseValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as undefined | null | string | SbiAddressBase | SbiDaDataAddress;

    if (value && typeof value === 'object') {
      if (!value?.house) {
        return { houseNotFound: true };
      }
    }

    return null;
  };

  /**
   * Валидация адреса до номера квартиры
   * @returns null - адрес введен до номера квартиры
   *          Объект с ошибкой `{ flatNotFound: true } - адрес выбран из списка cdi, но не выбран номер квартиры
   */
  public static flatValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as undefined | null | string | SbiAddressBase | SbiDaDataAddress;

    if (value && typeof value === 'object') {
      if (!value?.flat) {
        return { flatNotFound: true };
      }
    }

    return null;
  };

}
