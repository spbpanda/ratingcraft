import { Component, Input } from '@angular/core';
import { MatError } from '@angular/material/form-field';
import { ValidationErrors } from '@angular/forms';

/**
 * Компонент отображения ошибки, например ошибки валидации формы или валидации контрола.
 *
 * @Component
 * @selector: 'sbi-error'
 * @templateUrl: './sbi-error.component.html'
 * @styleUrls: ['./sbi-error.component.scss']
 * @imports: [MatError]
 * @standalone: true
 */
@Component({
  selector: 'sbi-error',
  templateUrl: './sbi-error.component.html',
  styleUrls: ['./sbi-error.component.scss'],
  imports: [MatError],
  standalone: true
})
export class SbiErrorComponent {
  /**
   * @private
   * @description Список базовых сиснеймов ошибок и их текстовок.
   * @type {ValidationErrors | null}
   * @defaultValue { required: 'Поле обязательное.' }
   */
  private defaultErrorMessages: Record<string, string> = {
    required: 'Поле обязательное.',
  };

  /**
   * @public
   * @description Список сиснеймов ошибок.
   * @type {ValidationErrors | null}
   * @defaultValue null
   */
  @Input({ required: true }) public errors: ValidationErrors | null = null;

  /**
   * @public
   * @description Идентификатор для авто тестов.
   * @type {string}
   * @defaultValue 'sbi-error'
   */
  @Input() public testId: string = 'sbi-error';

  /**
   * @public
   * @description Полный список ошибок их текстовок.
   * @type { Record<string, string> | undefined}
   * @defaultValue { required: 'Поле обязательное.' }
   */
  private _errorMessages: Record<string, string> | undefined = this.defaultErrorMessages;

  /**
   * @public
   * @setter
   * @description устанавливает полный список сиснеймов ошибок.
   * @param {Record<string, string> | undefined} messages
   * @defaultValue null
   */
  @Input()
  public set errorMessages(messages: Record<string, string> | undefined) {
    this._errorMessages = messages ? { ...this.defaultErrorMessages, ...messages } : this.defaultErrorMessages;
  }

  /**
   * @public
   * @getter
   * @description Возвращает полный список сиснеймов ошибок.
   * @return {Record<string, string>}
   */
  public get errorMessages(): Record<string, string> {
    return this._errorMessages ?? {};
  }

  /**
   * @public
   * @description Возвращает текстовку текущей ошибки.
   * @return {string}
   */
  public getErrorMessage(): string {
    if (!this.errors) {
      return ''
    }
    const errorKeys = Object.keys(this.errors);
    if (errorKeys.length > 0) {
      const errorKey = errorKeys[0];
      return this.errorMessages[errorKey] ?? '';
    }
    return '';
  }
}
