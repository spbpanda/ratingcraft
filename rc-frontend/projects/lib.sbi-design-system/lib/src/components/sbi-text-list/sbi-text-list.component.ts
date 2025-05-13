import { Component, Input } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SbiBadgeComponent } from '../sbi-badge/sbi-badge.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiTextListElement } from './sbi-text-list.models';


/**
 * Компонент списка
 *
 * Список строковых значений с возможностью вывода перед текстом badge или icon.
 *
 * @Component
 * @selector: 'sbi-text-list'
 * @templateUrl: 'sbi-text-list.component.html'
 * @styleUrls: ['sbi-text-list.component.scss']
 * @standalone: true
 * @imports: [NgForOf, SbiBadgeComponent, NgIf, SbiIconComponent, NgClass]
 */
@Component({
  selector: 'sbi-text-list',
  templateUrl: 'sbi-text-list.component.html',
  styleUrls: ['sbi-text-list.component.scss'],
  standalone: true,
  imports: [NgForOf, SbiBadgeComponent, NgIf, SbiIconComponent, NgClass],
})
export class SbiTextListComponent {
  /**
   * @public
   * @description Список отображаемых элементов.
   * @type {Array<SbiTextListElement>}
   * @defaultValue []
   */
  @Input() public list: Array<SbiTextListElement> = [];

  /**
   * @public
   * @description Выравнять ли элементы (badge и icon) поверху.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public leftContentInTop: boolean = false;

  /**
   * @public
   * @description Класс отвечающий за типографику всех элементов списка.
   * @type {string}
   * @defaultValue 'body-regular'
   */
  @Input() public labelClass: string = 'body-regular';

  /**
   * @public
   * @description Идентификатор для авто тестов.
   * @type {string}
   * @defaultValue 'sbi-text-list'
   */
  @Input() public testId: string = 'sbi-text-list';
}
