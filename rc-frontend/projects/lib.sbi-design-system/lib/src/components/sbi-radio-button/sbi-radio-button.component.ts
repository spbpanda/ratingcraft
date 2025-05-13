import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

/**
 * Компонент для отображения радио-кнопки с поддержкой лейбла, заметки, ошибок и ссылки.
 *
 * Поддерживает отображение пользовательского контента через ngTemplateOutlet.
 *
 * @Component
 * @selector: 'sbi-radio-button'
 * @standalone: true
 * @imports: [NgIf, NgFor, NgClass, ReactiveFormsModule, MatRadioModule, NgTemplateOutlet]
 * @templateUrl: './sbi-radio-button-group.component.html'
 * @styleUrl: './sbi-radio-button-group.component.scss'
 */
@Component({
  selector: 'sbi-radio-button',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule, MatRadioModule, NgTemplateOutlet],
  templateUrl: './sbi-radio-button.component.html',
  styleUrl: './sbi-radio-button.component.scss',
})
export class SbiRadioButtonComponent {

  /**
   * @public
   * @description Значение радио-кнопки.
   * @type {string | boolean}
   * @defaultValue false
   */
  @Input() public value: string | boolean = false;

  /**
   * @public
   * @description Лейбл для радио-кнопки.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public label?: string;

  /**
   * @public
   * @description Флаг, указывающий, отключена ли радио-кнопка.
   * @type {boolean | undefined}
   * @defaultValue undefined
   */
  @Input() public disabled?: boolean;

  /**
   * @public
   * @description Дополнительное описание для радио-кнопки.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public note?: string;

  /**
   * @public
   * @description Флаг, указывающий, является ли радио-кнопка ссылкой.
   * @type {boolean | undefined}
   * @defaultValue undefined
   */
  @Input() public isLink?: boolean;

  /**
   * @public
   * @description Пользовательский шаблон содержимого для радио-кнопки.
   * @type {TemplateRef<any> | undefined}
   * @defaultValue 'undefined'
   */
  @Input() public customContent?: TemplateRef<any>;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-radio'
   */
  @Input() public testId: string = 'sbi-radio';

  /**
   * @public
   * @description Событие, которое срабатывает при клике на ссылку (если isLink = true).
   * @type {EventEmitter<void>}
   */
  @Output() public clickToLink: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @public
   * @description Обрабатывает клик на ссылку (если isLink = true).
   * Вызывает событие `clickToLink` с выбранной опцией.
   */
  onClickToLink() {
    this.isLink && this.clickToLink.emit();
  }
}
