import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SbiInputComponent } from '../sbi-input/sbi-input.component';
import { PHONE_INPUT_ERROR_MESSAGES, PHONE_INPUT_MASK_CONFIG } from '../../const/sbi-phone.const';
import { SbiPhoneType } from './sbi-phone-input.models';

/**
 * Компонент для ввода телефонного номера РФ.
 *
 * @Component
 * @selector: 'sbi-phone-input'
 * @templateUrl: './sbi-phone-input.component.html'
 * @styleUrls: ['./sbi-phone-input.component.scss']
 * @imports: [
 *   MatInputModule,
 *   NgxMaskDirective,
 * ]
 * @providers: [provideNgxMask()]
 * @standalone: true
 */
@Component({
  selector: 'sbi-phone-input',
  templateUrl: './sbi-phone-input.component.html',
  styleUrls: ['./sbi-phone-input.component.scss'],
  imports: [
    SbiInputComponent
  ],
  standalone: true,
})
export class SbiPhoneInputComponent implements OnInit {

  /**
   * @private
   * @description Тип телефонного номера.
   * @type {'standart ' | 'noСharacters' | 'work' | 'workNoCharacters'}
   * @defaultValue 'standard'
   */
  @Input() phoneType: SbiPhoneType = 'standard';

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
   * @description Префикс для маски ввода.
   * @type {string}
   * @defaultValue '+7 '
   */
  @Input() ngxPrefix: string = '+7 ';

  /**
   * @public
   * @description Состояние фокусировки на компоненте.
   * @type {string}
   * @defaultValue '+7(111) 111-11-11'
   */
  @Input() placeholder: string = '+7(111) 111-11-11';

   /**
   * @public
   * @description Id для авто тестов.
   * @type {string}
   * @defaultValue 'sbi-phone-input'
   * */
   @Input() public testId: string = 'sbi-phone-input';

  /**
   * @private
   * @description Поле для хранения сообщений об ошибках.
   * @type {Record<string, string>}
   * @defaultValue PHONE_INPUT_ERROR_MESSAGES
   */
  private _errorMessages: Record<string, string> = PHONE_INPUT_ERROR_MESSAGES;

  /**
   * @public
   * @setter
   * @description Устанавливает ошибки валидации. Объединяет переданные сообщения с дефолтными.
   * @param {Record<string, string> | undefined} errorMessages - Ошибки валидации.
   */
  @Input()
  public set errorMessages(errorMessages: Record<string, string> | undefined) {
    this._errorMessages = { ...PHONE_INPUT_ERROR_MESSAGES, ...errorMessages }
  }

  /**
   * @public
   * @getter
   * @description Возвращает ошибки валидации.
   * @returns {Record<string, string>} Ошибки валидации
   */
  public get errorMessages(): Record<string, string> {
    return this._errorMessages;
  }

  /**
   * @public
   * @getter
   * @description Возвращает маску ввода в зависимости от выбранного типа номера.
   * @returns {string} Строка маски для ngxMask.
   */
  public get ngxMask(): string {
    return PHONE_INPUT_MASK_CONFIG[this.phoneType];
  }

  ngOnInit() {
    this.control.addValidators([Validators.minLength(10)]);
  }
}
