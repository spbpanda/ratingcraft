import {Component, Input} from '@angular/core';

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
  imports: [],
  templateUrl: './sbi-divider.component.html',
  styleUrl: './sbi-divider.component.scss',
})
export class SbiDividerComponent {
  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId: string = 'sbi-divider';
}
