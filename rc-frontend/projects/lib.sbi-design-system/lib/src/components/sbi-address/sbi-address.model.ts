/**
 * Базовый интерфейс адреса из сервиса подсказок
 */
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