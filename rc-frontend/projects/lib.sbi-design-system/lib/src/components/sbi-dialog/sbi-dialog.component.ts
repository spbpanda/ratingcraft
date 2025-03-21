import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SbiResizableDirective } from '../../directives/sbi-resize.directive';
import { SbiSwipeComponent } from '../../classes/sbi-swipe-component';
import { NgClass, NgIf } from '@angular/common';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { CLEAR_ICON_SVG } from '../../const/icons';

@Component({
  selector: 'sbi-dialog',
  standalone: true,
  imports: [SbiResizableDirective, NgIf, SbiIconComponent, NgClass],
  templateUrl: './sbi-dialog.component.html',
  styleUrl: './sbi-dialog.component.scss',
})
export class SbiDialogComponent extends SbiSwipeComponent {
  @Input() testId = 'sbi-dialog-test-id';
  @Input() openCloseDelta = 200;
  @Input() maxHeight = 700;
  @Input() noScroll = false;

  @Output() close = new EventEmitter();

  public get closeIcon() {
    return CLEAR_ICON_SVG;
  }

  /**
   * @deprecated
   * Заменить на нормальное определение размеров экрана
   * */
  public get isMobile() {
    return window.innerWidth < 1150;
  }

  public get meIsActive() {
    return this.swipeService.actualPopUpModalForm === this.modalFormId;
  }

  onClose() {
    this.close.emit();
  }
}
