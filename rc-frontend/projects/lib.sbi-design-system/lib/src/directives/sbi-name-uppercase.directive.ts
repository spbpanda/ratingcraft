import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Директива для автоматического преобразования первой буквы имени в верхний регистр.
 * 
 * Применяется к элементам input/textarea и автоматически конвертирует 
 * первую букву вводимого текста в верхний регистр. Полезно для полей с именами,
 * фамилиями и т.д. Можно включать/отключать с помощью свойства inputNameUppercaseActive.
 *
 * @Directive
 * @selector: '[sbiNameUppercase]'
 * @standalone: true
 */
@Directive({
  selector: '[sbiNameUppercase]',
  standalone: true,
})
export class SbiNameUppercaseDirective {
  /**
   * Флаг, указывающий активна ли конвертация первой буквы в верхний регистр.
   * @type {boolean}
   */
  @Input() inputNameUppercaseActive = true;
  
  /**
   * Конструктор с ElementRef и NgControl для управления значением поля ввода.
   * 
   * @param {ElementRef} ref - Ссылка на DOM-элемент
   * @param {NgControl} control - Контрол формы для управления значением
   */
  constructor(public ref: ElementRef, private readonly control: NgControl) {}

  /**
   * Обработчик события ввода, преобразует первую букву текста в верхний регистр.
   * Срабатывает при каждом изменении значения поля.
   * 
   * @param {KeyboardEvent} event - Событие ввода
   */
  @HostListener('input', ['$event'])
  titleCaseTransform(event: KeyboardEvent): void {
    if (this.ref.nativeElement.value && this.inputNameUppercaseActive) {
      const arr: string[] = this.ref.nativeElement.value.split('');
      arr[0] = arr[0].toUpperCase();
      this.control.control?.setValue(arr.join(''), { emitEvent: false });
   }
  }
}
