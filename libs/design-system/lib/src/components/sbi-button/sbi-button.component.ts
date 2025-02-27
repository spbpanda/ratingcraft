import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sbi-button',
  standalone: true,
  imports: [
    NgClass,
    MatButtonModule
  ],
  templateUrl: './sbi-button.component.html',
  styleUrl: './sbi-button.component.scss'
})
export class SbiButtonComponent {
  @Input() size: 'large' | 'small' = 'large';
  @Input() appearance: 'primary' | 'warn' | 'tint' | 'overlay' = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() testId: string = 'sbi-button';
  @Output() clickBtn: EventEmitter<unknown> = new EventEmitter();

  onClick(event: Event) {
    if (!this.disabled) {
      this.clickBtn.emit(event)
    }
  }
}
