import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbiInputComponent } from '../sbi-input/sbi-input.component';
import { INN_INPUT_VALIDATION_ERRORS } from '../../const/sbi-inn-validation-errors.const';
import { SbiInnValidator } from '../../validators/sbi-inn-validator/sbi-inn-input.validators';
import { SbiInnInputType } from "./sbi-inn-input.models";

/**
 * Компонент для ввода ИНН.
 *
 * @Component
 * @selector: 'sbi-inn-input'
 * @templateUrl: './sbi-inn-input.component.html'
 * @styleUrls: ['./sbi-inn-input.component.scss']
 * @imports: [
 *   MatInputModule,
 * ]
 * @standalone: true
 */
@Component({
  selector: 'sbi-inn-input',
  templateUrl: './sbi-inn-input.component.html',
  styleUrls: ['./sbi-inn-input.component.scss'],
  imports: [
    SbiInputComponent
  ],
  standalone: true,
})
export class SbiInnInputComponent implements OnInit {

  /**
   * @public
   * @description Тип ИНН.
   * @type {'legal' | 'individual'}
   * @defaultValue individual
   */
  @Input() innType: SbiInnInputType = 'individual';

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
   * @description Id для авто тестов.
   * @type {string}
   * @defaultValue 'sbi-inn-input'
   * */
  @Input() public testId: string = 'sbi-inn-input';

  /**
   * @private
   * @description Поле для хранения сообщений об ошибках.
   * @type {Record<string, string>}
   * @defaultValue INN_INPUT_VALIDATION_ERRORS
   */
  private _errorMessages: Record<string, string> = INN_INPUT_VALIDATION_ERRORS;

  /**
   * @public
   * @setter
   * @description Устанавливает ошибки валидации. Объединяет переданные сообщения с дефолтными.
   * @param {Record<string, string> | undefined} errorMessages - Ошибки валидации.
   */
  @Input()
  public set errorMessages(errorMessages: Record<string, string> | undefined) {
    this._errorMessages = { ...INN_INPUT_VALIDATION_ERRORS, ...errorMessages }
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
  public get innMask(): string {
    return this.innType === 'legal' ? '0000000000' : '000000000000';
  }

  ngOnInit() {
    this.control.addValidators([
      SbiInnValidator.createInnValidator(this.innType)
    ]);
  }
}
