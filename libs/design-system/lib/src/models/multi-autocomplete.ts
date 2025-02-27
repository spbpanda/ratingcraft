import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SelectableItem } from './selectable-item';
import { InputMode, InputType } from './input.types';
import { MaskitoOptions } from '@maskito/core';

export type MultiSelectElementTypes = 'input' | 'autocomplete';

export interface MultiSelectElement {
  control: FormControl<any | null>;
  fieldName: string,
  visible: boolean;
  prevControlName: string | null;
  options$?: Observable<SelectableItem<any>[]>;
  options?: SelectableItem<any>[];
  controlType: MultiSelectElementTypes;
  errorMessages?: Record<string, string>;
  compareFn?: (elem1: any, elem2: any) => boolean;
  displayFn?: (elem: any) => string;
  placeholder?: string;
  inputMode?: InputMode;
  inputType?: InputType;
  maskitoMask?: MaskitoOptions;
  appTitleCaseActive?: boolean;
  inputUppercaseActive?: boolean;
  maxLength?: string | number | null;
  useCustomFilterVoid?: boolean;
  width?: number | null;
}
