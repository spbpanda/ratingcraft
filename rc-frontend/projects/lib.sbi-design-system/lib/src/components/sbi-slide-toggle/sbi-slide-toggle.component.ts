import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';

/**
 * Компонент для отображения переключателя (switch/toggle) с поддержкой лейбла, заметки, ошибок и ссылки.
 *
 * Поддерживает передачу <ng-content> (обязательное условие отображения ng-content - отсутствие label и note).
 * 
 * @Component
 * @selector: 'sbi-slide-toggle'
 * @standalone: true
 * @imports: [NgIf, NgClass, ReactiveFormsModule, SbiErrorComponent]
 * @templateUrl: './sbi-slide-toggle.component.html'
 * @styleUrl: './sbi-slide-toggle.component.scss'
 */
@Component({
  selector: 'sbi-slide-toggle',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule, SbiErrorComponent],
  templateUrl: './sbi-slide-toggle.component.html',
  styleUrl: './sbi-slide-toggle.component.scss',
})
export class SbiSlideToggleComponent implements OnChanges {
  /**
   * Лейбл для переключателя.
   * @type {string}
   */
  @Input() label: string = '';

  /**
   * Дополнительная заметка или описание для переключателя.
   * @type {string | undefined}
   */
  @Input() note?: string = '';

  /**
   * Форм-контроль для управления состоянием переключателя.
   * @type {FormControl<boolean | null>}
   */
  @Input() control!: FormControl<boolean | null>;

  /**
   * Значение переключателя.
   * @type {boolean | null | undefined}
   */
  @Input() slideToggleValue?: boolean | null = null;

  /**
   * Флаг, указывающий, является ли переключатель ссылкой.
   * @type {boolean}
   */
  @Input() isLink: boolean = false;

  /**
   * Флаг, указывающий, отключен ли переключатель.
   * @type {boolean}
   */
  @Input() disabled: boolean = false;

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId: string = 'sbi-slide-toggle';

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
   * Событие, которое срабатывает при изменении значения переключателя.
   * @type {EventEmitter<boolean>}
   */
  @Output() valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Обрабатывает изменения входных свойств.
   * @param {SimpleChanges} changes - Объект с изменениями входных свойств.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['slideToggleValue']?.currentValue) {
      this.control.setValue(changes?.['slideToggleValue']?.currentValue);
    }
    if (changes?.['disabled']?.currentValue) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  /**
   * Обрабатывает изменение значения переключателя.
   * Вызывает событие `valueChanged` с текущим значением переключателя.
   */
  onSlideToggleValueChanged() {
    this.valueChanged.emit(this.control?.value ?? this.slideToggleValue ?? false);
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
