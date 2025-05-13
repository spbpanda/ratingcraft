import { Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbiInputMode, SbiInputType } from '../components/sbi-input/sbi-input.models';

/**
 * Абстрактный класс, предоставляющий интерфейс для компонентов с полем ввода.
 *
 * @abstract
 * @Component
 *
 * @template: ``
 * */
@Component({
  template: ``
})
export abstract class SbiComponentWithInput<T> implements OnInit {
  /**
   * @public
   * @description Состояние фокусировки на компоненте.
   * @type {WritableSignal<boolean>}
   * @defaultValue false
   */
  public focused: WritableSignal<boolean> = signal(false);

  /**
   * @public
   * @description Начальное значение компонента (используется, если не планируется передача control-а).
   * @description При Одновременной передаче value и control в ngOnInit произойдёт переопределение control-а.
   * @type {T | undefined}
   * @defaultValue undefined
   */
  @Input() public value?: T;

  /**
   * @public
   * @description Форм контролл.
   * @type {FormControl<Array<T> | string | T | null>}
   */
  @Input() public declare control: FormControl<Array<T> | string | T | null>;

  /**
   * @public
   * @description Состояние фокусировки на компоненте.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public placeholder: string = '';

  /**
   * @public
   * @description Лейблл поля ввода.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public label: string = '';

  /**
   * @public
   * @description Идентификатор для авто тестов.
   * @type {string}
   * @defaultValue 'sbiInput'
   */
  @Input() public testId: string = 'sbiInput';

  /**
   * @public
   * @description Флаг, определяющий доступно поле только для чтения или для чтения и ввода.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public readonly: boolean = false;

  /**
   * @public
   * @description Объект выводимого текста при ошибках валидации поля ввода.
   * @type {Record<string, string> | undefined}
   * @defaultValue undefined
   */
  @Input() public errorMessages?: Record<string, string>;

  /**
   * @public
   * @description Вспомогательный текст, отображаемы под полем ввода (примечание).
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public subtitle?: string;

  /**
   * @public
   * @description Тип поля ввода.
   * @type {'text' | 'number' | 'boolean'}
   * @defaultValue 'text'
   */
  @Input() public type: SbiInputType = 'text';

  /**
   * @public
   * @description Тип клавиатуры, отображаемый на мобильном устройстве.
   * @type {'text' | 'numeric' | 'tel' | 'email'}
   * @defaultValue 'text'
   */
  @Input() public inputMode: SbiInputMode = 'text';

  /**
   * @public
   * @description Флаг, отвечающий за отображение маркера обязательности заполнения поля ввода.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public hideRequiredMarker: boolean = true;

  /**
   * @public
   * @description Флаг авто фокусировки на поле.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public autofocus: boolean = false;

  /**
   * @public
   * @description Событие ввода данных в поле.
   * @type {EventEmitter<Event>}
   */
  @Output() public inputChange: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * @public
   * @description Событие изменения состояния фокусировки на поле ввода.
   * @type {EventEmitter<boolean>}
   */
  @Output() public focus: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @public
   * @description Событие очистки значения в поле ввода (нажатие иконки крестика).
   * @type {EventEmitter<Event>}
   */
  @Output() public clearControl: EventEmitter<Event> = new EventEmitter<Event>();

  ngOnInit(): void {
    if (this.value || this.value === '' || this.value === 0) {
      this.control = new FormControl(this.value);
    }
  }

  /**
   * @public
   * @description Обработка ввода данных в поле.
   * @param {Event} event событие изменения данных в поле ввода.
   */
  public onInputChange(event: Event): void {
    this.inputChange.emit(event);
  }

  /**
   * @public
   * @description Обработка изменения фокусировки на поле ввода.
   * @param {boolean} focus новое состояние фокусировки.
   */
  public onFocusChange(focus: boolean) {
    // Задержка для обработки клика по иконке крестика
    setTimeout(() => this.focused.set(focus), 50);
    this.focus.emit(focus);
  }

  /**
   * @public
   * @description Обработка очистки поля ввода.
   * @param {Event} event событие нажатия на иконку крестика.
   */
  public onClearControl(event: Event) {
    if (!this.control.value || !this.focused() || this.control.disabled) {
      return;
    }
    this.control.setValue(null);
    this.clearControl.emit(event);
  }
}
