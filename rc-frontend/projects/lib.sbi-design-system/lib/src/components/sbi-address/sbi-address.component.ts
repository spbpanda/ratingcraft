import { Component, Inject, InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { SbiDropdownComponent } from '../sbi-dropdown/sbi-dropdown.component';
import { finalize, Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SbiSelectableItem } from '../../models/sbi-selectable-item';
import { SbiAddressBase } from '../../models/sbi-da-data-models';
import { SbiBaseAddressSearchComponent } from '../../classes/sbi-base-address-search.component';


export const SBI_ADDRESS_API_SERVICE = new InjectionToken<SbiAddressService<SbiAddressBase>>(
  'Обязательный сервис для работы SbiAddressComponent'
);

export abstract class SbiAddressService<T extends SbiAddressBase> {
  /**
   *
   * @param query
   */
  abstract searchAddress(query: string): Observable<SbiSelectableItem<T>[]>;
}


/**
 * Компонент поиска адреса с функцией автозаполнения.
 *
 * Предоставляет поле ввода с выпадающим списком опций и возможностью фильтрации.
 *
 * @Component
 * @selector: 'sbi-address'
 * @standalone: true
 * @import imports: [SbiDropdownComponent, AsyncPipe],
 * @templateUrl: './sbi-address.component.html'
 * @styleUrls: ['./sbi-address.component.scss']
 */
@Component({
  selector: 'sbi-address',
  standalone: true,
  imports: [SbiDropdownComponent, AsyncPipe],
  templateUrl: './sbi-address.component.html',
  styleUrl: './sbi-address.component.scss',
})
export class SbiAddressComponent<T extends SbiAddressBase> extends SbiBaseAddressSearchComponent<T> implements OnInit, OnDestroy {

  constructor(@Inject(SBI_ADDRESS_API_SERVICE) private addressService: SbiAddressService<T>) {
    super()
  }

  /**
   * @public
   * @description Преобразует значение из поля ввода адреса в строковое значение для отображения пользователю.
   * @param {string | null | T} elem - значение из поля ввода адреса.
   * @returns {string}
   */
  public addressDisplay(elem: string | null | T): string {
    if (!elem) return '';
    return typeof elem === 'string' ? elem : elem.shortAddressText;
  }

  /**
   * @protected
   * @description Вызывается при ввода пользователем строкового значения в поле ввода адреса и ищет значения в дадате.
   * @param {string} query - строковое из поля ввода адреса (параметр для поиска в дадате).
   * @returns {void}
   */
  _load(query: string): void {
    this.isLoading.set(true);
    this.suggestions$ = this.addressService.searchAddress(query).pipe(
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

}
