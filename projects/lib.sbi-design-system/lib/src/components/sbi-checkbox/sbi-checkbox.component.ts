import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';

@Component({
  selector: 'sbi-checkbox',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    ReactiveFormsModule,
    SbiErrorComponent,
  ],
  templateUrl: './sbi-checkbox.component.html',
  styleUrl: './sbi-checkbox.component.scss'
})
export class SbiCheckboxComponent implements OnChanges {
  @Input() label: string = '';
  @Input() note?: string = '';
  @Input() control: FormControl<boolean | null> = new FormControl();
  @Input() checkboxValue?: boolean | null = null;
  @Input() isLink: boolean = false;
  @Input() disabled: boolean = false;
  @Input() testId: string = 'sbi-check-box';
  @Input() errorMessages?: Record<string, string>;
  @Input() showErrors: boolean = true;

  @Output() clickToLink = new EventEmitter();
  @Output() valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnChanges(changes: SimpleChanges) {
    if (Object.prototype.hasOwnProperty.call(changes, 'checkboxValue')) {
      this.control.setValue(changes?.['checkboxValue']?.currentValue);
    }
    if (changes?.['disabled']?.currentValue) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  onCheckboxValueChanged() {
    this.valueChanged.emit(this.control?.value ?? this.checkboxValue ?? false);
  }

  onClickToLink() {
    if (this.isLink) {
      this.clickToLink.emit();
    }
  }
}
