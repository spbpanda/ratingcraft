import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

/**
 * Компонент - блок для более удобного формирования формы и облегчения вёрстки.
 *
 * Принимает ng-content и отображает его под блоком заголовка и примечания
 *
 * @Component
 * @selector: 'sbi-card-element'
 * @templateUrl: './sbi-card-element.component.html'
 * @styleUrls: [./sbi-card-element.component.scss]
 * @standalone: true
 */
@Component({
  selector: 'sbi-card-element',
  standalone: true,
  imports: [NgIf],
  templateUrl: './sbi-card-element.component.html',
  styleUrl: './sbi-card-element.component.scss'
})
export class SbiCardElementComponent {

  /**
   * Заголовок блока.
   * @type {string}
   */
  @Input() title: string = '';

  /**
   * Примечание блока.
   * @type {string}
   */
  @Input() note: string = '';
}
