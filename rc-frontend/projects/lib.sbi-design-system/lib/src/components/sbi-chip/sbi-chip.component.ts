import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { NgClass, NgIf } from '@angular/common';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { BUTTON_CROSS } from '../../const/icons';

/**
 * Компонент для отображения элемента-чипа.
 *
 * Поддерживает состояния выбора, отключения, ошибки, а также возможность удаления элемента.
 * Может содержать дополнительный контент через <ng-content> с селекторами "prefix" и "suffix".
 *
 * @Component
 * @selector: 'sbi-chip'
 * @standalone: true
 * @imports: [MatChip, NgIf, SbiIconComponent, NgClass]
 * @templateUrl: './sbi-text-list.component.html'
 * @styleUrls: ['sbi-text-list.component.scss']
 */
@Component({
  selector: 'sbi-chip',
  templateUrl: './sbi-chip.component.html',
  styleUrls: ['sbi-chip.component.scss'],
  standalone: true,
  imports: [MatChip, NgIf, SbiIconComponent, NgClass],
})
export class SbiChipComponent<T> {
  /**
   * @public
   * @getter
   * @description Возвращает SVG иконку для удаления элемента.
   * @returns {string} SVG строка иконки удаления.
   */
  public get clearIcon(): string {
    return BUTTON_CROSS;
  }

  /**
   * @public
   * @description Флаг, указывающий на состояние ошибки чипа.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public invalid: boolean = false;

  /**
   * @public
   * @description Флаг, указывающий, отключен ли чип.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public disabled: boolean = false;

  /**
   * @public
   * @description Флаг, указывающий, выбран ли чип.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public selected: boolean = false;

  /**
   * @public
   * @description Текстовая метка, отображаемая в чипе.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public label?: string;

  /**
   * @public
   * @description Флаг, указывающий, отображать ли иконку для удаления элемента.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public showClearIcon: boolean = true;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-chip'
   */
  @Input() public testId: string = 'sbi-chip';

  /**
   * @public
   * @description Событие, которое срабатывает при клике на иконку удаления элемента.
   * @type {EventEmitter<Event>}
   */
  @Output() public clearChipEvent: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * @public
   * @description Событие, которое срабатывает при клике на чип.
   * @type {EventEmitter<Event>}
   */
  @Output() public clickChipEvent: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * @public
   * @description Обрабатывает клик на иконку удаления элемента.
   * Вызывает событие `clearChipEvent` если чип не отключен.
   * @param {Event} event - Событие клика.
   */
  public onClearChip(event: Event) {
    !this.disabled && this.clearChipEvent.emit(event);
  }

  /**
   * @public
   * @description Обрабатывает клик на чип.
   * Вызывает событие `clickChipEvent` если чип не отключен.
   * @param {Event} event - Событие клика.
   */
  public onChipClick(event: Event) {
    !this.disabled && this.clickChipEvent.emit(event);
  }
}
