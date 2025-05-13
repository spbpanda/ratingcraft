import { Component, inject, Input, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { SbiDropdownComponent } from '../sbi-dropdown/sbi-dropdown.component';
import { debounceTime, filter, finalize, map, Observable, of, startWith, Subject, takeUntil, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SbiSelectableItem } from '../../models/sbi-selectable-item';
import { FormControl } from '@angular/forms';
import { SbiProgressSpinnerComponent } from '../sbi-progress-spinner/sbi-progress-spinner.component';
import { MaskitoOptions } from '@maskito/core';
import { SbiInputMode, SbiInputType } from '../sbi-input/sbi-input.models';
import { SbiSuggestService } from './sbi-suggest-search.service';
import { distinctUntilChanged } from 'rxjs/operators';

/**
 * Универсальный компонент выпадающего списка, который автоматически взаимодействует с дадатой.
 *
 * Предоставляет поле ввода с выпадающим списком опций и возможностью фильтрации.
 *
 * @Component
 * @selector: 'sbi-suggestion'
 * @standalone: true
 * @imports: [SbiDropdownComponent, AsyncPipe, SbiProgressSpinnerComponent]
 * @templateUrl: './sbi-suggest-search.component.html'
 * @styleUrl: './sbi-suggest-search.component.scss'
 * @providers: [SbiSuggestService]
 */
@Component({
  selector: 'sbi-suggestion',
  standalone: true,
  imports: [SbiDropdownComponent, AsyncPipe, SbiProgressSpinnerComponent],
  templateUrl: './sbi-suggest-search.component.html',
  styleUrl: './sbi-suggest-search.component.scss',
  providers: [SbiSuggestService]
})
export class SbiSuggestSearchComponent<T extends object> implements OnInit, OnDestroy {
  /**
   * @private
   * @readonly
   * @description Параметр, служащий для отписки от потоков при уничтожении компонента.
   * @type {Subject<void>}
   */
  private readonly _unsubscribe$: Subject<void> = new Subject<void>();

  /**
   * @private
   * @readonly
   * @description Экземпляр сервиса запросов в дадату.
   * @type {SbiSuggestService<T>}
   */
  private readonly suggestService: SbiSuggestService<T> = inject(SbiSuggestService<T>)

  /**
   * @public
   * @description Название.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public label: string = '';

  /**
   * @public
   * @description Placeholder поля.
   * @type {string}
   * @defaultValue 'Адрес'
   */
  @Input() public placeholder: string = '';

  /**
   * @public
   * @description Маска ввода.
   * @type {MaskitoOptions}
   * @defaultValue { mask: /\.* / }
   */
  @Input() public mask: MaskitoOptions = { mask: /\.*/ };

  /**
   * @public
   * @description Тип поля ввода.
   * @type {'text' | 'number' | 'boolean'}
   * @defaultValue 'text'
   */
  @Input() public inputType: SbiInputType = 'text';

  /**
   * @public
   * @description Тип клавиатуры, отображаемый на мобильном устройстве.
   * @type {'text' | 'numeric' | 'tel' | 'email'}
   * @defaultValue 'text'
   */
  @Input() public inputMode: SbiInputMode = 'text';

  /**
   * @public
   * @description Флаг активации расширенного преобразования текста в верхний регистр.
   * Преобразует первую букву каждого слова в верхний регистр
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public inputMultiUppercaseActive: boolean = false;

  /**
   * @public
   * @description Флаг, определяющий, нужно ли показывать иконку стрелки (шеврон) для выпадающего списка.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public showChevron: boolean = false;

  /**
   * @public
   * @description Флаг, обозначающий наличие недоступных опций для выбора.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public hasDisabledOptions: boolean = false;

  /**
   * @public
   * @description Форм контрол.
   * @type {FormControl<T | string | null>}
   */
  @Input({ required: true }) public control!: FormControl<T | string | null>;

  /**
   * @public
   * @description Кастомные наименования ошибок.
   * @type {Record<string, string>}
   * @defaultValue {}
   */
  @Input() public validationErrors: Record<string, string> = {};

  /**
   * @public
   * @description Наименование поля для отображения выбранного значения.
   * @type {keyof T | undefined}
   * @defaultValue undefined
   */
  @Input() public displayParamName?: keyof T;

  /**
   * @public
   * @description Кастомная функция отображения значения.
   * @type {undefined | (elem: string | null | T) => string}
   * @defaultValue undefined
   */
  @Input() displayFunc?: (elem: string | null | T) => string;

  /**
   * @public
   * @description Тип поля поиска (должен совпадать с типом указанным в SBI_SUGGEST_CONFIG).
   * @type {string}
   * @defaultValue ''
   */
  @Input() public searchType: string = '';

  /**
   * @public
   * @description Флаг, обозначающий отображение индикатора загрузки.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public showProgressIndicator: boolean = false;

  /**
   * @public
   * @description Флаг, обозначающий удаление спец символов.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public dropSpecialCharacters: boolean = false;

  /**
   * @public
   * @description Идентификатор для авто тестов.
   * @type {string}
   * @defaultValue 'sbi-suggestion'
   */
  @Input() public testId: string = 'sbi-suggestion';

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
        distinctUntilChanged(),
        debounceTime(300),
        startWith(this.control.value),
        map(query => typeof query === 'string' ? query : null),
        filter(query => !!query)
      ).subscribe(query => this.load(query!));
  }

  /**
   * @public
   * @description Список опций для выбора.
   * @type {Observable<Array<SbiSelectableItem<T>>>}
   * @defaultValue of([])
   */
  public suggestions$: Observable<Array<SbiSelectableItem<T>>> = of([]);

  /**
   * @public
   * @description Состояние индикатора загрузки.
   * @type {WritableSignal<boolean>}
   * @defaultValue false
   */
  public readonly isLoading: WritableSignal<boolean> = signal(false);

  /**
   * @public
   * @description Создаёт экземпляр функции для отображения человеко читаемой строки.
   * @return {(elem: string | null | T) => string}
   */
  public displayFnInstance(): (elem: string | null | T) => string {
    return (elem: string | null | T) => this.displayFn(elem);
  }

  /**
   * @private
   * @description Преобразует значение из поля ввода адреса в строковое значение для отображения пользователю.
   * @param {string | null | T} elem - значение из поля ввода адреса.
   * @returns {string}
   */
  private displayFn(elem: string | null | T): string {
    if (this.displayFunc) return this.displayFunc(elem);
    if (!elem) return '';
    if (typeof elem === 'string') return elem;
    if (!this.displayParamName) {
      console.warn('Не задан параметр отображения для объекта!');
      return JSON.stringify(elem);
    }
    return (elem as any)[this.displayParamName] as string;
  }

  /**
   * @private
   * @description Вызывается при ввода пользователем строкового значения в поле ввода адреса и ищет значения в дадате.
   * @param {string} query - строковое из поля ввода адреса (параметр для поиска в дадате).
   * @returns {void}
   */
  private load(query: string): void {
    this.isLoading.set(true);
    this.suggestions$ = this.suggestService.getSuggestions(query, this.searchType).pipe(
      finalize(() => this.isLoading.set(false)),
      tap((suggestions) => {
        const match = suggestions.find(address => address.viewValue === query);
        if (match) {
          this.control.setValue(match.value);
        } else {
          this.control.setErrors({ manualEnter: true });
          this.control.markAsTouched();
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
