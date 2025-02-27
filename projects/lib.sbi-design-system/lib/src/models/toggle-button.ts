export type ToggleButton<T> = {
  value: T;
  label: string;
  disabled?: boolean;
}

export enum ToggleButtonSizeEnum {
  large = 'Large',
  small = 'Small',
  mini = 'Mini',
}
