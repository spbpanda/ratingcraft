/**
 * Тип кнопки с выпадающим меню
 * @type {'outline' | 'ghost'}
 */
export type SbiMenuButtonType = 'outline' | 'ghost';

/**
 * Размер кнопки с выпадающим меню
 * @type {'large' | 'small'}
 */
export type SbiMenuButtonSize = 'large' | 'small';

/**
 * Тип события компонента кнопки
 */
export type SbiMenuButtonEvent = () => void;

/**
 * Интерфейс событий компонента кнопки с выпадающим меню
 * @interface SbiMenuButtonEvents
 * @property {SbiMenuButtonEvent} menuOpen - Событие открытия меню
 * @property {SbiMenuButtonEvent} menuClose - Событие закрытия меню
 */
export interface SbiMenuButtonEvents {
  menuOpen: SbiMenuButtonEvent;
  menuClose: SbiMenuButtonEvent;
} 