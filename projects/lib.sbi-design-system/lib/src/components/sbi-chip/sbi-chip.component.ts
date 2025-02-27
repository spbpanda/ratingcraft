import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { NgClass, NgIf } from '@angular/common';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { CLEAR_ICON_SVG } from '../../const/icons';

@Component({
  selector: 'sbi-chip',
  templateUrl: './sbi-chip.component.html',
  styleUrls: ['sbi-chip.component.scss'],
  standalone: true,
  imports: [MatChip, NgIf, SbiIconComponent, NgClass],
})
export class SbiChipComponent<T> {
  public get clearIcon() {
    return CLEAR_ICON_SVG;
  }

  @Input() invalid = false;
  @Input() disabled = false;
  @Input() selected = false;
  @Input() label?: string;
  @Input() showClearIcon = true;
  @Input() testId = 'sbi-chip';

  @Output() clearChipEvent = new EventEmitter<Event>();
  @Output() clickChipEvent = new EventEmitter<Event>();

  onClearChip(event: Event) {
    !this.disabled && this.clearChipEvent.emit(event);
  }

  onChipClick(event: Event) {
    !this.disabled && this.clickChipEvent.emit(event);
  }
}
