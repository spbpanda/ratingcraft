import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgClass } from '@angular/common';
import { SbiAccordionStyle } from './sbi-accordion.models';


/**
 * Компонент аккордеона, который позволяет отображать скрытый контент при нажатии на заголовок.
 * Поддерживает два стиля: 'transparent' и 'background'.
 *
 * Принимает ng-content для отображения контента.
 *
 * @Component
 * @selector: 'sbi-accordion',
 * @standalone: true,
 * @imports: [MatExpansionModule, NgClass],
 * @templateUrl: './sbi-component-with-autocomplete.component.html',
 * @styleUrl: './sbi-component-with-autocomplete.component.scss'
 */
@Component({
  selector: 'sbi-accordion',
  standalone: true,
  imports: [MatExpansionModule, NgClass],
  templateUrl: './sbi-accordion.component.html',
  styleUrl: './sbi-accordion.component.scss'
})
export class SbiAccordionComponent {
  /**
   * @public
   * @description Заголовок аккордеона. Отображается в видимой части компонента.
   * @defaultValue ''
   */
  @Input() public title: string = '';

  /**
   * @public
   * @description Начальное состояние аккордеона.
   * @defaultValue false
   */
  @Input() public expanded: boolean = false;

  /**
   * @public
   * @description Описание аккордеона. Может использоваться для дополнительной информации.
   * @defaultValue ''
   */
  @Input() public description: string = '';

  /**
   * @public
   * @description Уникальный идентификатор для тестирования компонента.
   * @defaultValue 'sbi-accordion'
   */
  @Input() public testId: string = 'sbi-accordion';

  /**
   * @public
   * @description Тип стиля аккордеона. Поддерживает два значения:
   * - 'transparent': аккордеон с прозрачным фоном.
   * - 'background': аккордеон с фоновым цветом.
   * @defaultValue 'transparent'
   */
  @Input() public type: SbiAccordionStyle = 'transparent';
}
