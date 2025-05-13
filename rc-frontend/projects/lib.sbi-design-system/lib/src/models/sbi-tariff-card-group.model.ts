import { TemplateRef } from '@angular/core';
import { SbiBadgeSize, SbiBadgeType } from '../components/sbi-badge/sbi-badge.models';
import { SbiTextListElement } from '../components/sbi-text-list/sbi-text-list.models';

/**
 * Интерфейс для элементов списка в тарифной карточке
 * Расширяет интерфейс SbiTextList для обеспечения совместимости
 */
export interface SbiTariffCardListItem extends SbiTextListElement {
  iconState?: 'active' | 'inactive';
}

export interface SbiTariffCard {
  /**
   * Уникальный идентификатор тарифной карточки
   */
  id: string;

  /**
   * Заголовок тарифной карточки
   */
  title: string;

  /**
   * Цена тарифа
   */
  price: string;

  /**
   * Период тарифа (например, "/ в месяц", "/ в год")
   */
  period: string;

  /**
   * Список элементов для отображения в тарифе
   */
  list: Array<SbiTariffCardListItem>;

  /**
   * Текст для отображения в бейдже
   */
  badgeContent?: string;

  /**
   * Тип отображаемого бейджа
   */
  badgeType?: SbiBadgeType;

  /**
   * Размер отображаемого бейджа
   */
  badgeSize?: SbiBadgeSize;

  /**
   * Наполнение tooltip-а
   */
  tooltipContent?: string | TemplateRef<any> | null;

  /**
   * Расположение отображаемого tooltip
   */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Тип тарифной карточки
   */
  type?: 'simple' | 'premium';
}
