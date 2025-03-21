import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Директива для автоматического преобразования первой буквы ввода в верхний регистр.
 * 
 * Применяется к элементам input/textarea и автоматически конвертирует 
 * первую букву вводимого текста в верхний регистр. Можно включать/отключать с помощью 
 * свойства inputTitleCaseActive.
 *
 * @Directive
 * @selector: '[sbiTitleCase]'
 * @standalone: true
 */
@Directive({
  selector: '[sbiTitleCase]',
  standalone: true
})
export class SbiTitleCaseDirective {
  /**
   * Флаг, указывающий активна ли конвертация первой буквы в верхний регистр.
   * @type {boolean}
   */
  @Input() inputTitleCaseActive = false;
  
  /**
   * Конструктор с NgControl и ElementRef для управления значением поля ввода.
   * 
   * @param {NgControl} ngControl - Контрол формы для управления значением
   * @param {ElementRef} ref - Ссылка на DOM-элемент
   */
  constructor(
    public ngControl: NgControl,
    public ref: ElementRef
  ) {}

  /**
   * Обработчик события нажатия клавиши, преобразует первую букву в верхний регистр.
   * Срабатывает только если поле пустое и нажатая клавиша - кириллическая буква.
   * 
   * @param {KeyboardEvent} event - Событие нажатия клавиши
   */
  @HostListener('keypress', ['$event'])
  titleCaseTransform(event: KeyboardEvent): void {
    if (!this.inputTitleCaseActive) {
      return;
    }
    const inputValue = this.ref.nativeElement.value;
    const key = event.key;
    if (!inputValue.length && key.match('[а-яё]')) {
      event.preventDefault();
      this.ngControl.control?.patchValue(key.toUpperCase());
    }
  }
}
