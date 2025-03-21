import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';

/**
 * Компонент для отображения кастомного чекбокса с поддержкой лейбла, заметки, ошибок и ссылки.
 *
 * Поддерживает передачу <ng-content> (обязательное условие отображение ng-content - отсутствие label и note).
 * В <ng-content> можно передавать элементы с классами "label", "note", "link", текст в элементах с таким классом будет
 * автоматически застилизован под стиль компонента sbi-checkbox.
 *
 * @Component
 * @selector: 'sbi-checkbox'
 * @standalone: true
 * @imports: [NgIf, NgClass, ReactiveFormsModule, SbiErrorComponent]
 * @templateUrl: './sbi-checkbox.component.html'
 * @styleUrl: './sbi-checkbox.component.scss'
 */
@Component({
  selector: 'sbi-checkbox',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule, SbiErrorComponent],
  templateUrl: './sbi-checkbox.component.html',
  styleUrl: './sbi-checkbox.component.scss',
})
export class SbiCheckboxComponent implements OnChanges {
  /**
   * Лейбл для чекбокса.
   * @type {string}
   */
  @Input() label: string = '';

  /**
   * Дополнительная заметка или описание для чекбокса.
   * @type {string | undefined}
   */
  @Input() note?: string = '';

  /**
   * Форм-контроль для управления состоянием чекбокса.
   * @type {FormControl<boolean | null>}
   */
  @Input() control: FormControl<boolean | null> = new FormControl();

  /**
   * Значение чекбокса (внешнее управление).
   * @type {boolean | null | undefined}
   */
  @Input() checkboxValue?: boolean | null = null;

  /**
   * Флаг, указывающий, является ли чекбокс ссылкой.
   * @type {boolean}
   */
  @Input() isLink: boolean = false;

  /**
   * Флаг, указывающий, отключен ли чекбокс.
   * @type {boolean}
   */
  @Input() disabled: boolean = false;

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId: string = 'sbi-checkbox';

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
   * @type {EventEmitter<void>}
   */
  @Output() clickToLink = new EventEmitter();

  /**
   * Событие, которое срабатывает при изменении значения чекбокса.
   * @type {EventEmitter<boolean>}
   */
  @Output() valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Обрабатывает изменения входных свойств.
   * @param {SimpleChanges} changes - Объект с изменениями входных свойств.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (Object.prototype.hasOwnProperty.call(changes, 'checkboxValue')) {
      this.control.setValue(changes?.['checkboxValue']?.currentValue);
    }
    if (changes?.['disabled']?.currentValue) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  /**
   * Обрабатывает изменение значения чекбокса.
   * Вызывает событие `valueChanged` с текущим значением чекбокса.
   */
  onCheckboxValueChanged() {
    this.valueChanged.emit(this.control?.value ?? this.checkboxValue ?? false);
  }

  /**
   * Обрабатывает клик на ссылку (если isLink = true).
   * Вызывает событие `clickToLink`.
   */
  onClickToLink() {
    if (this.isLink) {
      this.clickToLink.emit();
    }
  }
}
