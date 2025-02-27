import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectChange, MatSuffix } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiComponentWithOptions } from '../../classes/sbi-component-with-options';

@Component({
  selector: 'sbi-select',
  templateUrl: './sbi-select.component.html',
  styleUrls: ['./sbi-select.component.scss'],
  standalone: true,
  imports: [
    MatFormField,
    NgIf,
    MatSelect,
    ReactiveFormsModule,
    MatOption,
    SbiErrorComponent,
    NgForOf,
    MatSuffix,
    SbiIconComponent,
    MatLabel,
  ],
})
export class SbiSelectComponent<T> extends SbiComponentWithOptions<T | string | null> {
  @Input() compareFn: (elem1: T | string | number, elem2: T | string | number) => boolean = (elem1, elem2) =>
    elem1 && elem2 && typeof elem1 === 'object' && typeof elem2 === 'object'
      ? JSON.stringify(elem1) === JSON.stringify(elem2)
      : elem1 === elem2;

  public onSelectionChange(val: MatSelectChange) {
    this.focused.set(false);
    this.selectionChange.emit(val.value);
  }
}
