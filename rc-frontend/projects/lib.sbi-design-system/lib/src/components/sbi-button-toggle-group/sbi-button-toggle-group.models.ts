/**
 * @deprecated Необходимо использовать SbiToggleButton
 * Интерфейс для одной кнопки в списке button toggle group.
 * */
export interface ToggleButton<T> {
  /**
   * Значение, помещаемое в control при нажатии на кнопку.
   * */
  value: T;

  /**
   * Лейбл кнопки.
   * */
  label: string;

  /**
   * Заблокирована текущая кнопка или нет.
   * */
  disabled?: boolean;
}

export interface SbiToggleButton<T> extends ToggleButton<T> {
}

export type SbiButtonToggleGroupSize = 'large' | 'small' | 'mini';
