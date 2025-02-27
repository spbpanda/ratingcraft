import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { StatusAppearanceTypes, StatusTypes } from '../../models/status.types';
import {
  EXCLAMATION_MARK_SVG_ICON,
  INFO_MARK_SVG_ICON,
  QUESTION_MARK_SVG_ICON,
  SUCCESS_MARK_SVG_ICON
} from '../../const/icons';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';

@Component({
  selector: 'sbi-status',
  templateUrl: 'sbi-status.component.html',
  styleUrls: ['sbi-status.component.scss'],
  standalone: true,
  imports: [NgIf, SbiIconComponent],
})
export class SbiStatusComponent implements OnInit, OnChanges {
  public defaultIcon = '';

  @Input() label?: string;
  @Input() type: StatusTypes = 'primary';
  @Input() appearance: StatusAppearanceTypes = 'info';
  @Input() icon: string = '';
  @Input() showIcon = true;

  ngOnInit() {
    !this.icon && this.setDefaultIcon();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['icon'] && !changes['icon'].currentValue) {
      this.setDefaultIcon();
    }
    if (!this.icon && changes['appearance']) {
      this.setDefaultIcon();
    }
  }

  private setDefaultIcon() {
    switch (this.appearance) {
      case 'warning':
        this.defaultIcon = QUESTION_MARK_SVG_ICON;
        break;
      case 'info':
        this.defaultIcon = INFO_MARK_SVG_ICON;
        break
      case 'success':
        this.defaultIcon = SUCCESS_MARK_SVG_ICON;
        break
      case 'neutral':
        this.defaultIcon = QUESTION_MARK_SVG_ICON;
        break
      case 'error':
        this.defaultIcon = EXCLAMATION_MARK_SVG_ICON;
        break;
    }
  }
}
