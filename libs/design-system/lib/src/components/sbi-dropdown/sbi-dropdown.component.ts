import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { MatLabel } from '@angular/material/select';
import { SbiComponentWithAutocomplete } from '../../classes/sbi-component-with-autocomplete';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { debounceTime } from 'rxjs';
import { SbiMultiUppercaseDirective } from '../../directives/sbi-multi-uppercase.directive';
import { SbiInputModeDirective } from '../../directives/sbi-input-mode.directive';
import { SbiTitleCaseDirective } from '../../directives/sbi-title-case.directive';
import { SbiNameUppercaseDirective } from '../../directives/sbi-name-uppercase.directive';
import { MaskitoOptions } from '@maskito/core';
import { MaskitoDirective } from '@maskito/angular';

@Component({
  selector: 'sbi-dropdown',
  templateUrl: './sbi-dropdown.component.html',
  styleUrls: ['./sbi-dropdown.component.scss'],
  standalone: true,
  imports: [
    MatFormField,
    NgIf,
    MatInput,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    SbiErrorComponent,
    MatSuffix,
    SbiIconComponent,
    MatLabel,
    MatPrefix,
    MatOption,
    AsyncPipe,
    SbiMultiUppercaseDirective,
    SbiInputModeDirective,
    SbiTitleCaseDirective,
    SbiNameUppercaseDirective,
    MaskitoDirective,
    NgForOf,
  ],
})
export class SbiDropdownComponent<T> extends SbiComponentWithAutocomplete<T> {
  @ViewChild('input') private input!: ElementRef<HTMLInputElement>;

  @Input() mask: MaskitoOptions = { mask: /\.*/ };
  @Input() dropSpecialCharacters = true;
  @Input() inputMultiUppercaseActive = false;
  @Input() inputNameUppercaseActive = false;
  @Input() showChevron = true;

  override ngOnInit() {
    super.ngOnInit();
    this.connectFilterOptions();
  }

  private connectFilterOptions() {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(50), distinctUntilChanged())
      .subscribe(value => !this.customFilterVoid && this.filterFunc(value || ''));
  }

  override ngOnChanges(changes: SimpleChanges) {
    this.filterFunc(this.control.value || '');
    if (changes['mask'] && typeof this.control.value === 'string' && this.input?.nativeElement) {
      this.input.nativeElement.value = this.control.value;
    }
  }

  public override onClearControl(event: Event) {
    super.onClearControl(event);
    this.control.setValue(null);
  }
}
