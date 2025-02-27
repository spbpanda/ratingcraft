import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from '@angular/material/autocomplete';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiInputModeDirective } from '../../directives/sbi-input-mode.directive';
import { SbiTitleCaseDirective } from '../../directives/sbi-title-case.directive';
import { SbiUppercaseDirective } from '../../directives/sbi-uppercase.directive';
import { distinctUntilChanged, shareReplay, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, merge, of, Subject, Subscription } from 'rxjs';
import { SelectableItem } from '../../models/selectable-item';
import { CHEVRON_DOWN_ICON_SVG, CLEAR_ICON_SVG } from '../../const/icons';
import { MaskitoDirective } from '@maskito/angular';
import { PrefixIconType, SuffixIconType } from '../../models/input.types';
import { MaskitoOptions } from '@maskito/core';
import { MultiSelectElement } from '../../models/multi-autocomplete';
import { SbiChipComponent } from '../sbi-chip/sbi-chip.component';


@Component({
  selector: 'sbi-multi-autocomplete',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatFormField,
    MatInput,
    MatOption,
    MatPrefix,
    MatSuffix,
    NgForOf,
    NgIf,
    SbiErrorComponent,
    SbiIconComponent,
    SbiInputModeDirective,
    SbiTitleCaseDirective,
    SbiUppercaseDirective,
    NgClass,
    ReactiveFormsModule,
    MaskitoDirective,
    SbiChipComponent,
  ],
  templateUrl: './sbi-multi-autocomplete.component.html',
  styleUrl: './sbi-multi-autocomplete.component.scss'
})
export class SbiMultiAutocompleteComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('autocompleteInput') private autocompleteInput!: ElementRef<HTMLDivElement>;
  @ViewChild(MatFormField) private matFormField!: MatFormField;
  private readonly destroy$: Subject<boolean> = new Subject<boolean>();
  private filteredOptionSubscription$: Subscription | null = null;
  private readonly updateFormFieldValidate$ = new Subject<boolean>();

  private _activeElement: MultiSelectElement | null = null;
  set activeElement(element: MultiSelectElement | null) {
    this._activeElement = element;
  }

  get activeElement() {
    return this._activeElement;
  }

  private _errorMessages?: Record<string, string>;
  @Input() set errorMessages(errorMessages: Record<string, string> | undefined) {
    this._errorMessages = errorMessages;
  }

  get errorMessages() {
    return this._errorMessages;
  }

  private _errors: ValidationErrors | null = null;
  @Input() set errors(errors: ValidationErrors | null) {
    this._errors = errors;
  }

  get errors() {
    return this._errors;
  }

  private _disabled = false;
  @Input() set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  get disabled() {
    return this._disabled;
  }

  @Input() elements: Array<MultiSelectElement> = [];
  @Input() hiddenControlNames: Array<string> = [];
  @Input() invalid = false;
  @Input() suffixIconType: SuffixIconType = 'clear';
  @Input() prefixIconType: PrefixIconType = 'none';
  @Input() subtitle?: string;
  @Input() testId: string = 'sbi-multi-autocomplete-test-id';
  @Input() setVisibleVoid?: () => void;
  @Input() hideRequiredMarker = true;

  @Output() focusChange = new EventEmitter<boolean>();
  @Output() blur = new EventEmitter<MultiSelectElement>();
  @Output() clearAll = new EventEmitter<void>();
  @Output() selectedOptionInElement = new EventEmitter<MultiSelectElement>();
  @Output() clearOneElement = new EventEmitter<MultiSelectElement>();

  public readonly chevronIcon = CHEVRON_DOWN_ICON_SVG;
  public readonly clearIcon = CLEAR_ICON_SVG;
  public readonly baseMaskitoMask: MaskitoOptions = { mask: /\.*/ };
  public readonly baseDisplayFn = (elem: any) => typeof elem === 'string' || typeof elem === 'number' ? elem.toString() : JSON.stringify(elem);
  public readonly baseCompareFn = (elem1: any, elem2: any) => JSON.stringify(elem1) == JSON.stringify(elem2);
  public filteredOptions$ = new BehaviorSubject<SelectableItem<any>[]>([]);
  public focused = signal(false);
  public formFieldInvalid = signal(false);

  ngOnInit(): void {
    this.setOptions();
  }

  ngAfterViewInit() {
    this.connectChangeFormFieldStatus();
    this.changeFormFieldValidStatus(this.invalid);
  }

  private connectChangeFormFieldStatus() {
    const controls = this.elements.map(elem => elem.control);
    merge(...controls.map(control => control.valueChanges), this.updateFormFieldValidate$)
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(() => {
        const invalidControlIdx = controls.findIndex(control => control.touched && control.invalid);
        if (invalidControlIdx > -1 && this.hiddenControlNames.includes(this.elements[invalidControlIdx].fieldName)) {
          return;
        }
        const invalidControl = controls[invalidControlIdx];
        if (this.invalid) {
          this.changeFormFieldValidStatus(true);
        } else {
          if (this.formFieldInvalid() !== !!invalidControl) {
            this.changeFormFieldValidStatus(!!invalidControl);
          }
          this.errorMessages = invalidControlIdx > -1 ? this.elements[invalidControlIdx].errorMessages : undefined;
          this.errors = invalidControl ? invalidControl.errors : null;
        }
      })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['elements']) {
      this.setOptions();
    }
    if (Object.prototype.hasOwnProperty.call(changes, 'invalid')) {
      this.changeFormFieldValidStatus(changes['invalid'].currentValue);
    }
    if (Object.prototype.hasOwnProperty.call(changes, 'disabled')) {
      if (changes['disabled'].currentValue) {
        this.elements.forEach(element => element.control.disable())
      } else {
        this.elements.forEach(element => element.control.enable())
      }
    }
  }

  private changeFormFieldValidStatus(valid: boolean = true) {
    if (!this.matFormField) {
      return
    }
    this.formFieldInvalid.set(valid);
    (this.matFormField._formFieldControl as any).errorState = this.formFieldInvalid();
  }

  private setOptions() {
    this.elements.forEach(element => {
      if (element.options && !element.options$) {
        element.options$ = of(element.options)
      }
    })
  }

  private setAllOptions() {
    this.activeElement?.options$!.pipe(take(1), shareReplay(1)).subscribe(options => {
      this.filteredOptions$.next(options);
    })
  }

  private filterFunc(value: string) {
    if (!this.activeElement || this.activeElement.useCustomFilterVoid) {
      return;
    }
    this.activeElement.options$!.pipe(take(1), shareReplay(1)).subscribe(options => {
      if (!options) {
        this.filteredOptions$.next([]);
        return;
      }
      const newOpts = options.filter(option => option.viewValue?.toLowerCase()?.includes(value.toLowerCase()));
      this.setNewOptionsIfNotEquals(newOpts);
    })
  }

  private async setNewOptionsIfNotEquals(opts: SelectableItem<any>[]) {
    let equals = true;
    const actualValues = this.filteredOptions$.value;
    if (actualValues.length !== opts.length) {
      this.filteredOptions$.next(opts);
      return;
    }
    const compareFn = this.activeElement?.compareFn ?? this.baseCompareFn;
    actualValues.forEach((elem, idx) => equals = equals && compareFn(elem.value, opts[idx].value));
    if (!equals) {
      this.filteredOptions$.next(opts);
    }
  }

  public onSelectionChange(event: MatAutocompleteSelectedEvent) {
    this.focused.set(false);
    if (!this.activeElement) {
      return
    }
    this.selectedOptionInElement.emit(this.activeElement);
    this.selectNextInput(this.activeElement.fieldName);
    this.activeElement.control.setValue(event.option.value);
    this.activeElement.visible = false;
    this.updateElementsVisible(this.activeElement);
    this.activeElement = null;
    this.filteredOptions$.next([]);
  }

  private async selectNextInput(controlFieldName: string) {
    const idx = this.elements.findIndex(elem => elem.fieldName === controlFieldName);
    const newSelectIdx = this.elements.slice(idx, this.elements.length).findIndex(elem => elem.visible);
    newSelectIdx > -1 && this.activeClearedInput(newSelectIdx);
  }

  public trackByFn(index: number, item: any): any {
    return index;
  }

  public setActiveElement(elem: MultiSelectElement) {
    this.filteredOptionSubscription$?.unsubscribe();
    switch (elem.controlType) {
      case 'autocomplete':
        this.setActiveAutoComplete(elem);
        break
      case 'input':
        this.filteredOptions$.next([]);
        this.activeElement = elem;
        break;
    }
  }

  private setActiveAutoComplete(elem: MultiSelectElement) {
    this.activeElement = elem;
    this.setAllOptions();
    this.filteredOptionSubscription$ = elem.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.filterFunc(typeof value === 'string' ? value : '');
    });
  }

  public formFieldBlur() {
    this.updateFormFieldValidate$.next(true);
  }

  public onBlur(elem: MultiSelectElement) {
    this.blur.emit(elem);
    switch (elem.controlType) {
      case 'autocomplete':
        break
      case 'input':
        this.onInputBlur(elem);
        break
    }
    this.updateFormFieldValidate$.next(true);
  }

  private onInputBlur(elem: MultiSelectElement) {
    if (!elem.control.value || elem.control.invalid) {
      return
    }
    this.activeElement = null;
    elem.visible = false;
    this.updateElementsVisible(elem);
  }

  public onFocusChange(focus: boolean) {
    this.focused.set(focus);
    this.focusChange.emit(focus);
  }

  public onClearControl() {
    this.activeElement = null;
    this.clearAll.emit();
    this.elements = this.elements.map(element => {
      element.control.setValue('');
      element.control.markAsUntouched();
      return { ...element, visible: element.prevControlName == null };
    })
    this.updateFormFieldValidate$.next(true);
  }

  public activeInput() {
    const children = this.autocompleteInput.nativeElement.children;
    const inputsCount = children.length;
    for (let i = 1; i < inputsCount; i++) {
      if (this.elements[i - 1].visible) {
        this.activeClearedInput(i);
        break;
      }
    }
  }

  public removeElementValue(elem: MultiSelectElement, idx: number) {
    this.clearOneElement.emit(elem);
    this.activeElement = elem;
    this.elements = this.elements.map(item => {
      if (item.fieldName === elem.fieldName || item.prevControlName === elem.fieldName) {
        item.control.setValue('');
        return { ...item, visible: true };
      }
      return item;
    });
    this.removeRelatedElementsValue(elem);
    this.activeClearedInput(idx + 1);
  }

  private removeRelatedElementsValue(elem: MultiSelectElement) {
    this.elements.forEach(item => {
      if (item.prevControlName === elem.fieldName) {
        item.control.setValue('');
        item.visible = false;
        this.removeRelatedElementsValue(item);
      }
    });
  }

  private activeClearedInput(idx: number) {
    setTimeout(() => {
      const element = (this.autocompleteInput.nativeElement.children.item(idx) as HTMLElement);
      element.focus();
      element.click();
    }, 50);
  }

  private updateElementsVisible(elem: MultiSelectElement) {
    this.elements = this.elements.map(item => {
      if (item.prevControlName != null) {
        return { ...item, visible: item.prevControlName === elem.fieldName || item.visible };
      }
      return item;
    });
    this.setVisibleVoid?.();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
