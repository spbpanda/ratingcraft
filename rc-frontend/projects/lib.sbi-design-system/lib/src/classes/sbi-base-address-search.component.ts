import { Component, Input, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, map, Observable, of, startWith, Subject, takeUntil } from 'rxjs';
import { SbiSelectableItem } from '../models/sbi-selectable-item';
import { SBI_ADDRESS_VALIDATION_ERRORS } from '../const/sbi-address-validation-errors.const';

/**
 * Абстрактный компонент адреса. Служит базовым классом для всех компонентов ввода адресе, которые берут данные из дадаты.
 *
 * Принимает ng-content для отображения контента.
 *
 * @abstract
 * @Component
 * @template: ``
 */
@Component({
  template: ``,
})
export abstract class SbiBaseAddressSearchComponent<T> implements OnInit, OnDestroy {
  /**
   * @protected
   * @description Параметр, служащий для отписки от потоков при уничтожении компонента.
   * @type {Subject<void>}
   */
  protected readonly _unsubscribe$: Subject<void> = new Subject<void>();

  /**
   * @protected
   * @abstract
   * @description Метод получения данных из дадаты.
   * @param {string} query
   * @return {void}
   */
  protected abstract _load(query: string): void;

  /**
   * @protected
   * @abstract
   * @description Метод преобразования значения из поля ввода адреса в человеко-читаемую строку, для отображения пользователю.
   * @param {string | null | T} elem
   * @return {string}
   */
  protected abstract addressDisplay(elem: string | null | T): string;

  /**
   * @public
   * @description Название.
   * @type {string}
   * @defaultValue 'Адрес'
   */
  @Input()
  public label: string = 'Адрес';

  /**
   * @public
   * @description Форм контрол.
   * @type {FormControl<T | string | null>}
   */
  @Input({ required: true })
  public control!: FormControl<T | string | null>;

  /**
   * @public
   * @description Кастомные наименования ошибок.
   * @type {Record<string, string>}
   * @defaultValue SBI_ADDRESS_VALIDATION_ERRORS
   */
  @Input()
  public validationErrors: Record<string, string> = SBI_ADDRESS_VALIDATION_ERRORS;

  /**
   * @public
   * @description Состояние индикатора загрузки.
   * @type {WritableSignal<boolean>}
   */
  public readonly isLoading: WritableSignal<boolean> = signal(false);


  /**
   * @public
   * @type {Observable<Array<SbiSelectableItem<T>>>}
   * @description Доступные для выбора адреса (полученные из дадаты).
   */
  public suggestions$: Observable<Array<SbiSelectableItem<T>>> = of([]);

  public ngOnInit(): void {
    this.connectChangeControl();
  }

  /**
   * @private
   * @description Обработка изменения значения control и запрос данных из дадаты.
   */
  private connectChangeControl() {
    this.control.valueChanges
      .pipe(
        takeUntil(this._unsubscribe$),
        debounceTime(300),
        startWith(this.control.value),
        map(query => typeof query === 'string' ? query : null),
        filter(query => !!query)
      ).subscribe(query => this._load(query!));
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}


