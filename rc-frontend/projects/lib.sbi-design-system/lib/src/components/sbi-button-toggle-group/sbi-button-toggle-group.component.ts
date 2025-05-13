import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgForOf } from '@angular/common';
import { SbiButtonToggleGroupSize, SbiToggleButton } from './sbi-button-toggle-group.models';

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
   * @public
   * @description Форм-контроль для управления состоянием выбранной радио-кнопки.
   * @type {FormControl<T | null>}
   */
  @Input() public control!: FormControl<T | null>;

  /**
   * @public
   * @description Выбранная кнопка. Используется в том случае, если не предполагается использовать передача control-а.
   * @type {T | undefined}
   * @defaultValue undefined
   */
  @Input() public selectedValue?: T;

  /**
   * @public
   * @description Список кнопок.
   * @type {Array<SbiToggleButton<T>>}
   * @defaultValue []
   */
  @Input() public buttons: Array<SbiToggleButton<T>> = [];

  /**
   * @public
   * @description Заблокировать элемент целиком (все кнопки).
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public disabled: boolean = false;

  /**
   * @public
   * @description Размер кнопок.
   * @type {'large' | 'small' | 'mini'}
   * @defaultValue 'large'
   */
  @Input() public size: SbiButtonToggleGroupSize = 'large';

  /**
   * @public
   * @experimental
   * @description Горизонтальное или вертикальное расположение кнопок (по умолчанию горизонтальное).
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public isVertical: boolean = false;

  /**
   * @public
   * @description Функция, помогающая выделить кнопку. Сопоставляет значение в control и в списке кнопок.
   * @type {string}
   * @defaultValue (elem1, elem2) => JSON.stringify(elem1) === JSON.stringify(elem2)
   */
  @Input() public compareFn: (elem1: T, elem2: T) => boolean = (elem1, elem2) =>
    JSON.stringify(elem1) === JSON.stringify(elem2);

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-button-toggle-group'
   */
  @Input() public testId: string = 'sbi-button-toggle-group';

  /**
   * @public
   * @description Событие изменения активной кнопки.
   * @type {EventEmitter<SbiToggleButton<T>>}
   */
  @Output() public onChangeEvent: EventEmitter<SbiToggleButton<T>> = new EventEmitter<SbiToggleButton<T>>();

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
   * @description Обрабатывает клик на кнопку (если disabled !== true && button.disabled !== true).
   * Вызывает событие `onChangeEvent` с выбранной кнопкой.
   * @param {SbiToggleButton<T>} button - Кнопка, на которую кликнули.
   */
  public onButtonChange(button: SbiToggleButton<T>) {
    if (!button.disabled && !this.disabled) {
      this.control.setValue(button.value);
      this.onChangeEvent.emit(button);
    }
  }

  /**
   * @description Функция, проверяющая выбрана кнопка или нет.
   * @param {T} value - Значение кнопки, которую проверяем на выбранность.
   */
  public buttonToggleIsChecked(value: T) {
    if (this.control.value == null) {
      return false;
    }
    return this.compareFn(value, this.control.value);
  }
}
