/**
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
