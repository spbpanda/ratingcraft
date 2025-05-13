import { map, Observable } from 'rxjs';
import { SbiSelectableItem } from '../../models/sbi-selectable-item';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SbiResponseModel } from '../sbi-dadata-address/sbi-dadata-address.model';
import { SbiDaDataRequestData } from '../../models/sbi-da-data-models';
import { SBI_SUGGEST_CONFIG } from './sbi-suggest-search.const';


/**
 * @Injectable
 * @description Сервис обращения в дадату для вывода подсказок заполнения полей.
 * */
@Injectable()
export class SbiSuggestService<T> {
  private readonly http = inject(HttpClient);
  private readonly config = inject(SBI_SUGGEST_CONFIG);

  /**
   * @public
   * @description Метод изменения параметров запроса в дадату.
   * @param {Record<string, any>} newData - Новые параметры запроса.
   * @param {string} type - Тип поля, для которого меняется конфигурация.
   * */
  public changeRequestDataConfig(newData: Record<string, any>, type: string) {
    const request = this.config.requestData.find(request => request.type === type);
    if (!request) return;
    request.requestDataConfig = newData;
  }

  /**
   * @public
   * @description Метод получения списка опций из дадаты.
   * @param {string} query - Строка со значением по которому будет осуществляться поиск в дадате.
   * @param {string} type - Тип поля, для которого меняется конфигурация.
   * @return {Observable<Array<SbiSelectableItem<T>>>} - Список опций.
   * */
  public getSuggestions(query: string, type: string): Observable<Array<SbiSelectableItem<T>>> {
    const request = this.config.requestData.find(request => request.type === type);
    if (!request) throw `Не найдены параметры конфигурации с типом ${type}`;

    const api = this.config.apiPrefix + request.apiSuffix;

    return this.http.post<SbiResponseModel<Record<string, Array<T>>>>(api, this.getRequestData(request, query))
      .pipe(
        map(response => response.result[Object.keys(response.result)[0]]),
        map(items => this.getItemMapper(request, items))
      )
  }

  /**
   * @private
   * @description Метод получения списка опций из дадаты.
   * @param {SbiDaDataRequestData<T>} request - Параметры запроса.
   * @param {string} query - Строка со значением по которому будет осуществляться поиск в дадате.
   * @return {Record<string, any>} - Параметры для запроса в дадату.
   * */
  private getRequestData(request: SbiDaDataRequestData<T>, query: string): Record<string, any> {
    const search = request.requestParameterName ? { [request.requestParameterName]: query } : { query };
    return request.requestDataConfig ? { ...request.requestDataConfig, ...search } : search;
  }

  /**
   * @private
   * @description Метод получения списка опций из дадаты.
   * @param {SbiDaDataRequestData<T>} request - Параметры запроса.
   * @param {Array<T>} items - Список элементов, полученный из дадаты.
   * @return {Array<SbiSelectableItem<T>>} Список опций смапленый в удобный формат для отображения в компоненте выпадающего списка.
   * */
  private getItemMapper<T>(request: SbiDaDataRequestData<T>, items: Array<T>): Array<SbiSelectableItem<T>> {
    if (request.mapVoid) return request.mapVoid(items)
    if (request.viewParameter) return items.map(item => ({
      value: item,
      viewValue: (<any>item)[request.viewParameter!]
    }))
    throw 'Невозможно преобразовать полученные данные из дадаты.'
  }
}
