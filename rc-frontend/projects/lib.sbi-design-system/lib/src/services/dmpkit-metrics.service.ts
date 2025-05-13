import { Injectable } from '@angular/core';
import { SbiMetricsStepData } from '../components/sbi-stepper/stepper.models';

@Injectable({
  providedIn: 'root'
})
export class DmpkitMetricsService {
  private static isInitialized = false;
  private static pendingMetrics: Array<SbiMetricsStepData> = [];
  private static checkInterval: number | null = null;

  /**
   * Инициализация DMPKit Tag Manager.
   * Загружает скрипт и устанавливает флаг после успешной загрузки.
   */
  public static initDMPMetrika(): void {
    if (this.isInitialized) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function (w, d, s, l, h, m) {
        w[l] = w[l] || [];
        w[l].push({ 'tm.start': new Date().getTime(), event: 'tm.js' });
        var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dmpkitdl' ? '&l=' + l : '';
        j.async = true;
        j.src = '//' + m + '/tm.js?id=' + h + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', '7aa517e3-a89c-440f-a65f-3f689f5c466e', 'dmp.sbermarketing.ru');
    `;

    script.onload = () => {
      this.isInitialized = true;
      this.processPendingMetrics(); // Отправляем все накопленные метрики
      this.clearPolling();
    };

    script.onerror = () => {
      console.error('DMPKit script failed to load');
      this.clearPolling();
    };

    document.body.appendChild(script);
  }

  /**
   * Отправка метрики.
   * Если DMPKit не готов, добавляет в очередь и запускает проверку.
   */
  public static sendStepMetrics(step: SbiMetricsStepData | null): void {
    if (!step) return;

    if (this.isInitialized) {
      this.sendMetricsImmediately(step);
    } else {
      this.pendingMetrics.push(step);
      this.startPolling();
    }
  }

  /**
   * Немедленная отправка метрики (если DMPKit инициализирован).
   */
  private static sendMetricsImmediately(step: SbiMetricsStepData): void {
    if (!(window as any).dataLayer) {
      console.warn('DMPKit dataLayer not available');
      return;
    }

    this.pushBaseEvent(step);
  }

  /**
   * Отправка метрики при переходе на оплату полиса (платежный шлюз).
   * @param {SbiMetricsStepData} step - Параметры шага оплаты
   * @returns {void}
   *
   * @example
   * // Отправка метрики при переходе на оплату полиса
   * DmpkitMetricsService.sendFinalStepMetric(
   *   { metricsEvent: 'final', metricsProduct: 'CAR_INSURANCE', metricsStep: 'final' },
   * );
   */
  public static sendFinalStepMetric(step: SbiMetricsStepData): void {
    if (!(window as any).dataLayer) {
      console.warn('DMPKit dataLayer not available');
      return;
    }

    this.pushBaseEvent(step);
  }

  /**
   * Отправка метрики после успешной оплате (если есть возможность отслеживать событие).
   * @param {SbiMetricsStepData} step - Параметры шага оплаты
   * @param {string} policyNumber - Номер полиса
   * @param {number} policyPrice - Cтоимость полиса
   * @returns {void}
   *
   * @example
   * // Отправка метрики после успешной оплаты
   * DmpkitMetricsService.sendSuccessPaymentMetric(
   *   { metricsEvent: 'purchase_done', metricsProduct: 'CAR_INSURANCE', metricsStep: 'done' },
   *   '123456',
   *   5000
   * );
   */
  public static sendSuccessPaymentMetric(step: SbiMetricsStepData, policyNumber: string, policyPrice: number): void {
    if (!(window as any).dataLayer) {
      console.warn('DMPKit dataLayer not available');
      return;
    }
    this.pushBaseEvent(step);
    this.pushEcommerceData(step.metricsProduct, policyNumber, policyPrice);
  }

  /**
   * Отправляет базовое событие
   * @param {SbiMetricsStepData} step - Параметрs шага
   * @returns {void}
   */
  private static pushBaseEvent(step: SbiMetricsStepData): void {
    const { metricsEvent, metricsProduct, metricsStep } = step;

    (window as any).dataLayer.push({
      event: 'calc_event',
      eventCategory: 'online_policy',
      eventAction: metricsEvent,
      eventLabel: metricsProduct,
      step: metricsStep
    });
  }


  /**
   * Отправляет eCommerce-данные после успешной оплате (если есть возможность отслеживать событие).
   * @param {string} productName - Название продукта
   * @param {string} policyNumber - Номер полиса
   * @param {number} policyPrice - Cтоимость полиса
   * @returns {void}
   */
  private static pushEcommerceData(
    productName: string,
    policyNumber: string,
    policyPrice: number,
  ): void {

    (window as any).dataLayer.push({
      ecommerce: {
        purchase: {
          actionField: {
            id: policyNumber,
          },
          products: [{
            id: productName,
            name: productName,
            price: policyPrice,
            category: 'insurance_polis',
            quantity: 1
          }]
        }
      }
    });
  }

  /**
   * Запуск периодической проверки готовности DMPKit.
   */
  private static startPolling(): void {
    if (this.checkInterval !== null) return; // Проверка уже запущена

    this.checkInterval = window.setInterval(() => {
      if ((window as any).dataLayer) {
        this.isInitialized = true;
        this.processPendingMetrics();
        this.clearPolling();
      }
    }, 100); // Проверяем каждые 100 мс
  }

  /**
   * Очистка интервала проверки.
   */
  private static clearPolling(): void {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Отправка всех накопленных метрик.
   */
  private static processPendingMetrics(): void {
    while (this.pendingMetrics.length > 0) {
      const step = this.pendingMetrics.shift()!;
      this.sendMetricsImmediately(step);
    }
  }
}
