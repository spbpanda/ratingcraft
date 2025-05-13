import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SbiTooltipDirective } from '../sbi-tooltip/sbi-tooltip.directive';
import { SbiDynamicPipe } from '../../pipes/sbi-dynamic.pipe';
import { SbiDividerComponent } from '../sbi-divider/sbi-divider.component';
import { SbiSwipeComponent } from '../../classes/sbi-swipe-component';
import { SbiSidebarMainElement } from '../sbi-sidebar/sbi-sidebar.models';

/**
 * @deprecated - Устаревшая версия компонента, рекомендуется использование SbiSidebarComponent
 *
 * @description Компонент, предоставляющий вёрстку для отображения информации по полису, заявке, договору и т.д.
 * Как правило отображается справа от основной формы и является справочной информацией, полученной с предыдущих шагов.
 *
 * Принимает несколько видов ng-content:
 * 1. main-info - контейнер с основной информацией, может выводится вместо заданного контейнера в компоненте:
 * 2. after-docs-and-promo-info - контейнер с информацией, выводится после документов и промокода.
 *
 * @Component
 * @selector: 'sbi-sidebar-old'
 * @standalone: true
 * @imports: [NgIf, NgForOf, SbiTooltipDirective, SbiDynamicPipe, SbiDividerComponent, NgClass],
 * @templateUrl: './sbi-sidebar-old.component.html'
 * @styleUrls: ['./sbi-sidebar-old.component.scss']
 */
@Component({
  selector: 'sbi-sidebar-old',
  templateUrl: './sbi-sidebar.component.html',
  styleUrls: ['./sbi-sidebar.component.scss'],
  standalone: true,
  imports: [NgIf, NgForOf, SbiTooltipDirective, SbiDynamicPipe, SbiDividerComponent, NgClass],
})
export class SbiSidebarComponentOld {
  /**
   * @public
   * @description Заголовок блока суммы.
   * @type {string}
   * @defaultValue 'Укажите первичные данные, чтобы узнать стоимость полиса'
   */
  @Input() public priceLabel: string = 'Укажите первичные данные, чтобы узнать стоимость полиса';

  /**
   * @public
   * @description Текст кнопки промокода.
   * @type {string}
   * @defaultValue 'У меня есть промокод'
   */
  @Input() public promoLabel: string = 'У меня есть промокод';

  /**
   * @public
   * @description Текст кнопки документов.
   * @type {string}
   * @defaultValue 'Документы'
   */
  @Input() public docsLabel: string = 'Документы';

  /**
   * @public
   * @description Флаг, обозначающий отображение кнопки промокода.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public showPromo: boolean = true;

  /**
   * @public
   * @description Флаг, обозначающий отображение кнопки документов.
   * @type {boolean}
   * @defaultValue
   */
  @Input() public showDocs: boolean = true;

  /**
   * @public
   * @description Флаг, обозначающий отображение скидки.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public showDiscount: boolean = false;

  /**
   * @public
   * @description Стоимость\цена\сумма со скидкой (если скидка есть), если скидки нет, то просто отображаемая сумма.
   * @type {string | number}
   * @defaultValue 0
   */
  @Input() public price: string | number = 0;

  /**
   * @public
   * @description Стоимость\цена\сумма со скидкой (если скидка есть), если скидки нет, то просто отображаемая сумма.
   * @type {string | number}
   * @defaultValue 0
   */
  @Input() public fullPrice: string | number = 0;

  /**
   * @public
   * @description Список отображаемой информации по полису.
   * @type {Array<SbiSidebarMainElement>}
   * @defaultValue []
   */
  @Input() public mainElements: Array<SbiSidebarMainElement> = [];

  /**
   * @public
   * @description Событие нажатия на элемент промокода.
   * @type {EventEmitter<Event>}
   */
  @Output() public promoClickEvent: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * @public
   * @description Событие нажатия на элемент документов.
   * @type {EventEmitter<Event>}
   */
  @Output() public docsClickEvent: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * @public
   * @getter
   * @description Определяет является ли текущее устройство мобильным телефоном.
   * @returns {boolean}
   */
  public get isDesktop(): boolean {
    return SbiSwipeComponent.isDesktop(window);
  }

  /**
   * @public
   * @description Обрабатывает нажатие на промокод.
   * @param {Event} event - событие нажатия.
   */
  public onPromoClick(event: Event) {
    this.promoClickEvent.emit(event);
  }

  /**
   * @public
   * @description Обрабатывает нажатие на документы.
   * @param {Event} event - событие нажатия.
   */
  public onDocsClick(event: Event) {
    this.docsClickEvent.emit(event);
  }

  /**
   * @public
   * @description Определяет нужно ли выводить информацию списком или единичным элементом.
   * @param {unknown} element - текст\список текстов информации по полису.
   * @returns {boolean}
   */
  public isStringType(element: unknown): boolean {
    return typeof element === 'string';
  }

  /**
   * @public
   * @description Преобразует информацию в список, для отображения нескольких элементов.
   * @param {string | string[]} notes - текст\список текстов информации по полису.
   * @returns {string[]}
   */
  public getNoteList(notes: string | string[]): string[] {
    return typeof notes === 'string' ? [] : notes;
  }
}
