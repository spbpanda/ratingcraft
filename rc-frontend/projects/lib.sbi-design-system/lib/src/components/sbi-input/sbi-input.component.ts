import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSuffix } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiUppercaseDirective } from '../../directives/sbi-uppercase.directive';
import { SbiNameUppercaseDirective } from '../../directives/sbi-name-uppercase.directive';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { BUTTON_CROSS, BUTTON_SEARCH } from '../../const/icons';
import { SbiComponentWithInput } from '../../classes/sbi-component-with-input.component';
import { SbiPrefixIconType, SbiSuffixIconType } from './sbi-input.models';
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
 * @imports: [
 *   NgIf,
 *   ReactiveFormsModule,
 *   MatInputModule,
 *   MatSuffix,
 *   NgxMaskDirective,
 *   SbiErrorComponent,
 *   SbiIconComponent,
 *   SbiUppercaseDirective,
 *   SbiNameUppercaseDirective,
 *   SbiMultiUppercaseDirective,
 *   SbiInputModeDirective,
 *   SbiTitleCaseDirective,
 * ]
 * @providers: [provideNgxMask({
      patterns: {
        'X': { pattern: /[a-zA-Z0-9._\-]/ },
        'R': { pattern: /[а-яА-ЯёЁa-zA-Z0-9._\-]/},
        '0': { pattern: /[0-9]/ }
      }
    })]
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
  providers: [
    provideNgxMask({
      patterns: {
        'X': { pattern: /[a-zA-Z0-9._\-]/ }, //латиница и цифры
        'R': { pattern: /[а-яА-ЯёЁa-zA-Z0-9._\-]/}, //латиница, кириллица и цифры
        '0': { pattern: /[0-9]/ } //цифры
      },
    })
  ],
  standalone: true,
})
export class SbiInputComponent<T> extends SbiComponentWithInput<T> implements OnInit {
  /**
   * @public
   * @readonly
   * @description Иконка поиска.
   * @type {string}
   * @defaultValue BUTTON_SEARCH
   */
  public readonly searchIcon: string = BUTTON_SEARCH;

  /**
   * @public
   * @getter
   * @description Возвращает SVG иконку очистки поля ввода.
   * @returns {string} SVG строка иконки очистки.
   */
  public get clearIcon(): string {
    return BUTTON_CROSS;
  }

  /**
   * @public
   * @description Форм контролл.
   * @type {FormControl<T | null>}
   */
  @Input() public declare control: FormControl<T | null>;

  /**
   * @public
   * @description Максимальная длина вводимого текста.
   * @type {number | string | null}
   * @defaultValue null
   */
  @Input() public maxLength: number | string | null = null;

  /**
   * @public
   * @description Минимальная длина вводимого текста.
   * @type {number | string | null}
   * @defaultValue null
   */
  @Input() public minLength: number | string | null = null;

  /**
   * @public
   * @description Тип иконки, отображаемой в конце поля ввода.
   * @type {'clear' | 'custom'}
   * @defaultValue 'clear'
   */
  @Input() public suffixIconType: SbiSuffixIconType = 'clear';

  /**
   * @public
   * @description Тип иконки, отображаемой в начале поля ввода.
   * @type {'search' | 'custom' | 'none'}
   * @defaultValue ''none
   */
  @Input() public prefixIconType: SbiPrefixIconType = 'none';

  /**
   * @public
   * @description Флаг активации автоматического преобразования текста в верхний регистр.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public inputUppercaseActive: boolean = false;

  /**
   * @public
   * @description Флаг активации преобразования имён в формат с заглавной буквы.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public inputNameUppercaseActive: boolean = false;

  /**
   * @public
   * @description Флаг активации преобразования первой буквы ввода в верхний регистр.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public inputTitleCaseActive: boolean = false;

  /**
   * @public
   * @description Флаг активации расширенного преобразования текста в верхний регистр.
   * Преобразует первую букву каждого слова в верхний регистр
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public inputMultiUppercaseActive: boolean = false;

  /**
   * @public
   * @description Маска для форматирования ввода (через библиотеку ngx-mask).
   * @type {string | null}
   * @defaultValue null
   */
  @Input() public ngxMask: string | null = null;

  /**
   * @public
   * @description Суффикс для маски ввода.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public ngxSuffix: string = '';

  /**
   * @public
   * @description Префикс для маски ввода.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public ngxPrefix: string = '';

  /**
   * @public
   * @description Шаблон (паттерн) для маски ввода.
   * @type {any}
   * @defaultValue null
   */
  @Input() public ngxPattern: any = null;

  /**
   * @public
   * @description Лимит разделителя для маски ввода.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public ngxSeparatorLimit: string = '';

  /**
   * @public
   * @description Разделитель тысяч для числовых значений.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public ngxThousandSeparator: string = '';

  /**
   * @public
   * @description Флаг, указывающий, нужно ли удалять специальные символы при применении маски.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public dropSpecialCharacters: boolean = true;

  /**
   * @public
   * @description Минимальное допустимое числовое значение для ввода.
   * @type {number | null}
   * @defaultValue null
   */
  @Input() public min: number | null = null;

  /**
   * @public
   * @description Максимальное допустимое числовое значение для ввода.
   * @type {number | null}
   */
  @Input() public max: number | null = null;

  /**
   * @public
   * @description Флаг, указывающий, нужно ли показывать ошибки валидации.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public showErrors: boolean = true;
}
