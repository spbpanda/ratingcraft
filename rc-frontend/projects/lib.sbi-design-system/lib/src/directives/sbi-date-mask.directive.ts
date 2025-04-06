import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import * as vanillaTextMask from 'vanilla-text-mask-legacy'; // Import the entire module

/**
 * Директива для применения маски ввода даты к текстовым полям.
 *
 * Автоматически форматирует ввод пользователя в формат даты (ДД.ММ.ГГГГ) или
 * даты и времени (ДД.ММ.ГГГГ ЧЧ:ММ:СС) в зависимости от настроек.
 * Использует библиотеку vanilla-text-mask для реализации маски.
 *
 * @Directive
 * @selector: '[sbiMaskDate]'
 * @standalone: true
 */
@Directive({
  selector: '[sbiMaskDate]',
  standalone: true,
})
export class SbiDateMaskDirective implements OnDestroy {
  /**
   * Приватное поле для хранения значения флага отображения времени.
   * @private
   */
  private _showTimePicker = false;

  /**
   * Сеттер для флага отображения времени.
   * При изменении значения пересоздает контроллер маски с новой маской.
   *
   * @param {boolean} value - Флаг отображения времени
   */
  @Input('sbiMaskDate')
  set showTimePicker(value: boolean) {
    this._showTimePicker = value;
    if (this.maskedInputController && this._showTimePicker) {
      this.maskedInputController.destroy();
      this.maskedInputController = (vanillaTextMask as any).maskInput({
        inputElement: this.element.nativeElement,
        mask: this.mask,
      });
    }
  }

  /**
   * Геттер для флага отображения времени.
   *
   * @returns {boolean} - Текущее значение флага отображения времени
   */
  get showTimePicker(): boolean {
    return this._showTimePicker;
  }

  /**
   * Геттер для получения текущей маски в зависимости от флага отображения времени.
   *
   * @returns {Array} - Массив с маской для даты или даты и времени
   */
  public get mask() {
    return this.showTimePicker
      ? [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/]
      : [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
  }

  /**
   * Контроллер маски ввода из библиотеки vanilla-text-mask.
   * @public
   */
  public maskedInputController;

  /**
   * Конструктор с ElementRef для доступа к DOM-элементу.
   * Инициализирует контроллер маски ввода.
   *
   * @param {ElementRef} element - Ссылка на DOM-элемент
   */
  constructor(private element: ElementRef) {
    this.maskedInputController = (vanillaTextMask as any).maskInput({
      inputElement: this.element.nativeElement,
      mask: this.mask,
    });
  }

  /**
   * Метод жизненного цикла, выполняется при уничтожении компонента.
   */
  public ngOnDestroy(): void {
    this.maskedInputController.destroy();
  }
}
