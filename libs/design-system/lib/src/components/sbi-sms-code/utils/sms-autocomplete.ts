import { AbstractControl } from '@angular/forms';

const params: any = { otp: { transport:['sms'] } };

/**
 * Функция подключения автоподстановки смс
 * @param control - контролл для автоподстановки кода
 * @param window - экземпляр Window, необходим для проверки возможности автоподстановки
 * @param navigator - экземпляр Navigator, необходим для указания ОС, что наше приложение ожидает смс код
 */
export function smsAutocomplete(control: AbstractControl | null, window: Window, navigator: Navigator) {
  if ('OTPCredential' in window) {
    navigator.credentials.get(params).then(otp => {
      control?.setValue((<any>otp)?.code ?? '');
      // Повторное уведомление ОС об ожидании смс. Необходимо на случай, если пользователь повторно отправляет смс
      smsAutocomplete(control, window, navigator);
    }).catch(err => { throw err } );
  }
}
