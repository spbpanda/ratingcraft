import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sbi-button',
  standalone: true,
  imports: [NgClass, MatButtonModule],
  templateUrl: './sbi-button.component.html',
  styleUrl: './sbi-button.component.scss',
  host: {
    '[class.disabled]': 'disabled',
  },
})
export class SbiButtonComponent {
  @Input() size: 'large' | 'small' = 'large';
  @Input() appearance: 'primary' | 'warn' | 'primary-tint' | 'warn-tint' | 'overlay' = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() testId: string = 'sbi-button';
}
