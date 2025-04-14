import { Component, Input } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SbiBadgeComponent } from '../sbi-badge/sbi-badge.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiTextList } from '../../models/sbi-text-list.model';


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
   * Список отображаемых элементов.
   * @type {Array<SbiTextList>}
   */
  @Input() list: Array<SbiTextList> = [];

  /**
   * Выравнять ли элементы (badge и icon) поверху.
   * @type {boolean}
   */
  @Input() leftContentInTop: boolean = false;

  /**
   * Идентификатор для авто тестов.
   * @type {string}
   */
  @Input() testId: string = 'sbi-text-list';
}
