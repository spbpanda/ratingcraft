import { Component, inject, OnDestroy } from '@angular/core';
import { SbiSwipeService } from '../services/sbi-swipe-service';
import { DateTime } from 'luxon';

const windowSizes = {
  mobile: 550,
  tablet: 1150,
}

@Component({
  template: '',
})
export abstract class SbiSwipeComponent implements OnDestroy {
  protected modalFormId = DateTime.now().toString();
  protected swipeService = inject(SbiSwipeService);

  public static disableDocumentScroll(document: Document) {
    document.documentElement.style.overscrollBehavior = 'contain';
    document.documentElement.style.overflowY = 'hidden';
  }

  public static enableDocumentScroll(document: Document) {
    document.documentElement.style.overscrollBehavior = '';
    document.documentElement.style.overflowY = '';
  }

  public static disableSwipeComponentScroll(document: Document) {
    SbiSwipeComponent.disableDocumentScroll(document);
    document.querySelector('.hide-background')?.setAttribute('style', 'display: hidden');
  }

  public static enableSwipeComponentScroll(document: Document, active: boolean) {
    if (active) {
      SbiSwipeComponent.enableDocumentScroll(document);
    }
    document.querySelector('.hide-background')?.setAttribute('style', 'display: block');
  }

  /**
   * @deprecated
   * Переработать функцию оценки устройства
   * */
  public static isMobile(window: Window) {
    return window.innerWidth <= windowSizes.mobile;
  }

  /**
   * @deprecated
   * Переработать функцию оценки устройства
   * */
  public static isTablet(window: Window) {
    return window.innerWidth <= windowSizes.tablet && window.innerWidth > windowSizes.mobile;
  }

  /**
   * @deprecated
   * Переработать функцию оценки устройства
   * */
  public static isDesktop(window: Window) {
    return window.innerWidth > windowSizes.tablet;
  }

  constructor() {
    this.swipeService.addPopUpModalName(this.modalFormId);
    SbiSwipeComponent.isMobile(window) && SbiSwipeComponent.disableSwipeComponentScroll(document);
  }

  ngOnDestroy() {
    this.swipeService.removePopUpModalName();
    SbiSwipeComponent.isMobile(window) && SbiSwipeComponent.enableSwipeComponentScroll(document, !this.swipeService.activePupUpsCount());
  }
}
