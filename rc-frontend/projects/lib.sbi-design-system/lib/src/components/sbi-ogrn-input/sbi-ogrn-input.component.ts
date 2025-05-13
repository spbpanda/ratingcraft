import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbiInputComponent } from '../sbi-input/sbi-input.component';
import { SbiOgrnType } from './sbi-ogrn-input.models';
import { SbiOgrnValidator } from '../../validators/sbi-ogrn-ogrnip.validators';
import {
  OGRN_INPUT_VALIDATION_ERRORS,
} from '../../const/sbi-ogrn-validation-errors.const';

/**
 * Компонент для ввода ОГРН.
 *
 * @Component
 * @selector: 'sbi-ogrn-input'
 * @templateUrl: './sbi-ogrn-input.component.html'
 * @styleUrls: ['./sbi-ogrn-input.component.scss']
 * @imports: [
 *   SbiInputComponent,
 * ]
 * @standalone: true
 */
@Component({
  selector: 'sbi-ogrn-input',
  templateUrl: './sbi-ogrn-input.component.html',
  styleUrls: ['./sbi-ogrn-input.component.scss'],
  imports: [SbiInputComponent],
  standalone: true,
})
export class SbiOgrnInputComponent implements OnInit {
  /**
   * @public
   * @description Тип маски для ОГРН.
   * @type {'standard' | 'standardWithCharacters'}
   * @defaultValue standard
   */
  @Input() maskType: SbiOgrnType = 'standard';

  /**
   * @public
   * @required
   * @description Форм контролл.
   * @type {FormControl}
   */
  @Input({ required: true }) public control!: FormControl<number | null>;

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
   * @description Флаг, определяющий, нужно ли удалять специальные символы при вводе.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public dropSpecialCharacters: boolean = true;

  /**
   * @public
   * @description Id для авто тестов.
   * @type {string}
   * @defaultValue 'sbi-ogrn-input'
   * */
  @Input() public testId: string = 'sbi-ogrn-input';

  /**
   * @private
   * @description Поле для хранения сообщений об ошибках.
   * @type {Record<string, string>}
   * @defaultValue OGRN_INPUT_VALIDATION_ERRORS
   */
  private _errorMessages: Record<string, string> = OGRN_INPUT_VALIDATION_ERRORS;

  /**
   * @public
   * @setter
   * @description Устанавливает ошибки валидации. Объединяет переданные сообщения с дефолтными.
   * @param {Record<string, string> | undefined} errorMessages - Ошибки валидации.
   */
  @Input() public set errorMessages(
    errorMessages: Record<string, string> | undefined
  ) {
    this._errorMessages = {
      ...OGRN_INPUT_VALIDATION_ERRORS,
      ...errorMessages,
    };
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
   * @description Возвращает маску поля ввода.
   * @returns {string}
   */
  public get ogrnMask(): string {
    return this.maskType === 'standard'
      ? '0000000000000'
      : '0-00-00-0000000-0';
  }

  ngOnInit() {
    this.control.addValidators([SbiOgrnValidator.createOgrnValidator('ogrn')]);
  }
}
