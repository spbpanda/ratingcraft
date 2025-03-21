import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgForOf } from '@angular/common';
import { ToggleButton } from '../../models/toggle-button';

/**
 * Button Toggle Group — это элемент интерфейса, который позволяет пользователю выбирать одну опцию из группы кнопок.
 * Каждая кнопка в группе работает как переключатель: при нажатии она активируется, а остальные деактивируются.
 * Этот компонент часто используется для фильтрации, выбора режимов или настройки параметров, где требуется выбор из
 * ограниченного набора опций.
 *
 * @Component
 * @selector: 'sbi-button-toggle-group'
 * @standalone: true
 * @imports: [MatButtonToggle, MatButtonToggleGroup, ReactiveFormsModule, NgForOf, NgClass]
 * @templateUrl: './sbi-button-toggle-group.component.html'
 * @styleUrl: './sbi-button-toggle-group.component.scss'
 */
@Component({
  selector: 'sbi-button-toggle-group',
  templateUrl: './sbi-button-toggle-group.component.html',
  styleUrls: ['./sbi-button-toggle-group.component.scss'],
  standalone: true,
  imports: [MatButtonToggle, MatButtonToggleGroup, ReactiveFormsModule, NgForOf, NgClass],
})
export class SbiButtonToggleGroupComponent<T> implements OnInit, OnChanges {
  /**
   * Форм-контроль для управления состоянием выбранной радио-кнопки.
   * @type {FormControl<T | null>}
   */
  @Input() control!: FormControl<T | null>;

  /**
   * Выбранная кнопка. Используется в том случае, если не предполагается использовать передача control-а.
   * @type {T | undefined}
   */
  @Input() selectedValue?: T;

  /**
   * Список кнопок.
   * @type {ToggleButton<T>[]}
   */
  @Input() buttons: ToggleButton<T>[] = [];

  /**
   * Заблокировать элемент целиком (все кнопки).
   * @type {boolean}
   */
  @Input() disabled = false;

  /**
   * Размер кнопок
   * @type {'large' | 'small' | 'mini'}
   */
  @Input() size: 'large' | 'small' | 'mini' = 'large';

  /**
   * Горизонтальное или вертикальное расположение кнопок (по умолчанию горизонтальное).
   * @type {boolean}
   */
  @Input() isVertical = false;

  /**
   * Функция, помогающая выделить кнопку. Сопоставляет значение в control и в списке кнопок.
   * @type {string}
   */
  @Input() compareFn: (elem1: T, elem2: T) => boolean = (elem1, elem2) =>
    JSON.stringify(elem1) === JSON.stringify(elem2);

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId = 'sbi-button-toggle-group';

  /**
   * Событие изменения активной кнопки.
   * @type {EventEmitter<ToggleButton<T>>}
   */
  @Output() onChangeEvent = new EventEmitter<ToggleButton<T>>();

  ngOnInit() {
    if (this.selectedValue !== undefined) {
      this.control = new FormControl<T>(this.selectedValue);
    }
    if (this.disabled) {
      this.control?.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Object.prototype.hasOwnProperty.call(changes, 'disabled')) {
      if (changes['disabled'].currentValue) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    }
  }

  /**
   * Обрабатывает клик на кнопку (если disabled !== true && button.disabled !== true).
   * Вызывает событие `onChangeEvent` с выбранной кнопкой.
   * @param {ToggleButton<T>} button - Кнопка, на которую кликнули.
   */
  public onButtonChange(button: ToggleButton<T>) {
    if (!button.disabled && !this.disabled) {
      this.control.setValue(button.value);
      this.onChangeEvent.emit(button);
    }
  }

  /**
   * Функция, проверяющая выбрана кнопка или нет.
   * @param {T} value - Значение кнопки, которую проверяем на выбранность.
   */
  public buttonToggleIsChecked(value: T) {
    if (!this.control.value) {
      return false;
    }
    return this.compareFn(value, this.control.value);
  }
}
