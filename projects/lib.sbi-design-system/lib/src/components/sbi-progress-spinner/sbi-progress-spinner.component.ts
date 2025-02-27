import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sbi-progress-spinner',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './sbi-progress-spinner.component.html',
  styleUrl: './sbi-progress-spinner.component.scss'
})
export class SbiProgressSpinnerComponent {
  @Input() type: 'primary' | 'secondary' = 'primary';
  @Input() size: 'xl' | 'l' | 'm' | 's' = 'xl';

  getSpinnerClass(): string {
    return `spinner spinner-${this.size} spinner-${this.type}`;
  }


  getSpinnerTypeClass(): string {
    return `spinner`;
  }
}
