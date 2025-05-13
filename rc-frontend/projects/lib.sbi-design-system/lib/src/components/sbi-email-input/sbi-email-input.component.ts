import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbiInputComponent } from '../sbi-input/sbi-input.component';
import { EMAIL_INPUT_ERROR_MESSAGES } from '../../const/sbi-email-validation-errors.const';
import { SbiEmailValidator } from '../../validators/sbi-email.validators';


/**
 * Компонент для ввода электронной почты.
 *
 * @Component
 * @selector: 'sbi-email-input'
 * @templateUrl: './sbi-email-input.component.html'
 * @styleUrls: ['./sbi-email-input.component.scss']
 * @imports: [
 *   SbiInputComponent,
 * ]
 * @standalone: true
 */
@Component({
  selector: 'sbi-email-input',
  templateUrl: './sbi-email-input.component.html',
  styleUrls: ['./sbi-email-input.component.scss'],
  imports: [
    SbiInputComponent
  ],
  standalone: true
})
export class SbiEmailInputComponent implements OnInit {

  /**
   * @public
   * @description Флаг, обозначающий возможность вводить кириллицу.
   * @type boolean
   * @defaultValue false
   */
  @Input() hasRussianCharacters: boolean = false;

  /**
   * @public
   * @required
   * @description Форм контролл.
   * @type {FormControl}
   */
  @Input({ required: true }) public control!: FormControl<string | null>;

  /**
   * @public
   * @description Лейблл поля ввода.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public label: string = '';

  /**
   * @public
   * @description Состояние фокусировки на компоненте.
   * @type {string}
   * @defaultValue ''
   */
  @Input() placeholder: string = '';

  /**
   * @public
   * @description Id для авто тестов.
   * @type {string}
   * @defaultValue 'sbi-email-input'
   * */
  @Input() public testId: string = 'sbi-email-input';

  /**
   * @private
   * @description Поле для хранения сообщений об ошибках.
   * @type {Record<string, string>}
   * @defaultValue EMAIL_INPUT_ERROR_MESSAGES
   */
  private _errorMessages: Record<string, string> = EMAIL_INPUT_ERROR_MESSAGES;

  /**
   * @public
   * @setter
   * @description Устанавливает ошибки валидации. Объединяет переданные сообщения с дефолтными.
   * @param {Record<string, string> | undefined} errorMessages - Ошибки валидации.
   */
  @Input() public set errorMessages(errorMessages: Record<string, string> | undefined) {
    this._errorMessages = { ...EMAIL_INPUT_ERROR_MESSAGES, ...errorMessages }
  }

  /**
   * @public
   * @getter
   * @description Возвращает ошибки валидации.
   * @returns {Record<string, string>} Ошибки валидации
   */
  get errorMessages(): Record<string, string> {
    return this._errorMessages;
  }

  /**
   * @public
   * @getter
   * @description Возвращает маску.
   * @returns {string} Строка маски для ngxMask.
   */
  get emailMask(): string {
    return this.hasRussianCharacters ? 'R*@R*.R*' : 'X*@X*.X*'
  }

  ngOnInit() {
    this.control.addValidators([
      SbiEmailValidator.createEmailValidator(this.hasRussianCharacters)
    ]);
  }
}