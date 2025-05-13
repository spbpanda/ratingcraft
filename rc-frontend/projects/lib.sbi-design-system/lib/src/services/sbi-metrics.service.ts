import { Injectable } from '@angular/core';
import { YandexMetrikaService } from './yandex-metrika.service';
import { DmpkitMetricsService } from './dmpkit-metrics.service';
import { SbiMetricsStepData } from '../components/sbi-stepper/stepper.models';

@Injectable({
  providedIn: 'root'
})
export class SbiMetricsService {

  /**
   * Отправляет Метрику в яндекс и дмпкит по переходу на шаги степпера
   * @param {SbiMetricsStepData} step - Параметры метрики шага степпера
   * @returns {void}
   */
  public sendStepMetric(step: SbiMetricsStepData | null): void {
    if (!step) return;

    YandexMetrikaService.sendStepMetrics(step);
    DmpkitMetricsService.sendStepMetrics(step);
  }

  /**
   * Отправляет Метрику при переходе на на оплату полиса (платежный шлюз) в яндекс и Dmpkit
   * @param {SbiMetricsStepData} step - Параметры метрики для оплаты
   * @returns {void}
   */
  public sendFinalMetric(step: SbiMetricsStepData): void {
    YandexMetrikaService.sendFinalStepMetric(step);
    DmpkitMetricsService.sendStepMetrics(step);
  }

  /**
   * Отправляет Метрику после успешной оплаты в яндекс и Dmpkit
   * @param {SbiMetricsStepData} step - Параметры метрики успешной оплаты
   * @param {string} policyNumber - Номер полиса
   * @param {number} policyPrice - Стоимость полиса
   * @returns {void}
   */
  public sendSuccessPaymentMetric(step: SbiMetricsStepData, policyNumber: string, policyPrice: number): void {
    YandexMetrikaService.sendSuccessPaymentMetric(step);
    DmpkitMetricsService.sendSuccessPaymentMetric(step, policyNumber, policyPrice);
  }
}
