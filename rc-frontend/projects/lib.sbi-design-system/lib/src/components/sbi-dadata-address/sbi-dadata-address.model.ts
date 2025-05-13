/**
 * Базовый интерфейс адреса из сервиса подсказок DADATA
 */
export interface SbiDaDataAddress {
  settlement?: string;
  fiasId?: string;
  addressText: string;
  area?: string;
  areaFiasId?: string;
  areaKladrId?: string;
  areaType?: string;
  areaTypeFull?: string;
  areaWithType?: string;
  city?: string;
  cityFiasId?: string;
  cityKladrId?: string;
  cityType?: string;
  cityTypeFull?: string;
  cityWithType?: string;
  country?: string;
  countryIsoCode?: string;
  fiasLevel?: string;
  okato?: string;
  oktmo?: string;
  region?: string;
  regionFiasId?: string;
  regionIsoCode?: string;
  regionKladrId?: string;
  regionType?: string;
  regionTypeFull?: string;
  regionWithType?: string;
  shortAddressText: string;
  street?: string;
  streetFiasId?: string;
  streetKladrId?: string;
  streetType?: string;
  streetTypeFull?: string;
  streetWithType?: string;
  house?: string;
  flat?: string;
}

export interface SbiResponseModel<T> {
  status: SbiResponseStatusModel;
  result: T;
}

export interface SbiResponseStatusModel {
  code: number;
  text: string;
  extendedStatus?: string;
}

export interface SbiAddressResponse {
  addressList: Array<SbiDaDataAddress>;
}

export interface SbiAddressConfig {
  /**
   * Эндпоинт для поиска адреса
   */
  apiUrl: string;
  /**
   * Поле которое необходимо отображать
   * в выпадающем списке с адресами
   */
  viewValue: keyof SbiDaDataAddress;
}
