import { Component, inject, OnDestroy } from '@angular/core';
import { SbiSwipeService } from '../services/sbi-swipe-service';
import { DateTime } from 'luxon';

/**
 * Список констант размеров экранов.
 */
const windowSizes = {
  mobile: 550,
  tablet: 1150,
}

/**
 * Абстрактный класс, предоставляющий интерфейс для компонентов модальных окон, которые имеют возможность свайпа вниз для закрытия.
 *
 * @abstract
 * @Component
 *
 * @template: ``
 * */
@Component({
  template: '',
})
export abstract class SbiSwipeComponent implements OnDestroy {
  /**
   * @protected
   * @description Идентификатор модального окна.
   * @type {string}
   * @defaultValue DateTime.now().toString()
   */
  protected modalFormId: string = DateTime.now().toString();

  /**
   * @protected
   * @readonly
   * @description Экземпляр сервиса, отвечающего за хранение всех открытых модальных окон.
   * @type {SbiSwipeService}
   */
  protected readonly swipeService: SbiSwipeService = inject(SbiSwipeService);

  /**
   * @public
   * @static
   * @description Блокирует скролл всего окна.
   * @param {Document} document
   */
  public static disableDocumentScroll(document: Document) {
    document.documentElement.style.overscrollBehavior = 'contain';
    document.documentElement.style.overflowY = 'hidden';
  }

  /**
   * @public
   * @static
   * @description Разблокирует скролл всего окна.
   * @param {Document} document
   */
  public static enableDocumentScroll(document: Document) {
    document.documentElement.style.overscrollBehavior = '';
    document.documentElement.style.overflowY = '';
  }

  /**
   * @public
   * @static
   * @description Скрывает затемнённый фон модального окна или шторки.
   * @param {Document} document
   */
  public static disableSwipeComponentScroll(document: Document) {
    SbiSwipeComponent.disableDocumentScroll(document);
    document.querySelector('.hide-background')?.setAttribute('style', 'display: hidden');
  }

  /**
   * @public
   * @static
   * @description Показывает затемнённый фон модального окна или шторки.
   * @param {Document} document
   * @param {boolean} active флаг, обозначающий что данное модальное окно активно для свайпа.
   */
  public static enableSwipeComponentScroll(document: Document, active: boolean) {
    if (active) {
      SbiSwipeComponent.enableDocumentScroll(document);
    }
    document.querySelector('.hide-background')?.setAttribute('style', 'display: block');
  }

  /**
   * @public
   * @deprecated Переработать функцию оценки устройства
   * @static
   * @description Определяет является ли текущее устройство мобильным.
   * @param {Window} window
   * @return {boolean}
   * */
  public static isMobile(window: Window): boolean {
    return window.innerWidth <= windowSizes.mobile;
  }

  /**
   * @public
   * @deprecated Переработать функцию оценки устройства
   * @static
   * @description Определяет является ли текущее устройство планшетом.
   * @param {Window} window
   * @return {boolean}
   * */
  public static isTablet(window: Window): boolean {
    return window.innerWidth <= windowSizes.tablet && window.innerWidth > windowSizes.mobile;
  }

  /**
   * @public
   * @deprecated Переработать функцию оценки устройства
   * @static
   * @description Определяет является ли текущее устройство desktop-ом.
   * @param {Window} window
   * @return {boolean}
   * */
  public static isDesktop(window: Window): boolean {
    return window.innerWidth > windowSizes.tablet;
  }

  constructor() {
    // Добавляем модальное окно в список открытых модальных окон
    this.swipeService.addPopUpModalName(this.modalFormId);
    SbiSwipeComponent.isMobile(window) && SbiSwipeComponent.disableSwipeComponentScroll(document);
  }

  ngOnDestroy() {
    // Удаляем модальное окно из списка открытых модальных окон
    this.swipeService.removePopUpModalName();
    SbiSwipeComponent.isMobile(window) && SbiSwipeComponent.enableSwipeComponentScroll(document, !this.swipeService.activePupUpsCount());
  }
}
