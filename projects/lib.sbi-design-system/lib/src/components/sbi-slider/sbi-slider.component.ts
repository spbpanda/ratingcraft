import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { NgClass, NgIf } from '@angular/common';
import { SbiInputComponent } from '../sbi-input/sbi-input.component';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiComponentWithInput } from '../../classes/sbi-component-with-input.component';
import { DEFAULT_MAX_VALUE, DEFAULT_MIN_VALUE, DEFAULT_STEP_SLIDER_VALUE } from '../../const/default-values';

@Component({
  selector: 'sbi-slider',
  templateUrl: './sbi-slider.component.html',
  styleUrls: ['./sbi-slider.component.scss'],
  imports: [
    SbiInputComponent,
    MatSlider,
    MatSliderThumb,
    SbiErrorComponent,
    NgIf,
    ReactiveFormsModule,
    NgClass,
  ],
  standalone: true
})
export class SbiSliderComponent extends SbiComponentWithInput<number> {

  @Input() max = DEFAULT_MAX_VALUE;
  @Input() min = DEFAULT_MIN_VALUE;
  @Input() step = DEFAULT_STEP_SLIDER_VALUE;
  @Input() suffix = '';
  @Input() prefix = '';
  @Input() underTitleLeft = '';
  @Input() underTitleRight = '';

  @Output() sliderFocus = new EventEmitter<boolean>();

  displayFn = (value: number) => {
    if (this.sliderValue !== value && !this.focused()) {
      this.sliderValue = value;
    }
    return value.toString();
  };

  public get sliderValue() {
    return this.control.value;
  }

  public set sliderValue(value: number | null) {
    this.control.setValue(value);
  }

  public onInputFocusChange(focus: boolean) {
    super.onFocusChange(focus);

    if (this.control.value != null && this.control.value < this.min) {
      this.control.setValue(this.min)
    }
    if (this.control.value != null && this.control.value > this.max) {
      this.control.setValue(this.max)
    }
  }

  public onSliderFocusChange(focus: boolean) {
    this.sliderFocus.emit(focus);
  }
}
