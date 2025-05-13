import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SbiAddressResponse, SbiDaDataAddress, SbiResponseModel } from './sbi-dadata-address.model';
import { SbiSelectableItem } from '../../models/sbi-selectable-item';

/**
 * @Injectable Сервис запроса адреса в дадате.
 * */
@Injectable()
export class SbiDadataAddressService {
  /**
   * @private
   * @readonly
   * @description Объект класса HttpClient.
   * @type {HttpClient}
   * @defaultValue inject(HttpClient)
   */
  private readonly http: HttpClient = inject(HttpClient);

  /**
   * @public
   * @description Урл запроса в дадату.
   * @type {string | null>}
   * @defaultValue null
   */
  public api: string | null = null;

  /**
   * @public
   * @description Наименование поля по которому будет взято значение для viewValue в списке адресов.
   * @type {keyof SbiDaDataAddress}
   * @defaultValue 'shortAddressText'
   */
  public viewValueField: keyof SbiDaDataAddress = 'shortAddressText';

  /**
   * @public
   * @description Делает запрос в дадату и маппит результат в список SbiSelectableItem.
   * @param {string} query
   * @defaultValue 'shortAddressText'
   * @return {Observable<Array<SbiSelectableItem<SbiDaDataAddress>>>}
   */
  public searchAddress(query: string): Observable<Array<SbiSelectableItem<SbiDaDataAddress>>> {
    if (!this.api) throw new Error('Не задан API для поиска адреса');
    return this.http.post<SbiResponseModel<SbiAddressResponse>>(`${this.api}`, { addressText: query })
      .pipe(map(response => response.result.addressList))
      .pipe(map(addressList => addressList.map(item => ({ value: item, viewValue: item[this.viewValueField] ?? '' }))));
  }

}
