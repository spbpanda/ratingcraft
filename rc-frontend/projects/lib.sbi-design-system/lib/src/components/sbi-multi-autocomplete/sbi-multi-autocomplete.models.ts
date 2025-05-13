import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SbiSelectableItem } from '../../models/sbi-selectable-item';
import { MaskitoOptions } from '@maskito/core';
import { SbiInputMode, SbiInputType } from '../sbi-input/sbi-input.models';

export type SbiMultiSelectElementType = 'input' | 'autocomplete';

export interface SbiMultiSelectElement<T> {
  control: FormControl;
  fieldName: string,
  visible: boolean;
  prevControlName: string | null;
  options$?: Observable<Array<SbiSelectableItem<T>>>;
  options?: Array<SbiSelectableItem<T>>;
  controlType: SbiMultiSelectElementType;
  errorMessages?: Record<string, string>;
  compareFn?: (elem1: T, elem2: T) => boolean;
  displayFn?: (elem: T) => string;
  placeholder?: string;
  inputMode?: SbiInputMode;
  inputType?: SbiInputType;
  maskitoMask?: MaskitoOptions;
  inputTitleCaseActive?: boolean;
  inputUppercaseActive?: boolean;
  maxLength?: string | number | null;
  useCustomFilterVoid?: boolean;
  width?: number | null;
}
