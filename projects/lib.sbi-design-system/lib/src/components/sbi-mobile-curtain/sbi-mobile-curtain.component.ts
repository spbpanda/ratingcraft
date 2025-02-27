import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { SbiResizableDirective } from '../../directives/sbi-resize.directive';
import { NgIf } from '@angular/common';
import { SbiSwipeComponent } from '../../classes/sbi-swipe-component';

@Component({
  selector: 'sbi-mobile-curtain',
  templateUrl: 'sbi-mobile-curtain.component.html',
  styleUrls: ['sbi-mobile-curtain.component.scss'],
  standalone: true,
  imports: [SbiResizableDirective, NgIf],
})
export class SbiMobileCurtainComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sbiCurtainContainer') private curtainContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('sbiCurtainContent') private sbiCurtainContent!: ElementRef<HTMLDivElement>;
  @ViewChild('sbiCurtainHideBackground') private sbiCurtainHideBackground!: ElementRef<HTMLDivElement>;
  private _open = false;

  @Input() baseSize = 0;
  @Input() activeForOpen = false;
  @Input() testId = 'sbi-mobile-curtain';
  @Input() openCloseDelta = 50;

  @Output() openEvent = new EventEmitter<boolean>();

  public get open() {
    return this._open;
  }

  public get contentHeight() {
    return this.sbiCurtainContent?.nativeElement?.getBoundingClientRect()?.height;
  }

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

  private insertCurtainInToBody() {
    if (this.sbiCurtainHideBackground && SbiSwipeComponent.isMobile(window)) {
      this.insertInToBody(this.sbiCurtainHideBackground.nativeElement);
    }
    if (this.curtainContainer && SbiSwipeComponent.isMobile(window)) {
      this.insertInToBody(this.curtainContainer.nativeElement);
      // document.body.style.overflowY = 'hidden';
    }
  }

  private insertInToBody(elem: HTMLElement) {
    elem.remove();
    document.body.appendChild(elem);
  }

  public openOrClose(val: boolean) {
    this.open = val;
    this.openEvent.emit(this._open);
  }

  ngOnDestroy() {
    this.curtainContainer.nativeElement?.remove();
  }
}
