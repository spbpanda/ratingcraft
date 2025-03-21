import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { NgClass, NgIf } from '@angular/common';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { CLEAR_ICON_SVG } from '../../const/icons';

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
 * @templateUrl: './sbi-chip.component.html'
 * @styleUrls: ['sbi-chip.component.scss']
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
   * Возвращает SVG иконку для удаления элемента.
   * @returns {string} SVG строка иконки удаления.
   */
  public get clearIcon() {
    return CLEAR_ICON_SVG;
  }

  /**
   * Флаг, указывающий на состояние ошибки чипа.
   * @type {boolean}
   */
  @Input() invalid = false;

  /**
   * Флаг, указывающий, отключен ли чип.
   * @type {boolean}
   */
  @Input() disabled = false;

  /**
   * Флаг, указывающий, выбран ли чип.
   * @type {boolean}
   */
  @Input() selected = false;

  /**
   * Текстовая метка, отображаемая в чипе.
   * @type {string | undefined}
   */
  @Input() label?: string;

  /**
   * Флаг, указывающий, отображать ли иконку для удаления элемента.
   * @type {boolean}
   */
  @Input() showClearIcon = true;

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId = 'sbi-chip';

  /**
   * Событие, которое срабатывает при клике на иконку удаления элемента.
   * @type {EventEmitter<Event>}
   */
  @Output() clearChipEvent = new EventEmitter<Event>();

  /**
   * Событие, которое срабатывает при клике на чип.
   * @type {EventEmitter<Event>}
   */
  @Output() clickChipEvent = new EventEmitter<Event>();

  /**
   * Обрабатывает клик на иконку удаления элемента.
   * Вызывает событие `clearChipEvent` если чип не отключен.
   * @param {Event} event - Событие клика.
   */
  onClearChip(event: Event) {
    !this.disabled && this.clearChipEvent.emit(event);
  }

  /**
   * Обрабатывает клик на чип.
   * Вызывает событие `clickChipEvent` если чип не отключен.
   * @param {Event} event - Событие клика.
   */
  onChipClick(event: Event) {
    !this.disabled && this.clickChipEvent.emit(event);
  }
}
