import { TemplateRef } from '@angular/core';

/**
 * @description Интерфейс для опций радио-кнопок.
 * Содержит все необходимые свойства для отображения и управления отдельной радио-кнопкой.
 */
export interface SbiRadioButtonOption {
  /** Значение радио-кнопки. */
  value: string | boolean;
  /** Лейбл для радио-кнопки. */
  label?: string;
  /** Флаг, указывающий, отключена ли радио-кнопка. */
  disabled?: boolean;
  /** Дополнительное описание для радио-кнопки. */
  note?: string;
  /** Флаг, указывающий, является ли радио-кнопка ссылкой. */
  isLink?: boolean;
  /** Пользовательский шаблон содержимого для радио-кнопки. */
  customContent?: TemplateRef<any>;
}

export type SbiRadioButtonGroupFlexDirection = 'column' | 'row';
