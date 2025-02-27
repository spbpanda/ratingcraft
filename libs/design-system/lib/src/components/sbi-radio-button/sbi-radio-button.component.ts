import { SbiErrorComponent } from './../sbi-error/sbi-error.component';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

export interface SbiRadioButtonOption {
  value: string | boolean;
  label: string;
  disabled?: boolean;
  note?: string;
  isLink?: boolean;
}

@Component({
  selector: 'sbi-radio-button',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    ReactiveFormsModule,
    SbiErrorComponent,
    MatRadioModule
  ],
  templateUrl: './sbi-radio-button.component.html',
  styleUrl: './sbi-radio-button.component.scss'
})
export class SbiRadioButtonComponent {
  @Input() options: SbiRadioButtonOption[] = [];
  @Input() control: FormControl = new FormControl();
  @Input() testId: string = 'sbi-radio';
  @Input() errorMessages?: Record<string, string>;
  @Input() showErrors: boolean = true;

  @Output() clickToLink = new EventEmitter();

  onClickToLink() {
    this.clickToLink.emit();
  }
}
