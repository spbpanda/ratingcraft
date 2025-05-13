import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SbiSuffixIconType } from '../sbi-input/sbi-input.models';

/**
 * Компонент области ввода текста.
 *
 * @Component
 * @selector: 'sbi-textarea',
 * @templateUrl: './sbi-textarea.component.html'
 * @styleUrl: './sbi-textarea.component.scss'
 * @standalone: true
 * @imports: [
 *   CommonModule,
 *   ReactiveFormsModule,
 *   MatFormFieldModule,
 *   MatInputModule,
 *   SbiErrorComponent,
 * ]
 */
@Component({
  selector: 'sbi-textarea',
  templateUrl: './sbi-textarea.component.html',
  styleUrl: './sbi-textarea.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SbiErrorComponent,
  ],
})
export class SbiTextareaComponent {
  /**
   * @public
   * @description Форм-контрол для управления состоянием textarea.
   * @type {FormControl<string | null>}
   * */
  @Input() public control!: FormControl<string | null>;

  /**
   * @public
   * @description Лейбл для textarea.
   * @type {string | null}
   * @defaultValue ''
   * */
  @Input() public label: string | null = null;

  /**
   * @public
   * @description Плейсхолдер для textarea.
   * @type {string}
   * @defaultValue ''
   * */
  @Input() public placeholder: string = '';

  /**
   * @public
   * @description Если true, textarea будет доступна только для чтения.
   * @type {string}
   * @defaultValue ''
   * */
  @Input() public readonly: boolean = false;

  /**
   * @public
   * @description Если true, textarea можно двигать.
   * @type {string}
   * @defaultValue ''
   * */
  @Input() public isAutoResize: boolean = true;

  /**
   * @public
   * @description Дефолтная высота textarea, если isAutoResize = false.
   * @type {string}
   * @defaultValue ''
   * */
  @Input() public height: string = '56px';

  /**
   * @public
   * @description Минимальное кол-во строк, если isAutoResize = true.
   * @type {string}
   * @defaultValue ''
   * */
  @Input() public minRows: number | null = 1;

  /**
   * @public
   * @description  Максимальное кол-во строк, если isAutoResize = true.
   * @type {string}
   * @defaultValue ''
   * */
  @Input() public maxRows: number | null = null;

  /**
   *Максимальное кол-во символов
   */
  @Input() public maxLength: number | null = null;

  /**
   * @public
   * @description Кастомные сообщения об ошибках для валидации.
   * @type {string}
   * @defaultValue ''
   * */
  @Input() public errorMessages: Record<string, string> | undefined;

  /**
   * @public
   * @description Тип иконки отображаемой в matSuffix.
   * @type {'clear' | 'custom'}
   * @defaultValue 'clear'
   * */
  @Input() public suffixIconType: SbiSuffixIconType = 'clear';

  /**
   * @public
   * @description Примечание, отображаемое под textarea.
   * @type {string | null}
   * @defaultValue null
   * */
  @Input() public subtitle: string | null = null;

  /**
   * @public
   * @description
   * @type {string}
   * @defaultValue ''
   * */
  @Input() public testId: string = 'sbi-textarea';

  /**
   * @public
   * @description Очищает значение в control-е.
   * @type {string}
   * @defaultValue ''
   * */
  public clearControl() {
    this.control.setValue(null);
  }
}
