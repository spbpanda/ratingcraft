import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { SbiResizableDirective } from '../../directives/sbi-resize.directive';
import { NgIf } from '@angular/common';
import { SbiSwipeComponent } from '../../classes/sbi-swipe-component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { BUTTON_CROSS } from '../../const/icons';

/**
 * Компонент - обёртка для "шторки".
 *
 * Позволяет выводить информацию снизу экрана
 *
 * Принимает ng-content для отображения контента.
 *
 * @Component
 * @selector: 'sbi-mobile-curtain'
 * @standalone: true
 * @imports: [SbiResizableDirective, NgIf, SbiIconComponent]
 * @templateUrl: 'sbi-mobile-curtain.component.html'
 * @styleUrls: ['sbi-mobile-curtain.component.scss']
 */
@Component({
  selector: 'sbi-mobile-curtain',
  templateUrl: 'sbi-mobile-curtain.component.html',
  styleUrls: ['sbi-mobile-curtain.component.scss'],
  standalone: true,
  imports: [SbiResizableDirective, NgIf, SbiIconComponent],
})
export class SbiMobileCurtainComponent implements AfterViewInit, OnDestroy {

  /**
   * Экземпляр контейнера шторки.
   * @type {ElementRef<HTMLDivElement>} экземпляр контейнера шторки.
   */
  @ViewChild('sbiCurtainContainer') private curtainContainer!: ElementRef<HTMLDivElement>;

  /**
   * Экземпляр контента шторки.
   * @type {ElementRef<HTMLDivElement>} экземпляр контента шторки.
   */
  @ViewChild('sbiCurtainContent') private sbiCurtainContent!: ElementRef<HTMLDivElement>;

  /**
   * Экземпляр фона шторки.
   * @type {ElementRef<HTMLDivElement>} Экземпляр фона шторки.
   */
  @ViewChild('sbiCurtainHideBackground') private sbiCurtainHideBackground!: ElementRef<HTMLDivElement>;

  /**
   * Состояние шторки (открыта\закрыта).
   * @type {boolean} состояние шторки (открыта - true\закрыта - false).
   */
  private _open: boolean = false;

  /**
   * Возвращает SVG иконку для закрытия модального окна.
   * @returns {string} SVG строка иконки закрытия модального окна.
   */
  public get closeIcon(): string {
    return BUTTON_CROSS;
  }

  /**
   * Базовый размер шторки в закрытом состоянии.
   * @type {number} размер шторки в закрытом состоянии в пикселях.
   */
  @Input() baseSize: number = 0;

  /**
   * Активна ли шторка для свайпа.
   * @type {boolean} флаг, активности шторки для свайпа.
   */
  @Input() activeForOpen: boolean = false;

  /**
   * Максимальный размер шторки.
   * @type {number} максимальный размер шторки в открытом состоянии.
   */
  @Input() maxHeight: number = 700;

  /**
   * Количество пикселей, необходимое для изменения состояния шторки.
   * @type {number | undefined} на сколько нужно открыть\закрыть шторку (в пикселях) чтобы она изменила состояние открыт\закрыт.
   */
  @Input() openCloseDelta?: number;

  /**
   * Флаг отображения иконки закрытия шторки.
   * @type {boolean} отображать ли иконку закрытия (крестик) шторки.
   */
  @Input() showCloseIcon: boolean = true;

  /**
   * Идентификатор для авто тестов.
   * @type {string} идентификатор для авто тестов.
   */
  @Input() testId: string = 'sbi-mobile-curtain';

  /**
   * Событие открытия\закрытия шторки.
   * @type {EventEmitter<boolean>} изменение состояния открытия\закрытия шторки.
   */
  @Output() openEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Получение состояния шторки.
   * @returns {boolean} открыта шторка или закрыта.
   */
  public get open(): boolean {
    return this._open;
  }

  /**
   * Получение максимальной высоты шторки.
   * @returns {number} максимальная высота шторки в пикелях.
   */
  public get contentHeight(): number {
    return Math.min(this.sbiCurtainContent?.nativeElement?.getBoundingClientRect()?.height ?? 99999, this.maxHeight) ?? 0;
  }

  /**
   * Изменение состояния шторки.
   * @param {boolean} open - новое состояние шторки
   */
  public set open(open: boolean) {
    if (open) {
      SbiSwipeComponent.disableDocumentScroll(document);
    } else {
      SbiSwipeComponent.enableDocumentScroll(document);
    }
    this._open = open;
  }

  ngAfterViewInit(): void {
    this.insertCurtainInToBody();
  }

  /**
   * Функция удаления шторки ид текущего положения в DOM и встраивания её в body
   */
  private insertCurtainInToBody() {
    if (this.sbiCurtainHideBackground && SbiSwipeComponent.isMobile(window)) {
      this.insertInToBody(this.sbiCurtainHideBackground.nativeElement);
    }
    if (this.curtainContainer && SbiSwipeComponent.isMobile(window)) {
      this.insertInToBody(this.curtainContainer.nativeElement);
    }
  }

  /**
   * Функция встраивания шторки в body
   */
  private insertInToBody(elem: HTMLElement) {
    elem.remove();
    document.body.appendChild(elem);
  }

  /**
   * Функция обрабатывающая изменение состояния шторки
   * @param {boolean} val - новое значение состояния шторки
   */
  public openOrClose(val: boolean) {
    this.open = val;
    this.openEvent.emit(this._open);
  }

  ngOnDestroy() {
    this.curtainContainer.nativeElement?.remove();
  }
}
