import { Component, Input, TemplateRef } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { InfoItem } from '../../models/sbi-card-element.model';
import { BadgeTypes } from '../../models/badge.types';
import { SbiBadgeComponent } from '../sbi-badge/sbi-badge.component';
import { SbiQuestionInfoComponent } from '../sbi-question-info/sbi-question-info.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { BUTTON_ARROWS_DOWN, BUTTON_ARROWS_UP } from '../../const/icons';
import { SbiDynamicPipe } from '../../pipes/sbi-dynamic.pipe';

/**
 * Компонент - блок для более удобного формирования формы и облегчения вёрстки.
 *
 * Принимает ng-content и отображает его под блоком заголовка и примечания
 *
 * @Component
 * @selector: 'sbi-card-element'
 * @templateUrl: './sbi-card-element.component.html'
 * @styleUrls: [./sbi-card-element.component.scss]
 * @imports: [NgIf, SbiBadgeComponent, SbiQuestionInfoComponent, NgForOf, NgClass, SbiIconComponent]
 * @standalone: true
 */
@Component({
  selector: 'sbi-card-element',
  standalone: true,
  imports: [NgIf, SbiBadgeComponent, SbiQuestionInfoComponent, NgForOf, NgClass, SbiIconComponent, SbiDynamicPipe],
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

  /**
   * Возможность скрыть\показать контент.
   * @type {isExpanded}
   */
  @Input() isExpanded: boolean = false;

  /**
   * Контент badge-а.
   * @type {string | undefined}
   */
  @Input() badgeContent?: string;

  /**
   * Тип badge-а.
   * @type {BadgeTypes}
   */
  @Input() badgeType: BadgeTypes = 'tint';

  /**
   * Список выводимых элементов.
   * @type {Array<InfoItem>}
   */
  @Input() infoItems: Array<InfoItem> = [];

  /**
   * Контент всплывающей подсказки.
   * @type {string | TemplateRef<any> | null}
   */
  @Input() tooltipContent: string | TemplateRef<any> | null = null;

  /**
   * Положение всплывающей подсказки.
   * @type {'top' | 'bottom' | 'left' | 'right'}
   */
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  /**
   * Размер отступа между заголовком и контентом.
   * @type {number}
   */
  @Input() gap: number = 20;

  /**
   * Поменять местами заголовок и примечание в infoItems.
   * @type {boolean}
   */
  @Input() invertItemsContent: boolean = false;

  /**
   * Показывается ли блок контента по умолчанию.
   * @type {boolean}
   */
  @Input() expand: boolean = true;

  /**
   * Идентификатор для авто тестов.
   * @type {string}
   */
  @Input() testId: string = 'sbi-card-element';

  public get arrowIcon() {
    return this.expand ? BUTTON_ARROWS_UP : BUTTON_ARROWS_DOWN;
  }
}
