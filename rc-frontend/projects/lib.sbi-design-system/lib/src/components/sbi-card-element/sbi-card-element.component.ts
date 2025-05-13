import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SbiCardElementInfoItem } from './sbi-card-element.models';
import { SbiBadgeType } from '../sbi-badge/sbi-badge.models';
import { SbiBadgeComponent } from '../sbi-badge/sbi-badge.component';
import { SbiQuestionInfoComponent } from '../sbi-question-info/sbi-question-info.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { BUTTON_ARROWS_DOWN, BUTTON_ARROWS_UP } from '../../const/icons';
import { SbiDynamicPipe } from '../../pipes/sbi-dynamic.pipe';
import { SbiTooltipContent, SbiTooltipPosition } from "../sbi-tooltip/sbi-tooltip.models";

/**
 * Компонент - блок для более удобного формирования формы и облегчения вёрстки.
 *
 * Принимает ng-content и отображает его под блоком заголовка и примечания
 *
 * @Component
 * @selector: 'sbi-card-element'
 * @templateUrl: './sbi-card-element.component.html'
 * @styleUrls: [./sbi-card-element.component.scss]
 * @imports: [NgIf, SbiBadgeComponent, SbiQuestionInfoComponent, NgForOf, NgClass, SbiIconComponent, SbiDynamicPipe]
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
   * @public
   * @description Заголовок блока.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public title: string = '';

  /**
   * @public
   * @description Примечание блока.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public note: string = '';

  /**
   * @public
   * @description Возможность скрыть\показать контент.
   * @type {isExpanded}
   * @defaultValue false
   */
  @Input() public isExpanded: boolean = false;

  /**
   * @public
   * @description Контент badge-а.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public badgeContent?: string;

  /**
   * @public
   * @description Тип badge-а.
   * @type {'neutral' | 'tint' | 'accent'}
   * @defaultValue 'tint'
   */
  @Input() public badgeType: SbiBadgeType = 'tint';

  /**
   * @public
   * @description Список выводимых элементов.
   * @type {Array<SbiCardElementInfoItem>}
   * @defaultValue []
   */
  @Input() public infoItems: Array<SbiCardElementInfoItem> = [];

  /**
   * @public
   * @description Текст ссылки в правой части.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public linkTitle?: string;

  /**
   * @public
   * @description Контент всплывающей подсказки.
   * @type {string | TemplateRef<any> | null}
   * @defaultValue null
   */
  @Input() public tooltipContent: SbiTooltipContent = null;

  /**
   * @public
   * @description Положение всплывающей подсказки.
   * @type {'top' | 'bottom' | 'left' | 'right'}
   * @defaultValue 'bottom'
   */
  @Input() public tooltipPosition: SbiTooltipPosition = 'bottom';

  /**
   * @public
   * @description Размер отступа между заголовком и контентом.
   * @type {number}
   * @defaultValue 20
   */
  @Input() public gap: number = 20;

  /**
   * @public
   * @description Поменять местами заголовок и примечание в infoItems.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public invertItemsContent: boolean = false;

  /**
   * @public
   * @description Показывается ли блок контента по умолчанию.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public expand: boolean = true;

  /**
   * @public
   * @description Идентификатор для авто тестов.
   * @type {string}
   * @defaultValue 'sbi-card-element'
   */
  @Input() public testId: string = 'sbi-card-element';

  /**
   * @public
   * @description Событие нажатия на ссылку.
   * @type {EventEmitter<void>}
   */
  @Output() public linkClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @public
   * @getter
   * @description В зависимости от состояния expand возвращает иконку шеврона.
   * @return {string}
   */
  public get arrowIcon(): string {
    return this.expand ? BUTTON_ARROWS_UP : BUTTON_ARROWS_DOWN;
  }

  /**
   * @public
   * @description Обрабатывает событие нажатия на ссылку в правой части компонента.
   */
  public onLinkClick() {
    this.linkClick.emit();
  }
}
