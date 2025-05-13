import { SbiTooltipContent, SbiTooltipPosition } from '../../../sbi-tooltip/sbi-tooltip.models';

/**
 * @description Модель объекта документа.
 * @typeParam label - Название файла.
 * @typeParam href - Ссылка для скачивания файла.
 * @typeParam sbiTooltip - Всплывающая подсказка (показывается при наведении на файл).
 * @typeParam tooltipPosition - Положение всплывающей подсказки.
 * @typeParam note - Текст примечания.
 * @typeParam isLink - Флаг, обозначающий является ли примечание ссылкой.
 * */
export interface SbiSidebarDocument {
  label: string;
  href: string;
  sbiTooltip?: SbiTooltipContent;
  tooltipPosition?: SbiTooltipPosition;
  note?: string;
  isLink?: boolean;
}

/**
 * @description Модель конфигурации модального окна с документами. Используется для передачи через @Input в компонент sidebar.
 * @typeParam title - Заголовок модального окна.
 * @typeParam submitButtonTitle - Текст основной кнопки.
 * @typeParam scrollableContent - Отображать ли скролл бар для модального окна.
 * */
export interface SbiSidebarDocumentConfiguration {
  title?: string;
  submitButtonTitle?: string;
  scrollableContent?: boolean;
}

/**
 * @description Модель конфигурации для открытия модального окна с документами из компонента sidebar.
 * @typeParam documents - Список документов.
 * */
export interface DocumentModalForm extends SbiSidebarDocumentConfiguration {
  documents?: Array<SbiSidebarDocument>;
}
