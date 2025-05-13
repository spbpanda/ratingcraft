import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbiInputComponent } from '../sbi-input/sbi-input.component';
import { BIK_INPUT_VALIDATION_ERRORS } from '../../const/sbi-bik-validation-errors.const';
import { SbiBikValidator } from '../../validators/sbi-bik.validators';
import { SbiBikType } from './sbi-bik-input.models';

/**
 * Компонент для ввода БИК.
 *
 * @Component
 * @selector: 'sbi-bik-input'
 * @templateUrl: './sbi-bik-input.component.html'
 * @styleUrls: ['./sbi-bik-input.component.scss']
 * @imports: [
 *   SbiInputComponent,
 * ]
 * @standalone: true
 */
@Component({
  selector: 'sbi-bik-input',
  templateUrl: './sbi-bik-input.component.html',
  styleUrls: ['./sbi-bik-input.component.scss'],
  imports: [
    SbiInputComponent
  ],
  standalone: true,
})
export class SbiBikInputComponent implements OnInit {

  /**
   * @public
   * @description Тип маски для БИК.
   * @type {'standard' | 'standardWithCharacters'}
   * @defaultValue standard
   */
  @Input() maskType: SbiBikType = 'standard';

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
   * @defaultValue 'sbi-bik-input'
   * */
  @Input() public testId: string = 'sbi-bik-input';

  /**
   * @private
   * @description Поле для хранения сообщений об ошибках.
   * @type {Record<string, string>}
   * @defaultValue BIK_INPUT_VALIDATION_ERRORS
   */
  private _errorMessages: Record<string, string> = BIK_INPUT_VALIDATION_ERRORS;

  /**
   * @public
   * @setter
   * @description Устанавливает ошибки валидации. Объединяет переданные сообщения с дефолтными.
   * @param {Record<string, string> | undefined} errorMessages - Ошибки валидации.
   */
  @Input() public set errorMessages(errorMessages: Record<string, string> | undefined) {
    this._errorMessages = { ...BIK_INPUT_VALIDATION_ERRORS, ...errorMessages }
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
  public get bikMask(): string {
    return this.maskType === 'standard' ? '000000000' : '00-00-00-000';
  }

  ngOnInit() {
    this.control.addValidators([
      SbiBikValidator.createBikValidator()
    ]);
  }
}