import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'sbi-tooltip',
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet
  ],
  templateUrl: './sbi-tooltip.component.html',
  styleUrl: './sbi-tooltip.component.scss'
})
export class SbiTooltipComponent {
  @Input() contentText: string | null = null;
  @Input() content: TemplateRef<any> | null = null;
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() context: any;
}
