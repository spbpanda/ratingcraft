import { Component, Input } from '@angular/core';
import { BadgeSize, BadgeTypes } from '../../models/badge.types';
import { NgIf } from '@angular/common';

@Component({
  selector: 'sbi-badge',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './sbi-badge.component.html',
  styleUrl: './sbi-badge.component.scss'
})
export class SbiBadgeComponent {
  @Input() size: BadgeSize = 'large';
  @Input() type: BadgeTypes = 'accent';
  @Input() content = '';
}
