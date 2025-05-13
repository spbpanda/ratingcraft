import { Component, Inject, InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { SbiDropdownComponent } from '../sbi-dropdown/sbi-dropdown.component';
import { finalize, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SbiAddressConfig, SbiDaDataAddress } from './sbi-dadata-address.model';
import { SbiDadataAddressService } from './sbi-dadata-address.service';
import { SbiBaseAddressSearchComponent } from '../../classes/sbi-base-address-search.component';

// Создаем токен с типом нашего конфига
export const SBI_ADDRESS_CONFIG = new InjectionToken<SbiAddressConfig>('Конфигурация для компонента поиска адреса');

/**
 * Компонент ввода адреса с уже реализованным сервисом обращений к дадате.
 *
 * @Component
 * @selector: 'sbi-dadata-address',
 * @standalone: true,
 * @imports: [SbiDropdownComponent, AsyncPipe],
 * @templateUrl: './sbi-dadata-address.component.html',
 * @styleUrl: './sbi-dadata-address.component.scss',
 * @providers: [SbiDadataAddressService]
 *  */
@Component({
  selector: 'sbi-dadata-address',
  standalone: true,
  imports: [SbiDropdownComponent, AsyncPipe],
  templateUrl: './sbi-dadata-address.component.html',
  styleUrl: './sbi-dadata-address.component.scss',
  providers: [SbiDadataAddressService]
})
export class SbiDadataAddressComponent extends SbiBaseAddressSearchComponent<SbiDaDataAddress> implements OnInit, OnDestroy {
  constructor(
    @Inject(SBI_ADDRESS_CONFIG) private addressConfig: SbiAddressConfig,
    private addressService: SbiDadataAddressService,
  ) {
    super()
    this.addressService.api = this.addressConfig.apiUrl;
    this.addressService.viewValueField = this.addressConfig.viewValue;
  }

  /**
   * @public
   * @description Преобразует значение из контрола в человеко читаемую строку.
   * @param {string | null | SbiDaDataAddress} elem
   * @return {string}
   */
  public addressDisplay(elem: string | null | SbiDaDataAddress): string {
    if (!elem) return '';
    return typeof elem === 'string' ? elem : elem[this.addressConfig.viewValue] ?? '';
  }

  /**
   * @public
   * @description Осуществляет запрос в дадату при изменении значения контрола.
   * @param {string} query
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
