import { Component, Input, TemplateRef } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { SbiTextListComponent } from '../sbi-text-list/sbi-text-list.component';
import { SbiBadgeComponent } from '../sbi-badge/sbi-badge.component';
import { SbiQuestionInfoComponent } from '../sbi-question-info/sbi-question-info.component';
import { SbiTextListElement } from '../sbi-text-list/sbi-text-list.models';
import { SbiBadgeSize, SbiBadgeType } from '../sbi-badge/sbi-badge.models';

/**
 * Компонент тарифной карточки. Отображает информацию о тарифе, включая заголовок,
 * цену, период, список характеристик и бейдж.
 *
 * Принимает ng-content для отображения дополнительного контента.
 *
 * @Component
 * @selector: 'sbi-tariff-card'
 * @standalone: true
 * @imports: [
 *   NgIf,
 *   NgClass,
 *   SbiIconComponent,
 *   SbiTooltipDirective,
 *   SbiTextListComponent,
 *   SbiBadgeComponent,
 *   NgTemplateOutlet,
 *   SbiQuestionInfoComponent
 * ]
 * @templateUrl: './sbi-tariff-card.component.html'
 * @styleUrl: './sbi-tariff-card.component.scss'
 */
@Component({
  selector: 'sbi-tariff-card',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    SbiTextListComponent,
    SbiBadgeComponent,
    SbiQuestionInfoComponent
  ],
  templateUrl: './sbi-tariff-card.component.html',
  styleUrl: './sbi-tariff-card.component.scss'
})
export class SbiTariffCardComponent {
  /**
   * @public
   * @description Заголовок тарифной карточки.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public title: string = '';

  /**
   * @public
   * @description Цена тарифа.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public price: string = '';

  /**
   * @public
   * @description Период тарифа (например, "/ в месяц", "/ в год").
   * @type {string}
   * @defaultValue ''
   */
  @Input() public period: string = '';

  /**
   * @public
   * @description Список элементов для отображения в тарифе.
   * @type {Array<SbiTextListElement>}
   * @defaultValue []
   */
  @Input() public list: Array<SbiTextListElement> = [];

  /**
   * @public
   * @description Текст для отображения в бейдже.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public badgeContent: string = '';

  /**
   * @public
   * @description Тип отображаемого бейджа.
   * @type {SbiBadgeType}
   * @defaultValue 'accent'
   */
  @Input() public badgeType: SbiBadgeType = 'accent';

  /**
   * @public
   * @description Размер отображаемого бейджа.
   * @type {SbiBadgeSize}
   * @defaultValue 'small'
   */
  @Input() public badgeSize: SbiBadgeSize = 'small';

  /**
   * @public
   * @description Наполнение tooltip-а.
   * @type {string | TemplateRef<any> | null}
   * @defaultValue null
   */
  @Input() public tooltipContent: string | TemplateRef<any> | null = null;

  /**
   * @public
   * @description Расположение отображаемого tooltip.
   * @type {'top' | 'bottom' | 'left' | 'right'}
   * @defaultValue 'bottom'
   */
  @Input() public tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  /**
   * @public
   * @description Тип тарифной карточки.
   * @type {'simple' | 'premium'}
   * @defaultValue 'simple'
   */
  @Input() public type: 'simple' | 'premium' = 'simple';

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-tariff-card-test-id'
   */
  @Input() public testId: string = 'sbi-tariff-card-test-id';
}
