import { SbiSelectableItem } from './sbi-selectable-item';

/**
 * @description Базовый интерфейс адреса (используется для запроса в дадату)
 * @typeParam address - Адрес организации
 * @typeParam fullName - Полное наименование организации
 * @typeParam inn - ИНН организации
 * @typeParam kpp - КПП организации
 * @typeParam ogrn - ОГРН организации
 * @typeParam shortName - Кратное наименование организации
 * */
export interface SbiOrganizationBase {
  address: SbiAddressBase;
  fullName: string;
  inn: string;
  kpp: string;
  ogrn: string;
  shortName: string;
}

/**
 * @description Базовый интерфейс данных человека (используется при получении данных из дадаты)
 * @typeParam surname - Фамилия
 * @typeParam name - Имя
 * @typeParam patronymic - Отчество
 * */
export interface SbiFioBase {
  surname: string,
  name: string,
  patronymic: string,
}

/**
 * @description Базовый интерфейс данных человека (используется при получении данных из дадаты)
 * @typeParam shortAddressText - Краткий адрес
 * @typeParam addressText - Полный текст адреса
 * @typeParam region - Регион
 * @typeParam city - Город
 * @typeParam settlement - Населенный пункт
 * @typeParam house - Дом
 * @typeParam flat - Квартира
 * @typeParam fiasLevel
 * */
export interface SbiAddressBase {
  shortAddressText: string;
  addressText: string;
  region?: string;
  city?: string;
  settlement?: string;
  house?: string;
  flat?: string;
  fiasLevel?: string;
}

/**
 * @description Интерфейс, использующийся для описания конфигурации для сервиса запросов в дадату
 * @typeParam apiPrefix - Общий префикс урла эендоинта запросов в дадату
 * @typeParam requestData - Список параметров для каждого метода
 * */
export interface SbiDaDataConfiguration {
  apiPrefix: string;
  requestData: Array<SbiDaDataRequestData<any>>;
}

/**
 * @description Интерфейс, использующийся для описания конфигурации для сервиса запросов в дадату
 * @typeParam mapVoid - Функция - обработчик ответа из дадаты
 * @typeParam viewParameter - Параметр, помещаемый во viewValue (если не передан mapVoid)
 * @typeParam requestParameterName - Наименование параметра, отправляемого в сервис дадаты
 * @typeParam apiSuffix - Окончание ендпоинта запроса в дадату
 * @typeParam type - Тип поля (должен совпадать с типом переданным в компонент)
 * @typeParam requestDataConfig - Список доп параметров, передаваемых в запросе в дадату
 * */
export interface SbiDaDataRequestData<T> {
  mapVoid?: (elements: Array<T>) => Array<SbiSelectableItem<T>>;
  viewParameter?: string;
  requestParameterName?: string;
  apiSuffix: string;
  type: string;
  requestDataConfig?: Record<string, any>;
}
