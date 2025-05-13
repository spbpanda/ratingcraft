import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbiChipComponent } from '../sbi-chip/sbi-chip.component';


/**
 * Chip row - Компонент, отображаемый список chip-ов.
 *
 * Принимает несколько ng-content для отображения контента:
 * 1. in-chip-row - контент отображаемый в блоке chip-ов, после всех элементов;
 * 2. under-chip-row - контент отображаемый после блока chip-ов.
 *
 * @Component
 * @selector: 'sbi-chip-row'
 * @standalone: true
 * @imports: [SbiChipComponent]
 * @templateUrl: './sbi-chip-row.component.html'
 * @styleUrls: ['sbi-chip-row.component.scss'],
 *  */
@Component({
  selector: 'sbi-chip-row',
  templateUrl: './sbi-chip-row.component.html',
  styleUrls: ['sbi-chip-row.component.scss'],
  standalone: true,
  imports: [SbiChipComponent],
})
export class SbiChipRowComponent<T> implements OnInit, OnChanges {
  /**
   * @public
   * @description HTML элемент списка chip-ов из DOM-а.
   * @type {ElementRef<HTMLDivElement>}
   */
  @ViewChild('sbiChipRow') public sbiChipRow!: ElementRef<HTMLDivElement>;

  /**
   * @public
   * @description Форм контрол.
   * @type {FormControl<Array<T> | null>}
   */
  @Input() public control!: FormControl<Array<T> | null>;

  /**
   * @public
   * @description Значение списка chip-ов. Используется, если не планируется передавать control.
   * @type {Array<T>}
   * @defaultValue undefined
   */
  @Input() public value?: Array<T>;

  /**
   * @public
   * @description Список выбранных chip-ов.
   * @type {Array<T>}
   * @defaultValue []
   */
  @Input() public selectedChips: Array<T> = [];

  /**
   * @public
   * @description Функция преобразования значения chip-а в человеко читаемый виж.
   * @type {(value: T) => string}
   * @defaultValue value => JSON.stringify(value)
   */
  @Input() public displayFn: (value: T) => string = (value): string => JSON.stringify(value);

  /**
   * @public
   * @description Функция сравнения двух элементов.
   * @type {(elem1: T, elem2: T) => boolean}
   * @defaultValue (elem1, elem2) => JSON.stringify(elem1) === JSON.stringify(elem2)
   */
  @Input() public compareFn: (elem1: T, elem2: T) => boolean = (elem1, elem2): boolean =>
    JSON.stringify(elem1) === JSON.stringify(elem2);

  /**
   * @public
   * @description Флаг, указывающий возможность элемента для взаимодействия.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public disabled: boolean = false;

  /**
   * @public
   * @description Флаг, указывающий, отображать ли иконку для удаления элемента.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public chipShowClearIcon: boolean = true;

  /**
   * @public
   * @description Идентификатор для авто тестов.
   * @type {string}
   * @defaultValue sbi-chip-row
   */
  @Input() public testId: string = 'sbi-chip-row';

  /**
   * @public
   * @description Событие нажатия на удаление чипа (нажатие на крестик).
   * @type {EventEmitter<Event>}
   */
  @Output() public clearChipEvent: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * @public
   * @description Событие нажатия на чип (нажатие на элемент chip-a).
   * @type {EventEmitter<T>}
   */
  @Output() public clickChipEvent: EventEmitter<T> = new EventEmitter<T>();

  /**
   * @public
   * @description Событие удаления чипа. Возвращает удалённый элемент.
   * @type {EventEmitter<T>}
   */
  @Output() public removeChipEvent: EventEmitter<T> = new EventEmitter<T>();

  ngOnInit() {
    if (this.value) {
      this.control = new FormControl(this.value);
    }
    if (this.disabled && this.control) {
      this.control.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.control = new FormControl(changes['value'].currentValue);
    }
    if (Object.prototype.hasOwnProperty.call(changes, 'disabled')) {
      if (changes['disabled'].currentValue) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    }
  }

  /**
   * @public
   * @description Обрабатывает событие удаления chip-а.
   * @param {Event} event
   * @param {T} chip
   */
  public onClearChip(event: Event, chip: T) {
    this.clearChipEvent.emit(event);
    this.removeChipEvent.emit(chip);

    const value = this.control.value ?? [];
    const newValue = value.filter(elem => !this.compareFn(elem, chip));
    this.control.setValue(newValue);
  }

  /**
   * @public
   * @description Проверяет выбран ли chip.
   * @param {T} chip
   * @return boolean
   */
  public chipIsSelected(chip: T): boolean {
    return this.selectedChips.some(elem => this.compareFn(elem, chip));
  }

  /**
   * @public
   * @description Обрабатывает событие нажатия на chip.
   * @param {T} chip
   */
  public onClickChipEvent(chip: T) {
    this.clickChipEvent.emit(chip);
  }
}
