import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgClass } from '@angular/common';

export type AccordionStyle = 'transparent' | 'background';

/**
 * Компонент аккордеона, который позволяет отображать скрытый контент при нажатии на заголовок.
 * Поддерживает два стиля: 'transparent' и 'background'.
 *
 * Селектор компонента: `sbi-accordion`
 *
 * Принимает ng-content для отображения контента.
 *
 * Пример использования:
 * <sbi-accordion
 *   [title]="'Заголовок'"
 *   [description]="'Описание'"
 *   [icon]="'icon-path'"
 *   [testId]="'sbi-accordion'"
 *   [type]="'background'">
 * </sbi-accordion>
 */
@Component({
  selector: 'sbi-accordion',
  standalone: true,
  imports: [
    MatExpansionModule,
    NgClass
  ],
  templateUrl: './sbi-accordion.component.html',
  styleUrl: './sbi-accordion.component.scss'
})
export class SbiAccordionComponent {
  /**
   * Заголовок аккордеона. Отображается в видимой части компонента.
   * По умолчанию: пустая строка.
   */
  @Input() title: string = '';

  /**
   * Начальное состояние аккордеона.
   */
  @Input() expanded: boolean = false;

  /**
   * Описание аккордеона. Может использоваться для дополнительной информации.
   * По умолчанию: пустая строка.
   */
  @Input() description: string = '';

  /**
   * Уникальный идентификатор для тестирования компонента.
   * По умолчанию: 'sbi-accordion'.
   */
  @Input() testId: string = 'sbi-accordion';

  /**
   * Тип стиля аккордеона. Поддерживает два значения:
   * - 'transparent': аккордеон с прозрачным фоном.
   * - 'background': аккордеон с фоновым цветом.
   * По умолчанию: 'transparent'.
   */
  @Input() type: AccordionStyle = 'transparent';
}
