import { InjectionToken } from '@angular/core';
import { SbiDaDataConfiguration } from '../../models/sbi-da-data-models';

// Создаем токен с типом нашего конфига
export const SBI_SUGGEST_CONFIG = new InjectionToken<SbiDaDataConfiguration>('Конфигурация для универсального сервиса дадаты');
