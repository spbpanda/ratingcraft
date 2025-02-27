import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { SbiComponentWithOptions } from './sbi-component-with-options';
import { PrefixIconType, SuffixIconType } from '../models/input.types';
import { MaskitoOptions } from '@maskito/core';
import { CLEAR_ICON_SVG } from '../const/icons';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SelectableItem } from '../models/selectable-item';

@Component({
  template: ``,
})
export abstract class SbiComponentWithAutocomplete<T>
  extends SbiComponentWithOptions<T>
  implements OnChanges, OnDestroy
{
  protected destroy$ = new Subject<boolean>();

  public get clearIcon() {
    return CLEAR_ICON_SVG;
  }

  @Input() displayFunc: (arg: any) => string;
  @Input() compareFn: (elem1: T, elem2: T) => boolean = (elem1, elem2) =>
    JSON.stringify(elem1) === JSON.stringify(elem2);
  @Input() customFilterVoid = false;
  @Input() suffixIconType: SuffixIconType = 'clear';
  @Input() prefixIconType: PrefixIconType = 'none';
  @Input() inputUppercaseActive: boolean = false;
  @Input() appTitleCaseActive: boolean = false;
  @Input() hasDisabledOptions = false;
  @Input() maskitoMask: MaskitoOptions = {
    mask: /\.*/,
  };
  @Input() maxLength: any = null;

  @Output() autoCompleteOpened: EventEmitter<void> = new EventEmitter<void>();

  public onAutoCompleteOpened() {
    this.autoCompleteOpened.emit();
  }

  public onSelectionChange(val: MatAutocompleteSelectedEvent) {
    this.selectionChange.emit(val.option.value);
  }

  public filteredOptions$: BehaviorSubject<SelectableItem<T>[]> = new BehaviorSubject<SelectableItem<T>[]>([]);

  public constructor() {
    super();
    this.displayFunc = arg => (arg != null ? (typeof arg === 'string' ? arg : JSON.stringify(arg)) : '');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.setNewOptionsIfNotEquals(changes['options'].currentValue);
    }
  }

  /**
   * Функция фильтрации
   * Если нужна фильтрация на стороне фронта
   * Фильтруем список опций по вводимому значению
   */
  protected filterFunc(value: string | T = '') {
    if (this.customFilterVoid) {
      this.filteredOptions$.next(this.options || []);
      return;
    }
    if (!this.options) {
      this.filteredOptions$.next([]);
      return;
    }
    if (!value || typeof value === 'object') {
      this.setNewOptionsIfNotEquals(this.options);
      return;
    }
    if (typeof value === 'string') {
      const newOpts = this.options.filter(option => option.viewValue?.toLowerCase()?.includes(value.toLowerCase()));
      this.setNewOptionsIfNotEquals(newOpts);
    }
  }

  private async setNewOptionsIfNotEquals(opts: SelectableItem<T>[]) {
    let equals = true;
    const actualValues = this.filteredOptions$.value;
    if (actualValues.length !== opts.length) {
      this.filteredOptions$.next(opts);
      return;
    }
    actualValues.forEach((elem, idx) => (equals = equals && this.compareFn(elem.value, opts[idx].value)));
    if (!equals) {
      this.filteredOptions$.next(opts);
    }
  }

  public override onClearControl(event: Event) {
    this.clearControl.emit(event);
  }

  public isDisabledOption(option: SelectableItem<T>) {
    if (!this.hasDisabledOptions) {
      return false;
    }
    return Boolean((option as any).disabled);
  }

  public trackByFn(index: number, item: any): any {
    return index;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
