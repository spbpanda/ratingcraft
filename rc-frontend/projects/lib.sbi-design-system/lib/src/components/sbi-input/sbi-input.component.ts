import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSuffix } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiUppercaseDirective } from '../../directives/sbi-uppercase.directive';
import { SbiNameUppercaseDirective } from '../../directives/sbi-name-uppercase.directive';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { BUTTON_CROSS } from '../../const/icons';
import { SbiComponentWithInput } from '../../classes/sbi-component-with-input.component';
import { PrefixIconType, SuffixIconType } from '../../models/input.types';
import { SbiMultiUppercaseDirective } from '../../directives/sbi-multi-uppercase.directive';
import { SbiInputModeDirective } from '../../directives/sbi-input-mode.directive';
import { SbiTitleCaseDirective } from '../../directives/sbi-title-case.directive';

/**
 * Компонент для отображения поля ввода с расширенной функциональностью.
 *
 * Поддерживает работу с масками ввода, иконками, валидацией и преобразованием текста.
 * Наследуется от базового компонента SbiComponentWithInput.
 *
 * Принимает несколько ng-content для отображения контента:
 * 1. prefix-icon - контент для отображения иконки перед полем ввода;
 * 2. suffix-icon - контент для отображения иконки после поля ввода;
 * 3. suffix-content - кастомный контент отображаемый после поля ввода.
 *
 * @Component
 * @selector: 'sbi-input'
 * @templateUrl: './sbi-input.component.html'
 * @styleUrls: ['./sbi-input.component.scss']
 * @standalone: true
 */
@Component({
  selector: 'sbi-input',
  templateUrl: './sbi-input.component.html',
  styleUrls: ['./sbi-input.component.scss'],
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatInputModule,
    MatSuffix,
    NgxMaskDirective,
    SbiErrorComponent,
    SbiIconComponent,
    SbiUppercaseDirective,
    SbiNameUppercaseDirective,
    SbiMultiUppercaseDirective,
    SbiInputModeDirective,
    SbiTitleCaseDirective,
  ],
  providers: [provideNgxMask()],
  standalone: true,
})
export class SbiInputComponent<T>
  extends SbiComponentWithInput<T>
  implements OnInit {
  /**
   * Возвращает SVG иконку очистки поля ввода.
   * @returns {string} SVG строка иконки очистки.
   */
  public get clearIcon() {
    return BUTTON_CROSS;
  }

  /**
   * Максимальная длина вводимого текста.
   * @type {number | string | null}
   */
  @Input() maxLength: number | string | null = null;

  /**
   * Минимальная длина вводимого текста.
   * @type {number | string | null}
   */
  @Input() minLength: number | string | null = null;

  /**
   * Тип иконки, отображаемой в конце поля ввода.
   * @type {SuffixIconType}
   */
  @Input() suffixIconType: SuffixIconType = 'clear';

  /**
   * Тип иконки, отображаемой в начале поля ввода.
   * @type {PrefixIconType}
   */
  @Input() prefixIconType: PrefixIconType = 'none';

  /**
   * Флаг активации автоматического преобразования текста в верхний регистр.
   * @type {boolean}
   */
  @Input() inputUppercaseActive = false;

  /**
   * Флаг активации преобразования имён в формат с заглавной буквы.
   * @type {boolean}
   */
  @Input() inputNameUppercaseActive = false;

  /**
   * Флаг активации преобразования первой буквы ввода в верхний регистр.
   * @type {boolean}
   */
  @Input() inputTitleCaseActive = false;

  /**
   * Маска для форматирования ввода (через библиотеку ngx-mask).
   * @type {string | null}
   */
  @Input() ngxMask: string | null = null;

  /**
   * Суффикс для маски ввода.
   * @type {string}
   */
  @Input() ngxSuffix: string = '';

  /**
   * Префикс для маски ввода.
   * @type {string}
   */
  @Input() ngxPrefix: string = '';

  /**
   * Шаблон (паттерн) для маски ввода.
   * @type {any}
   */
  @Input() ngxPattern: any = null;

  /**
   * Лимит разделителя для маски ввода.
   * @type {string}
   */
  @Input() ngxSeparatorLimit: string = '';

  /**
   * Флаг, указывающий, нужно ли удалять специальные символы при применении маски.
   * @type {boolean}
   */
  @Input() dropSpecialCharacters = true;

  /**
   * Минимальное допустимое числовое значение для ввода.
   * @type {number | null}
   */
  @Input() min: number | null = null;

  /**
   * Максимальное допустимое числовое значение для ввода.
   * @type {number | null}
   */
  @Input() max: number | null = null;

  /**
   * Флаг, указывающий, нужно ли показывать ошибки валидации.
   * @type {boolean}
   */
  @Input() showErrors: boolean = true;

  /**
   * Флаг активации расширенного преобразования текста в верхний регистр.
   * @type {boolean}
   */
  @Input() inputMultiUppercaseActive = false;

  /**
   * Разделитель тысяч для числовых значений.
   * @type {string}
   */
  @Input() ngxThousandSeparator = '';
}
