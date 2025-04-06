import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SideBarMainElement } from '../../models/side-bar-model';
import { SbiTooltipDirective } from '../sbi-tooltip/sbi-tooltip.directive';
import { SbiDynamicPipe } from '../../pipes/sbi-dynamic.pipe';
import { SbiDividerComponent } from '../sbi-divider/sbi-divider.component';
import { SbiSwipeComponent } from '../../classes/sbi-swipe-component';

/**
 * Компонент, предоставляющий вёрстку для отображения информации по полису, заявке, договору и т.д.
 * Как правило отображается справа от основной формы и является справочной информацией, полученной с предыдущих шагов.
 *
 * Принимает несколько видов ng-content:
 * 1. main-info - контейнер с основной информацией, может выводится вместо заданного контейнера в компоненте:
 * 2. after-docs-and-promo-info - контейнер с информацией, выводится после документов и промокода.
 *
 * @Component
 * @selector: 'sbi-sidebar'
 * @standalone: true
 * @imports: [NgIf, NgForOf, SbiTooltipDirective, SbiDynamicPipe, SbiDividerComponent, NgClass],
 * @templateUrl: './sbi-sidebar.component.html'
 * @styleUrls: ['./sbi-sidebar.component.scss']
 */
@Component({
  selector: 'sbi-sidebar',
  templateUrl: './sbi-sidebar.component.html',
  styleUrls: ['./sbi-sidebar.component.scss'],
  standalone: true,
  imports: [NgIf, NgForOf, SbiTooltipDirective, SbiDynamicPipe, SbiDividerComponent, NgClass],
})
export class SbiSidebarComponent {
  /**
   * Заголовок блока суммы.
   *
   * @type {string}
   */
  @Input() priceLabel: string = 'Укажите первичные данные, чтобы узнать стоимость полиса';

  /**
   * Текст кнопки промокода.
   *
   * @type {string}
   */
  @Input() promoLabel: string = 'У меня есть промокод';

  /**
   * Текст кнопки документов.
   *
   * @type {string}
   */
  @Input() docsLabel: string = 'Документы';

  /**
   * Флаг, обозначающий отображение кнопки промокода.
   *
   * @type {boolean}
   */
  @Input() showPromo: boolean = true;

  /**
   * Флаг, обозначающий отображение кнопки документов.
   *
   * @type {boolean}
   */
  @Input() showDocs: boolean = true;

  /**
   * Флаг, обозначающий отображение скидки.
   *
   * @type {boolean}
   */
  @Input() showDiscount: boolean = false;

  /**
   * Список отображаемой информации по полису.
   *
   * @type {Array<SideBarMainElement>}
   */
  @Input() mainElements: Array<SideBarMainElement> = [];

  /**
   * Стоимость\цена\сумма со скидкой (если скидка есть), если скидки нет, то просто отображаемая сумма.
   *
   * @type {string | number}
   */
  @Input() price: string | number = 0;

  /**
   * Стоимость\цена\сумма со скидкой (если скидка есть), если скидки нет, то просто отображаемая сумма.
   *
   * @type {string | number}
   */
  @Input() fullPrice: string | number = 0;

  /**
   * Событие нажатия на элемент промокода.
   *
   * @type {EventEmitter<Event>}
   */
  @Output() promoClickEvent: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * Событие нажатия на элемент документов.
   *
   * @type {EventEmitter<Event>}
   */
  @Output() docsClickEvent: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * Определяет является ли текущее устройство мобильным телефоном.
   *
   * @returns {boolean}
   */
  public get isDesktop(): boolean {
    return SbiSwipeComponent.isDesktop(window);
  }

  /**
   * Обрабатывает нажатие на промокод.
   *
   * @param {Event} event - событие нажатия.
   */
  public onPromoClick(event: Event) {
    this.promoClickEvent.emit(event);
  }

  /**
   * Обрабатывает нажатие на документы.
   *
   * @param {Event} event - событие нажатия.
   */
  public onDocsClick(event: Event) {
    this.docsClickEvent.emit(event);
  }

  /**
   * Определяет нужно ли выводить информацию списком или единичным элементом.
   *
   * @param {unknown} element - текст\список текстов информации по полису.
   * @returns {boolean}
   */
  public isStringType(element: unknown): boolean {
    return typeof element === 'string';
  }

  /**
   * Преобразует информацию в список, для отображения нескольких элементов.
   *
   * @param {string | string[]} notes - текст\список текстов информации по полису.
   * @returns {string[]}
   */
  public getNoteList(notes: string | string[]): string[] {
    return typeof notes === 'string' ? [] : notes;
  }
}
