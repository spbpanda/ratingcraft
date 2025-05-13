import { Component, Input } from '@angular/core';

/**
 * Компонент для отображения разделителя (divider) с возможностью настройки размера.
 *
 * @Component
 * @selector: 'sbi-divider'
 * @standalone: true
 * @templateUrl: './sbi-divider.component.html'
 * @styleUrl: './sbi-divider.component.scss'
 */
@Component({
  selector: 'sbi-divider',
  standalone: true,
  templateUrl: './sbi-divider.component.html',
  styleUrl: './sbi-divider.component.scss',
})
export class SbiDividerComponent {
  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-divider'
   */
  @Input() public testId: string = 'sbi-divider';
}
