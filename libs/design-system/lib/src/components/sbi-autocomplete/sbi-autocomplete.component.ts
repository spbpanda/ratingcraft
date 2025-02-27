import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { SbiUppercaseDirective } from '../../directives/sbi-uppercase.directive';
import { FormControl, FormControlStatus, ReactiveFormsModule } from '@angular/forms';
import { SbiTitleCaseDirective } from '../../directives/sbi-title-case.directive';
import { MaskitoDirective } from '@maskito/angular';
import { SbiCheckboxComponent } from '../sbi-checkbox/sbi-checkbox.component';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiComponentWithAutocomplete } from '../../classes/sbi-component-with-autocomplete';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { debounceTime } from 'rxjs';
import { SbiInputModeDirective } from '../../directives/sbi-input-mode.directive';
import { SbiChipRowComponent } from '../sbi-chip-row/sbi-chip-row.component';
import { SelectionModel } from '@angular/cdk/collections';

function validator(invalid: boolean = false) {
  return () => (invalid ? { invalid: true } : null);
}

@Component({
  selector: 'sbi-autocomplete',
  templateUrl: './sbi-autocomplete.component.html',
  styleUrls: ['./sbi-autocomplete.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    AsyncPipe,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MaskitoDirective,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatSuffix,
    MatPrefix,
    SbiUppercaseDirective,
    SbiTitleCaseDirective,
    SbiIconComponent,
    SbiCheckboxComponent,
    SbiErrorComponent,
    SbiInputModeDirective,
    SbiChipRowComponent,
  ],
})
export class SbiAutocompleteComponent<T> extends SbiComponentWithAutocomplete<T> implements AfterViewInit {
  @ViewChild('autocompleteInput') autocompleteInput!: ElementRef<HTMLInputElement>;
  @ViewChild('autocompleteChipRow') autocompleteChipRow!: SbiChipRowComponent<T>;

  @Input() declare control: FormControl<any>;
  @Input() maxElementsCount = 99999999;
  @Input() touched = false;

  @Output() searchChangeEvent = new EventEmitter<string | null>();

  public selection = new SelectionModel<T>(true, [], true, this.compareFn);
  public searchControl = new FormControl('');

  get disabledByMaxElems() {
    return (this.control.value as T[]).length >= this.maxElementsCount;
  }

  override ngOnInit() {
    super.ngOnInit();
    this.connectFilterOptions();
    this.connectChangeSelectedOptions();
  }

  private connectFilterOptions() {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(100), distinctUntilChanged())
      .subscribe(search => {
        this.filterFunc(search || '');
        this.searchChangeEvent.emit(search);
      });
  }

  private connectChangeSelectedOptions() {
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setSelectedByControlValue();
    });
  }

  ngAfterViewInit() {
    this.connectControlStatusChange();
  }

  private connectControlStatusChange() {
    this.updateSearchControlStatus(this.control.status);
    this.control.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(status => {
      this.updateSearchControlStatus(status);
    });
  }

  private updateSearchControlStatus(status: FormControlStatus) {
    if (status === 'INVALID') {
      this.searchControl.addValidators(validator(true));
    } else {
      this.searchControl.clearValidators();
    }
    this.searchControl[status === 'DISABLED' ? 'disable' : 'enable']();
  }

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['options']) {
      this.setSelectedByControlValue()
    }
    if (changes['touched'] && this.control.touched && !this.searchControl.touched) {
      this.searchControl.markAsTouched();
    }
  }

  private setSelectedByControlValue() {
    this.selection.clear();
    ((this.control.value as T[]) || []).forEach(elem => this.selection.select(elem))
  }

  public removeChip(value: T) {
    this.changeControlValue(value);
    this.searchControl.setValue('');
  }

  public override onSelectionChange(val: MatAutocompleteSelectedEvent) {
    super.onSelectionChange(val);
    this.changeControlValue(val.option.value as T);
    this.searchControl.setValue('');
    this.scrollToRight();
  }

  private changeControlValue(value: T) {
    const values: T[] = Array.isArray(this.control.value) ? this.control.value : [];
    if (this.selection.isSelected(value)) {
      this.control.setValue(values.filter(elem => !this.compareFn(elem, value)));
    } else {
      this.control.setValue(values.concat(value));
    }
  }

  private scrollToRight() {
    setTimeout(() => {
      const element = this.autocompleteChipRow.sbiChipRow.nativeElement;
      element.scrollBy({ left: 999999, behavior: 'smooth' });
      setTimeout(() => this.autocompleteInput.nativeElement.click(), 100);
    });
  }

  public override onClearControl(event: Event) {
    super.onClearControl(event);
    this.control.setValue([]);
    this.searchControl.setValue('');
  }

  public onInputBlur(event: Event) {
    this.control.markAsTouched();
  }
}
