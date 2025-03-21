import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Удаляет лишние пробелы из строки, оставляя только один пробел между словами.
 * 
 * @param {string} value - Исходная строка
 * @returns {string} - Строка без лишних пробелов
 */
function removeSpaces(value: string): string {
  const charList = value.split(' ');
  return charList.filter((char, idx) => !!char || idx === charList.length - 1).join(' ');
}

/**
 * Директива для автоматического преобразования первых букв всех слов в верхний регистр.
 * 
 * Применяется к элементам input/textarea и автоматически конвертирует 
 * первую букву каждого слова в верхний регистр (Title Case). Полезно для полей с полными именами,
 * адресами и т.д. Можно включать/отключать с помощью свойства inputMultiUppercaseActive.
 *
 * @Directive
 * @selector: '[sbiMultiUppercase]'
 * @standalone: true
 */
@Directive({
  selector: '[sbiMultiUppercase]',
  standalone: true,
})
export class SbiMultiUppercaseDirective {
  /**
   * Флаг, указывающий активна ли конвертация первых букв слов в верхний регистр.
   * @type {boolean}
   */
  @Input() inputMultiUppercaseActive = true;

  /**
   * Конструктор с ElementRef и NgControl для управления значением поля ввода.
   * 
   * @param {ElementRef} ref - Ссылка на DOM-элемент
   * @param {NgControl} control - Контрол формы для управления значением
   */
  constructor(public ref: ElementRef, private readonly control: NgControl) {}

  /**
   * Обработчик события ввода, преобразует первую букву каждого слова в верхний регистр.
   * Срабатывает при каждом изменении значения поля.
   * 
   * @param {KeyboardEvent} event - Событие ввода
   */
  @HostListener('input', ['$event'])
  titleCaseTransform(event: KeyboardEvent): void {
    if (this.ref.nativeElement.value && this.inputMultiUppercaseActive) {
      const value: string = this.ref.nativeElement.value;
      const words: string[] = removeSpaces(value).split(' ');
      const newValue = words.map(word => `${word ? word[0].toUpperCase() : word}${word.slice(1)}`).join(' ');
      this.control.control?.setValue(newValue, { emitEvent: false });
    }
  }
}
