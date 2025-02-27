import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { CardTypes } from '../../models/card.types';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { QUESTION_MARK_SVG_ICON } from '../../const/icons';
import { SbiCheckboxComponent } from '../sbi-checkbox/sbi-checkbox.component';
import { FormControl } from '@angular/forms';
import { NgClass, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { SbiRadioButtonComponent, SbiRadioButtonOption } from '../sbi-radio-button/sbi-radio-button.component';
import { SbiSlideToggleComponent } from '../sbi-slide-toggle/sbi-slide-toggle.component';
import { SbiBadgeComponent } from '../sbi-badge/sbi-badge.component';
import { BadgeSize, BadgeTypes } from '../../models/badge.types';
import { SbiTooltipDirective } from '../sbi-tooltip/sbi-tooltip.directive';

@Component({
  selector: 'sbi-optional-card',
  standalone: true,
  imports: [
    SbiIconComponent,
    SbiCheckboxComponent,
    NgSwitch,
    NgTemplateOutlet,
    NgSwitchCase,
    SbiRadioButtonComponent,
    SbiSlideToggleComponent,
    NgIf,
    SbiBadgeComponent,
    NgClass,
    SbiTooltipDirective,
  ],
  templateUrl: './sbi-optional-card.component.html',
  styleUrl: './sbi-optional-card.component.scss',
})
export class SbiOptionalCardComponent implements OnInit {
  @Input() value?: boolean;
  @Input() control!: FormControl<boolean | null>;
  @Input() type: CardTypes = 'checkbox';
  @Input() badgeContent = '';
  @Input() label = '';
  @Input() note?: string;
  @Input() showInfoIcon = true;
  @Input() testId = 'sbi-optional-card-test-id';
  @Input() icon = '';
  @Input() illustrationIcon = '';
  @Input() badgeType: BadgeTypes = 'accent';
  @Input() badgeSize: BadgeSize = 'regular';
  @Input() isLink = false;
  @Input() showCheckbox = true;
  @Input() tooltipPosition: 'top' | 'bottom' = 'bottom';
  @Input() tooltipContent: string | TemplateRef<any> | null = null;
  @Input() size: 'large' | 'small' = 'large';

  @Output() valueChanged = new EventEmitter();
  @Output() linkClick = new EventEmitter();

  public radioOptions: SbiRadioButtonOption[] = [{label: '', value: true}];
  public questionIcon = QUESTION_MARK_SVG_ICON;

  ngOnInit() {
    if (this.value !== undefined) {
      this.control = new FormControl(this.value);
    }
  }

  public onCardClick() {
    if (this.type !== 'radio' || !this.control.value) {
      this.control.setValue(!this.control.value);
    }
    this.valueChanged.emit();
  }

  public onClick() {
    this.valueChanged.emit();
  }

  public onLinkClick() {
    this.linkClick.emit();
  }
}
