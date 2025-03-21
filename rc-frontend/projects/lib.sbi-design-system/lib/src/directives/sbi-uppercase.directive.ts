import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Директива для автоматического преобразования ввода в верхний регистр.
 * 
 * Применяется к элементам input/textarea и автоматически конвертирует 
 * вводимый текст в верхний регистр. Можно включать/отключать с помощью 
 * свойства inputUppercaseActive.
 *
 * @Directive
 * @selector: '[sbiInputUppercase]'
 * @standalone: true
 */
@Directive({
  selector: '[sbiInputUppercase]',
  standalone: true
})
export class SbiUppercaseDirective {
  /**
   * Флаг, указывающий активна ли конвертация в верхний регистр.
   * @type {boolean}
   */
  @Input() inputUppercaseActive = true;

  /**
   * Конструктор с NgControl для управления значением поля ввода.
   * 
   * @param {NgControl} control - Контрол формы для управления значением
   */
  constructor(private readonly control: NgControl) {}

  /**
   * Обработчик события ввода, конвертирует текст в верхний регистр.
   * Сохраняет позицию курсора после преобразования.
   * 
   * @param {HTMLInputElement} input - Элемент ввода
   */
  @HostListener('input', ['$event.target'])
  public onInput(input: HTMLInputElement): void {
    if (this.inputUppercaseActive) {
      const caretPos = input.selectionStart;
      this.control.control?.setValue(input.value.toUpperCase());
      input.setSelectionRange(caretPos, caretPos);
    }
  }
}
