import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InputMode } from '../models/input.types';

/**
 * Директива для установки атрибута inputMode для элементов ввода.
 *
 * Позволяет задать режим ввода для мобильных устройств, что влияет на тип
 * отображаемой клавиатуры. Например, для числовых полей можно установить
 * режим 'numeric', чтобы отображалась цифровая клавиатура.
 *
 * @Directive
 * @selector: '[sbiInputMode]'
 * @standalone: true
 */
@Directive({
  selector: '[sbiInputMode]',
  standalone: true
})
export class SbiInputModeDirective implements OnChanges, AfterViewInit {
  /**
   * Режим ввода для элемента.
   * Возможные значения: 'none', 'text', 'tel', 'url', 'email', 'numeric', 'decimal', 'search'.
   * @type {InputMode}
   */
  @Input() inputMode: InputMode = 'text';

  /**
   * Конструктор с ElementRef для доступа к DOM-элементу.
   *
   * @param {ElementRef} element - Ссылка на DOM-элемент
   */
  constructor(private element: ElementRef) {
  }

  /**
   * Метод жизненного цикла, выполняется после инициализации представления.
   * Устанавливает атрибут inputMode для элемента ввода.
   */
  ngAfterViewInit() {
    this.element.nativeElement.setAttribute('inputMode', this.inputMode);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputMode']) {
      this.element.nativeElement.setAttribute('inputMode', changes['inputMode'].currentValue ?? 'text');
    }
  }
}
