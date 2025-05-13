import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbiInputComponent } from '../sbi-input/sbi-input.component';
import { SbiKppType } from './sbi-kpp-input.models';
import { KPP_INPUT_VALIDATION_ERRORS } from '../../const/sbi-kpp-validation-errors.const';
import { SbiKppValidator } from '../../validators/sbi-kpp.validators';

/**
 * Компонент для ввода KПП.
 *
 * @Component
 * @selector: 'sbi-kpp-input'
 * @templateUrl: './sbi-kpp-input.component.html'
 * @styleUrls: ['./sbi-kpp-input.component.scss']
 * @imports: [
 *   SbiInputComponent,
 * ]
 * @standalone: true
 */
@Component({
  selector: 'sbi-kpp-input',
  templateUrl: './sbi-kpp-input.component.html',
  styleUrls: ['./sbi-kpp-input.component.scss'],
  imports: [
    SbiInputComponent
  ],
  standalone: true,
})
export class SbiKppInputComponent implements OnInit {

  /**
   * @public
   * @description Тип маски для КПП.
   * @type {'standard' | 'standardWithCharacters'}
   * @defaultValue standard
   */
  @Input() maskType: SbiKppType = 'standard';

  /**
   * @public
   * @description Форм контролл.
   * @required
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
   * @defaultValue 'sbi-kpp-input'
   * */
  @Input() public testId: string = 'sbi-kpp-input';
  
  /**
   * @private
   * @description Поле для хранения сообщений об ошибках.
   * @type {Record<string, string>}
   * @defaultValue KPP_INPUT_VALIDATION_ERRORS
   */
  private _errorMessages: Record<string, string> = KPP_INPUT_VALIDATION_ERRORS;

  /**
   * @public
   * @setter
   * @description Устанавливает ошибки валидации. Объединяет переданные сообщения с дефолтными.
   * @param {Record<string, string> | undefined} errorMessages - Ошибки валидации.
   */
  @Input() public set errorMessages(errorMessages: Record<string, string> | undefined) {
    this._errorMessages = { ...KPP_INPUT_VALIDATION_ERRORS, ...errorMessages }
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
  public get kppMask(): string {
    return this.maskType === 'standard' ? '0000XX000' : '0000-XX-000';
  }

  ngOnInit() {
    this.control.addValidators([
      SbiKppValidator.createKppValidator()
    ]);
  }
}