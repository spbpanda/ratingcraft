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
   * @public
   * @description Лейбл для чекбокса.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public label: string = '';

  /**
   * @public
   * @description Дополнительная заметка или описание для чекбокса.
   * @type {string | undefined}
   * @defaultValue ''
   */
  @Input() public note?: string = '';

  /**
   * @public
   * @description Форм-контроль для управления состоянием чекбокса.
   * @type {FormControl<boolean | null>}
   * @defaultValue new FormControl()
   */
  @Input() public control: FormControl<boolean | null> = new FormControl();

  /**
   * @public
   * @description Значение чекбокса (внешнее управление).
   * @type {boolean | null | undefined}
   * @defaultValue null
   */
  @Input() public checkboxValue?: boolean | null = null;

  /**
   * @public
   * @description Флаг, указывающий, является ли чекбокс ссылкой.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public isLink: boolean = false;

  /**
   * @public
   * @description Флаг, указывающий, отключен ли чекбокс.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public disabled: boolean = false;

  /**
   * @public
   * @description Сообщения об ошибках для валидации.
   * @type {Record<string, string> | undefined}
   * @defaultValue undefined
   */
  @Input() public errorMessages?: Record<string, string>;

  /**
   * @public
   * @description Флаг, указывающий, нужно ли показывать ошибки.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public showErrors: boolean = true;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-checkbox'
   */
  @Input() public testId: string = 'sbi-checkbox';

  /**
   * @public
   * @description Событие, которое срабатывает при клике на ссылку (если isLink = true).
   * @type {EventEmitter<void>}
   */
  @Output() public clickToLink: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @public
   * @description Событие, которое срабатывает при изменении значения чекбокса.
   * @type {EventEmitter<boolean>}
   */
  @Output() public valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @description Обрабатывает изменения входных свойств.
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
   * @public
   * @description Обрабатывает изменение значения чекбокса.
   * Вызывает событие `valueChanged` с текущим значением чекбокса.
   */
  public onCheckboxValueChanged() {
    this.valueChanged.emit(this.control?.value ?? this.checkboxValue ?? false);
  }

  /**
   * @public
   * @description Обрабатывает клик на ссылку (если isLink = true).
   * Вызывает событие `clickToLink`.
   */
  public onClickToLink() {
    this.isLink && this.clickToLink.emit();
  }
}
