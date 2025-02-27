import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgForOf } from '@angular/common';
import { ToggleButton, ToggleButtonSizeEnum } from '../../models/toggle-button';

@Component({
  selector: 'sbi-button-toggle-group',
  templateUrl: 'sbi-button-toggle-group.component.html',
  styleUrls: ['sbi-button-toggle-group.component.scss'],
  standalone: true,
  imports: [MatButtonToggle, MatButtonToggleGroup, ReactiveFormsModule, NgForOf, NgClass],
})
export class SbiButtonToggleGroupComponent<T> implements OnInit, OnChanges {
  @Input() control!: FormControl<T | null>;
  @Input() selectedValue?: T;
  @Input() buttons: ToggleButton<T>[] = [];
  @Input() disabled = false;
  @Input() size: ToggleButtonSizeEnum = ToggleButtonSizeEnum.large;
  @Input() isVertical = false;
  @Input() compareFn: (elem1: T, elem2: T) => boolean = (elem1, elem2) =>
    JSON.stringify(elem1) === JSON.stringify(elem2);
  @Input() testId = 'sbi-button-toggle-group';

  @Output() onChangeEvent = new EventEmitter<ToggleButton<T>>();

  ngOnInit() {
    if (this.selectedValue !== undefined) {
      this.control = new FormControl<T>(this.selectedValue);
    }
    if (this.disabled) {
      this.control?.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Object.prototype.hasOwnProperty.call(changes, 'disabled')) {
      if (changes['disabled'].currentValue) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    }
  }

  public onButtonChange(button: ToggleButton<T>) {
    this.control.setValue(button.value);
    this.onChangeEvent.emit(button);
  }

  public buttonToggleIsChecked(value: T) {
    if (!this.control.value) {
      return false;
    }
    return this.compareFn(value, this.control.value);
  }

  public readonly ToggleButtonSizeEnum = ToggleButtonSizeEnum;
}
