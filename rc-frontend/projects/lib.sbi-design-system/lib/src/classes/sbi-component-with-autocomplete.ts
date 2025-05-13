import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { SbiComponentWithOptions } from './sbi-component-with-options';
import { PrefixIconType, SuffixIconType } from '../components/sbi-input/sbi-input.models';
import { MaskitoOptions } from '@maskito/core';
import { BUTTON_CROSS } from '../const/icons';
import { BehaviorSubject, Subject } from 'rxjs';
import { SbiSelectableItem } from '../models/sbi-selectable-item';
import { SbiIsEqual } from '../utils/sbi-check-equal/sbi-check-equal-objects';

/**
 * Абстрактный класс, предоставляющий интерфейс для компонентов с autocomplete-ом.
 *
 * @abstract
 * @Component
 *
 * @template: ``
 * */
@Component({
  template: ``,
})
export abstract class SbiComponentWithAutocomplete<T> extends SbiComponentWithOptions<T> implements OnChanges, OnDestroy {
  /**
   * @protected
   * @description Параметр, служащий для отписки от потоков при уничтожении компонента.
   * @type {Subject<boolean>}
   */
  protected destroy$: Subject<boolean> = new Subject<boolean>();

  /**
   * @public
   * @getter
   * @description Возвращает иконку очистки данных.
   * @return {string}
   */
  public get clearIcon(): string {
    return BUTTON_CROSS;
  }

  /**
   * @public
   * @description Функция определяет, как отображать выбранное значение в поле ввода после выбора опции из выпадающего списка.
   * @type {(arg: T) => string}
   * @defaultValue defaultDisplayFunc
   */
  @Input() public displayFunc: (arg: T) => string;

  /**
   * @public
   * @description Функция сравнения равенства двух объектов.
   * @type {(elem1: T, elem2: T) => boolean}
   * @defaultValue (elem1, elem2) => JSON.stringify(elem1) === JSON.stringify(elem2)
   */
  @Input() public compareFn: (elem1: T, elem2: T) => boolean;

  /**
   * @public
   * @description Флаг, обозначающий использование кастомной функции фильтрации.
   * При значении true не используется функция фильтрации, описанная в компоненте.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public customFilterVoid: boolean = false;

  /**
   * @public
   * @description Тип иконки, отображаемой в matSuffix.
   * - clear - зашитая иконка крестика;
   * - custom - передача иконки через ng-content.
   * @type {SuffixIconType}
   * @defaultValue 'clear'
   */
  @Input() public suffixIconType: SuffixIconType = 'clear';

  /**
   * @public
   * @description Тип иконки, отображаемой в matPrefix.
   * - search - зашитая иконка лупы;
   * - custom - передача иконки через ng-content;
   * - none - скрытие контейнера matPrefix.
   * @type {PrefixIconType}
   * @defaultValue 'none'
   */
  @Input() public prefixIconType: PrefixIconType = 'none';

  /**
   * @public
   * @description Флаг, обозначающий наличие недоступных опций для выбора.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public inputUppercaseActive: boolean = false;

  /**
   * @public
   * @description Флаг, указывающий активна ли конвертация первой буквы в верхний регистр.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public inputTitleCaseActive: boolean = false;

  /**
   * @public
   * @description Маска ввода.
   * @type {MaskitoOptions}
   * @defaultValue { mask: /\.* / }
   */
  @Input() public mask: MaskitoOptions = { mask: /\.*/ };

  /**
   * @public
   * @description Максимально допустимая длинна ввода.
   * @type {any}
   * @defaultValue null
   */
  @Input() public maxLength: any = null;

  /**
   * @public
   * @description Событие открытия окна выбора опций.
   * @type {EventEmitter<void>}
   */
  @Output() public autoCompleteOpened: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @public
   * @description Обработка события открытия списка опций.
   */
  public onAutoCompleteOpened() {
    this.autoCompleteOpened.emit();
  }

  /**
   * @public
   * @description Обработка события выбора опции.
   */
  public onSelectionChange(val: T) {
    this.selectionChange.emit(val);
  }

  /**
   * @public
   * @description Список отфильтрованных опций. Используется, если customFilterVoid = false.
   * @type {BehaviorSubject<Array<SbiSelectableItem<T>>>}
   * @defaultValue []
   */
  public filteredOptions$: BehaviorSubject<Array<SbiSelectableItem<T>>> = new BehaviorSubject<Array<SbiSelectableItem<T>>>([]);

  public constructor() {
    super();
    this.displayFunc = this.defaultDisplayFunc;
    this.compareFn = (elem1, elem2) => JSON.stringify(elem1) === JSON.stringify(elem2);
  }

  /**
   * Функция отображения значения по умолчанию, если не передано иное.
   * Обрабатывает выбранную опцию в зависимости от типа:
   * если строка - то выбирает viewValue из интерфейса @type {SbiSelectableItem<T>};
   * если объект - приводит к строковму типу
   * @param {T | string | null} arg - значение выбранной опции.
   * @returns {string}
   */
  private defaultDisplayFunc = (arg: T | string | null): string => {
    return arg != null
      ? (typeof arg === 'string'
        ? this.options?.find(option => option.value === arg)?.viewValue || ''
        : JSON.stringify(arg))
      : '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.setNewOptionsIfNotEquals(changes['options'].currentValue);
    }
  }

  /**
   * @protected
   * @description Функция фильтрации. Используется если нужна фильтрация на стороне фронта
   * @param {null | string | T = ''} value
   */
  protected filterFunc(value: null | string | T = '') {
    if (this.customFilterVoid) {
      this.filteredOptions$.next(this.options || []);
      return;
    }
    if (!this.options) {
      this.filteredOptions$.next([]);
      return;
    }
    if (!value || typeof value === 'object') {
      this.setNewOptionsIfNotEquals(this.options);
      return;
    }
    if (typeof value === 'string') {
      const newOpts = this.options.filter(option => option.viewValue?.toLowerCase()?.includes(value.toLowerCase()));
      this.setNewOptionsIfNotEquals(newOpts);
    }
  }

  /**
   * @private
   * @async
   * @description Если список переданных опций и опций в filteredOptions$ отличается, то перезаписывает opts в filteredOptions$.
   * @param {Array<SbiSelectableItem<T>>} opts
   */
  private async setNewOptionsIfNotEquals(opts: Array<SbiSelectableItem<T>>) {
    const actualValues = this.filteredOptions$.value;
    if (actualValues.length !== opts.length) {
      this.filteredOptions$.next(opts);
      return;
    }
    if (actualValues.some((elem, idx) => !SbiIsEqual(elem, opts[idx]))) {
      this.filteredOptions$.next(opts);
    }
  }

  /**
   * @public
   * @override
   * @description Обрабатывает событие очистки значения.
   * @param {Event} event
   */
  public override onClearControl(event: Event) {
    this.clearControl.emit(event);
  }

  /**
   * @public
   * @description Функция, используемая для @for в шаблоне.
   * @param {number} index
   * @param {any} item
   * @return {number}
   */
  public trackByFn(index: number, item: any): number {
    return index;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
