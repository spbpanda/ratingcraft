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
   * @public
   * @description Лейбл для переключателя.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public label: string = '';

  /**
   * @public
   * @description Дополнительная заметка или описание для переключателя.
   * @type {string | undefined}
   * @defaultValue ''
   */
  @Input() public note?: string = '';

  /**
   * @public
   * @description Форм-контроль для управления состоянием переключателя.
   * @type {FormControl<boolean | null>}
   */
  @Input() public control!: FormControl<boolean | null>;

  /**
   * @public
   * @description Значение переключателя.
   * @type {boolean | null | undefined}
   * @defaultValue null
   */
  @Input() public slideToggleValue?: boolean | null = null;

  /**
   * @public
   * @description Флаг, указывающий, является ли переключатель ссылкой.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public isLink: boolean = false;

  /**
   * @public
   * @description Флаг, указывающий, отключен ли переключатель.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public disabled: boolean = false;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-slide-toggle'
   */
  @Input() public testId: string = 'sbi-slide-toggle';

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
   * @description Событие, которое срабатывает при клике на ссылку (если isLink = true).
   * @type {EventEmitter<void>}
   */
  @Output() public clickToLink: EventEmitter<void> = new EventEmitter();

  /**
   * @public
   * @description Событие, которое срабатывает при изменении значения переключателя.
   * @type {EventEmitter<boolean>}
   */
  @Output() public valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @description Обрабатывает изменения входных свойств.
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
   * @description Обрабатывает изменение значения переключателя.
   * Вызывает событие `valueChanged` с текущим значением переключателя.
   */
  onSlideToggleValueChanged() {
    this.valueChanged.emit(this.control?.value ?? this.slideToggleValue ?? false);
  }

  /**
   * @description Обрабатывает клик на ссылку (если isLink = true).
   * Вызывает событие `clickToLink`.
   */
  onClickToLink() {
    if (this.isLink) {
      this.clickToLink.emit();
    }
  }
}
