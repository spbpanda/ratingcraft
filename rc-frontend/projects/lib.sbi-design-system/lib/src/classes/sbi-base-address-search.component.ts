import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, debounceTime, filter, Observable, of, startWith, Subject, takeUntil } from 'rxjs';
import { SelectableItem } from '../models/selectable-item';
import { SBI_ADDRESS_VALIDATION_ERRORS } from '../const/sbi-address-validation-errors.const';

@Component({
  template: ``,
})
export abstract class SbiBaseAddressSearchComponent<T> {

  /**
   * Название
  */
  @Input('label')
  public label = 'Адрес';

  /**
   * control
  */
  @Input({alias:'control', required: true})
  public control!: FormControl;

  /**
   * Кастомные наименования ошибок
   */
  @Input('validationErrors') 
  public validationErrors: Record<string, string> = SBI_ADDRESS_VALIDATION_ERRORS;

  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);
  public get isLoading(): boolean {
      return this._isLoading$.getValue();
  }
  public set isLoading(isLoading: boolean) {
      this._isLoading$.next(isLoading);
  }

  public suggestions$: Observable<Array<SelectableItem<T>>> = of([]);

  protected readonly _unsubscribe$ = new Subject<void>();

  protected abstract _load(query: string): void;

  protected abstract addressDisplay(elem: string | null | T): string;

  constructor() {}

  public ngOnInit(): void {
    this.control.valueChanges
      .pipe(takeUntil(this._unsubscribe$))
      .pipe(debounceTime(300))
      .pipe(startWith(this.control.value))
      .pipe(filter((query) => query && typeof query === 'string'))
      .subscribe((query: string) => this._load(query));
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}


