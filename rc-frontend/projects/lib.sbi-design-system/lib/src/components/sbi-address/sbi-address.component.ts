import { Component, Inject, InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { SbiDropdownComponent } from '../sbi-dropdown/sbi-dropdown.component';
import {  finalize, Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SelectableItem } from '../../models/selectable-item';
import { SbiAddressBase } from './sbi-address.model';
import { SbiBaseAddressSearchComponent } from '../../classes/sbi-base-address-search.component';


export const SBI_ADDRESS_API_SERVICE = new InjectionToken<SbiAddressService<SbiAddressBase>>(
  'Обязательный сервис для работы SbiAddressComponent'
);

export abstract class SbiAddressService<T extends SbiAddressBase> {
  /**
   * 
   * @param query 
   */
  abstract searchAddress(query: string): Observable<SelectableItem<T>[]>;
}


/**
 * Компонент поиска адреса с функцией автозаполнения.
 *
 * Предоставляет поле ввода с выпадающим списком опций и возможностью фильтрации.
 *
 * @Component
 * @selector: 'sbi-address'
 * @standalone: true
 * @templateUrl: './sbi-address.component.html'
 * @styleUrls: ['./sbi-address.component.scss']
 */
@Component({
  selector: 'sbi-address',
  standalone: true,
  imports: [
    SbiDropdownComponent,
    AsyncPipe,
  ],
  templateUrl: './sbi-address.component.html',
  styleUrl: './sbi-address.component.scss',
})
export class SbiAddressComponent<T extends SbiAddressBase> extends SbiBaseAddressSearchComponent<T> implements OnInit, OnDestroy {

  constructor(
    @Inject(SBI_ADDRESS_API_SERVICE) private addressService: SbiAddressService<T>
  ) {
    super()
  }

  public addressDisplay(elem: string | null | T): string {
    if (!elem) return '';
    return typeof elem === 'string' ? elem : elem.shortAddressText;
  }

  _load(query: string): void {
    this.isLoading = true;
    this.suggestions$ = this.addressService.searchAddress(query).pipe(
      finalize(() => this.isLoading = false),
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
