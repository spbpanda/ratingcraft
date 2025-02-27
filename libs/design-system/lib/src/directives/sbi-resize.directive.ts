import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { SbiSwipeComponent } from '../classes/sbi-swipe-component';

interface CursorPosition {
  clientY: number;
  clientX: number;
}

function getTouch(evt: TouchEvent | MouseEvent): CursorPosition {
  if (evt instanceof TouchEvent) {
    return evt.touches[0] || evt.changedTouches[0];
  }
  return evt;
}

@Directive({
  selector: '[sbiResizable]',
  standalone: true,
})
export class SbiResizableDirective implements OnChanges, OnDestroy {
  @Input() baseSize = 115;
  @Input() open = false;
  @Input() openCloseDelta = 100;
  @Input() maxHeight = 700;
  @Input() activeForOpen = false;
  @Input() draggingElementIds = ['drag-line', 'drag'];
  @Input() dragTargetClassName = 'mobile-curtain';

  @Output() opened = new EventEmitter<boolean>();

  dragging = false;
  defaultTouchY = 0;
  startMaxHeight = 0;

  restoreGlobalMouseEvents() {
    document.body.style.pointerEvents = 'auto';
  }

  newHeight(height: number, minHeightIsFitContent: boolean = false) {
    this.el.nativeElement.style.maxHeight = height + 'px';
    if (minHeightIsFitContent) {
      this.el.nativeElement.style.minHeight = 'fit-content';
    } else {
      this.el.nativeElement.style.minHeight = height + 'px';
    }
  }

  mouseMoveG(evt: TouchEvent | MouseEvent) {
    if (!this.dragging || !this.activeForOpen) {
      return;
    }
    evt.preventDefault();

    const touch = getTouch(evt);

    const move = Math.round(touch.clientY - this.defaultTouchY);
    const movedDelta = this.startMaxHeight - move;
    const needChangeHeight = (!this.open && move < 0) || (this.open && move > 0);

    // Изменяем высоту элемента при движении мышки
    if (movedDelta > this.baseSize && movedDelta < this.maxHeight && needChangeHeight) {
      this.newHeight(movedDelta);
    }

    // Возвращаем максимальную высоту при открытом элементе
    if (this.open && movedDelta >= this.startMaxHeight) {
      this.newHeight(this.startMaxHeight);
    }

    // Возвращаем базовое значение высоту при свёрнутом элементе
    if (movedDelta <= this.baseSize) {
      this.newHeight(this.baseSize);
    }

    evt.stopPropagation();
  }

  mouseUpG(evt: TouchEvent | MouseEvent) {
    if (!this.dragging || !this.activeForOpen) {
      return;
    }
    const touch = getTouch(evt);

    const delta = this.defaultTouchY - touch.clientY;
    const needToChangeOpenState = this.openCloseDelta < Math.abs(delta);
    if (!this.open && needToChangeOpenState && delta > 0) {
      this.openElement();
    } else if (this.open && needToChangeOpenState && delta < 0) {
      this.closeElement();
    } else {
      this.newHeight(this.startMaxHeight);
    }

    this.setDefaultParamsForDragging();
    evt.stopPropagation();
    if (!this.open) {
      SbiSwipeComponent.enableDocumentScroll(document);
    }
  }

  private openElement() {
    this.newHeight(Math.round(window.innerHeight), true);
    this.open = true;
    this.opened.emit(true);
  }

  private closeElement() {
    this.newHeight(this.baseSize);
    this.open = false;
    this.opened.emit(false);
  }

  mouseDown(evt: TouchEvent | MouseEvent) {
    if (!this.activeForOpen) {
      return;
    }
    this.inDragRegion(evt);
    const touch = getTouch(evt);
    const offset = Number(this.el.nativeElement.offsetHeight ?? 0);
    const startMaxHeight = offset > window.innerHeight * 0.9 ? Math.floor(window.innerHeight * 0.9) : offset;
    this.startMaxHeight = this.open ? startMaxHeight : this.baseSize;
    this.defaultTouchY = touch.clientY;
  }

  constructor(private el: ElementRef) {}

  inDragRegion(evt: TouchEvent | MouseEvent) {
    const target = evt.target as HTMLElement;
    const targetId = target.id;
    const targetClassName = target.className;
    if (this.draggingElementIds.includes(targetId) || this.isTargetElement(targetClassName)) {
      document.body.style.pointerEvents = 'none';
      evt.stopPropagation();
      this.dragging = true;
      SbiSwipeComponent.disableDocumentScroll(document);
    }
  }

  private isTargetElement(targetClassName: string) {
    return targetClassName && targetClassName.indexOf && !!~targetClassName.indexOf(this.dragTargetClassName);
  }

  addEventListeners() {
    document.addEventListener('touchmove', evt => this.mouseMoveG(evt), { passive: false });
    document.addEventListener('touchend', evt => this.mouseUpG(evt), true);
    document.addEventListener('touchstart', evt => this.mouseDown(evt), true);

    document.addEventListener('mousemove', evt => this.mouseMoveG(evt), { passive: false });
    document.addEventListener('mouseup', evt => this.mouseUpG(evt), true);
    document.addEventListener('mousedown', evt => this.mouseDown(evt), true);
  }

  removeEventListeners() {
    document.removeEventListener('touchmove', () => {});
    document.addEventListener('touchend', () => {});
    document.addEventListener('touchstart', () => {});

    document.addEventListener('mousemove', () => {});
    document.addEventListener('mouseup', () => {});
    document.addEventListener('mousedown', () => {});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Object.prototype.hasOwnProperty.call(changes, 'activeForOpen')) {
      changes['activeForOpen'].currentValue ? this.addEventListeners() : this.removeEventListeners();
    }
    if (this.activeForOpen) {
      this.changeForActiveElement(changes);
    }
    this.setDefaultParamsForDragging();
  }

  private setDefaultParamsForDragging() {
    this.dragging = false;
    this.startMaxHeight = 0;
    this.defaultTouchY = 0;
    this.restoreGlobalMouseEvents();
  }

  private changeForActiveElement(changes: SimpleChanges) {
    if (changes['open']?.currentValue) {
      this.el.nativeElement.style.maxHeight = Math.round(window.innerHeight) + 'px';
      this.el.nativeElement.style.minHeight = 'fit-content';
      this.open = true;
    }
    const close =
      changes['open'] &&
      Object.prototype.hasOwnProperty.call(changes['open'], 'currentValue') &&
      !changes['open'].currentValue;
    if (close || (changes['baseSize']?.currentValue && !this.open)) {
      this.el.nativeElement.style.maxHeight = this.baseSize + 'px';
      this.el.nativeElement.style.minHeight = this.baseSize + 'px';
    }
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }
}
