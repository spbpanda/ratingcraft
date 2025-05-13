import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SbiComponentWithInput } from './sbi-component-with-input.component';
import { SbiSelectableItem } from '../models/sbi-selectable-item';
import { CHEVRON_DOWN_OUTLINE } from '../const/icons';

/**
 * Абстрактный класс, предоставляющий интерфейс для компонентов с выпадающим списком.
 *
 * @abstract
 * @Component
 *
 * @template: ``
 * */
@Component({
  template: ``
})
export abstract class SbiComponentWithOptions<T> extends SbiComponentWithInput<T> {
  /**
   * @public
   * @getter
   * @description Возвращает иконку шеврона (индикации открытости\закрытости выпадающего списка).
   * @return {string}
   */
  public get chevronIcon(): string {
    return CHEVRON_DOWN_OUTLINE;
  }

  /**
   * @public
   * @description Флаг, обозначающий наличие недоступных опций для выбора.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public hasDisabledOptions: boolean = false;

  /**
   * @public
   * @description Список опций, доступных для выбора.
   * @type {Array<SbiSelectableItem<T>> | null}
   * @defaultValue []
   */
  @Input() public options: Array<SbiSelectableItem<T>> | null = [];

  /**
   * @public
   * @description Событие выбора опции из списка.
   * @type {EventEmitter<T>}
   */
  @Output() public selectionChange: EventEmitter<T> = new EventEmitter<T>();

  /**
   * @public
   * @description Определяет заблокирована опция для выбора или нет.
   * @param {SbiSelectableItem<T>} option
   * @return boolean
   */
  public isDisabledOption(option: SbiSelectableItem<T>) {
    if (!this.hasDisabledOptions) {
      return false;
    }
    return Boolean((option as any).disabled);
  }
}
