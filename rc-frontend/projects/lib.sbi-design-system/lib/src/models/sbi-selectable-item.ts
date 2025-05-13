/**
 * @deprecated Использовать SbiSelectableItem
 * */
export interface SelectableItem<T> {
  value: T;
  viewValue: string;
  disabled?: boolean;
}

export interface SbiSelectableItem<T> extends SelectableItem<T> {
}
