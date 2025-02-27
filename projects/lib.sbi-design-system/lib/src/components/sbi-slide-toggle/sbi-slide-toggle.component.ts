import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';

@Component({
  selector: 'sbi-slide-toggle',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule, SbiErrorComponent],
  templateUrl: './sbi-slide-toggle.component.html',
  styleUrl: './sbi-slide-toggle.component.scss',
})
export class SbiSlideToggleComponent implements OnChanges {
  @Input() label: string = '';
  @Input() note?: string = '';
  @Input() control!: FormControl<boolean | null>;
  @Input() slideToggleValue?: boolean | null = null;
  @Input() isLink: boolean = false;
  @Input() disabled: boolean = false;
  @Input() testId: string = 'sbi-slide-toggle';

  @Input() errorMessages?: Record<string, string>;
  @Input() showErrors: boolean = true;

  @Output() clickToLink = new EventEmitter();
  @Output() valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['slideToggleValue']?.currentValue) {
      this.control.setValue(changes?.['slideToggleValue']?.currentValue);
    }
    if (changes?.['disabled']?.currentValue) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  onSlideToggleValueChanged() {
    this.valueChanged.emit(this.control?.value ?? this.slideToggleValue ?? false);
  }

  onClickToLink() {
    if (this.isLink) {
      this.clickToLink.emit();
    }
  }
}
