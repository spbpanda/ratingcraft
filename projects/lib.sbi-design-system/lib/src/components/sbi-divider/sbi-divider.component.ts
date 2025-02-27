import { Component, Input } from '@angular/core';

@Component({
  selector: 'sbi-divider',
  standalone: true,
  imports: [],
  templateUrl: './sbi-divider.component.html',
  styleUrl: './sbi-divider.component.scss'
})
export class SbiDividerComponent {
  @Input() sizePx?: number = undefined;
  @Input() size: 'large' | 'small' = 'small';
  @Input() color: string = '#EDEDED';
  @Input() testId: string = 'sbiDivider';

  get dividerSize() {
    return this.sizePx ?? this.size === 'small' ? 1 : 8
  }
}
