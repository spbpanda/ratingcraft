import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

/**
 * Интерфейс для опций радио-кнопок.
 * Содержит все необходимые свойства для отображения и управления отдельной радио-кнопкой.
 */
export interface SbiRadioButtonOption {
  /** Значение радио-кнопки. */
  value: string | boolean;
  /** Лейбл для радио-кнопки. */
  label?: string;
  /** Флаг, указывающий, отключена ли радио-кнопка. */
  disabled?: boolean;
  /** Дополнительное описание для радио-кнопки. */
  note?: string;
  /** Флаг, указывающий, является ли радио-кнопка ссылкой. */
  isLink?: boolean;
  /** Пользовательский шаблон содержимого для радио-кнопки. */
  customContent?: TemplateRef<any>;
}

/**
 * Компонент для отображения группы радио-кнопок с поддержкой лейбла, заметки, ошибок и ссылки.
 *
 * Поддерживает отображение пользовательского контента через ngTemplateOutlet.
 *
 * @Component
 * @selector: 'sbi-radio-button'
 * @standalone: true
 * @imports: [NgIf, NgFor, NgClass, ReactiveFormsModule, MatRadioModule, NgTemplateOutlet]
 * @templateUrl: './sbi-radio-button.component.html'
 * @styleUrl: './sbi-radio-button.component.scss'
 */
@Component({
  selector: 'sbi-radio-button',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ReactiveFormsModule, MatRadioModule, NgTemplateOutlet],
  templateUrl: './sbi-radio-button.component.html',
  styleUrl: './sbi-radio-button.component.scss',
})
export class SbiRadioButtonComponent {
  /**
   * Массив опций для радио-кнопок.
   * @type {SbiRadioButtonOption[]}
   */
  @Input() options: SbiRadioButtonOption[] = [];

  /**
   * Форм-контроль для управления состоянием выбранной радио-кнопки.
   * @type {FormControl}
   */
  @Input() control: FormControl = new FormControl();

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId: string = 'sbi-radio';

  /**
   * Сообщения об ошибках для валидации.
   * @type {Record<string, string> | undefined}
   */
  @Input() errorMessages?: Record<string, string>;

  /**
   * Флаг, указывающий, нужно ли показывать ошибки.
   * @type {boolean}
   */
  @Input() showErrors: boolean = true;

  /**
   * Событие, которое срабатывает при клике на ссылку (если isLink = true).
   * @type {EventEmitter<SbiRadioButtonOption>}
   */
  @Output() clickToLink = new EventEmitter<SbiRadioButtonOption>();

  /**
   * Обрабатывает клик на ссылку (если isLink = true).
   * Вызывает событие `clickToLink` с выбранной опцией.
   * @param {SbiRadioButtonOption} option - Опция, на которую был сделан клик.
   */
  onClickToLink(option: SbiRadioButtonOption) {
    if (option.isLink) {
      this.clickToLink.emit(option);
    }
  }
}
