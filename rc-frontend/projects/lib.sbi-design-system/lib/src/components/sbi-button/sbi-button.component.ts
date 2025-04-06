import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

/**
 * Кнопки — это один из ключевых интерактивных элементов интерфейса, которые позволяют пользователям выполнять действия,
 * такие как отправка формы, переход на другую страницу или запуск процесса.
 *
 * Принимает ng-content для отображения контента.
 *
 * @Component
 * @selector: 'sbi-button'
 * @standalone: true
 * @imports: [SbiIconComponent, NgIf, NgClass]
 * @templateUrl: './sbi-button.component.html'
 * @styleUrl: './sbi-button.component.scss',
 * @host: { '[class.disabled]': 'disabled' },
 *  */
@Component({
  selector: 'sbi-button',
  standalone: true,
  imports: [NgClass, MatButtonModule],
  templateUrl: './sbi-button.component.html',
  styleUrl: './sbi-button.component.scss',
  host: {
    '[class.disabled]': 'disabled',
  },
})
export class SbiButtonComponent {

  /**
   * Размер кнопки.
   * @type {'large' | 'small'}
   * */
  @Input() size: 'large' | 'small' = 'large';

  /**
   * Цвет кнопки.
   * @type {'primary' | 'warn' | 'primary-tint' | 'warn-tint' | 'overlay'}
   * */
  @Input() appearance: 'primary' | 'warn' | 'primary-tint' | 'warn-tint' | 'overlay' = 'primary';

  /**
   * Тип кнопки.
   * @type {'button' | 'submit' | 'reset'}
   * */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Если true, кнопка будет отключена..
   * @type {boolean}
   * */
  @Input() disabled: boolean = false;

  /**
   * Id для авто тестов.
   * @type {string}
   * */
  @Input() testId: string = 'sbi-button';
}
