import { Injectable } from '@angular/core';
import { SbiMetricsStepData } from '../components/sbi-stepper/stepper.models';

@Injectable({
  providedIn: 'root'
})
export class YandexMetrikaService {
  private static isInitialized = false;
  private static pendingMetrics: Array<SbiMetricsStepData> = [];
  private static checkInterval: number | null = null;

  /**
   * Инициализация Яндекс.Метрики.
   * Просто запускает загрузку скрипта и устанавливает флаг после успеха.
   */
  public static initYandexMetrika(): void {
    if (this.isInitialized) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        k=e.createElement(t), a=e.getElementsByTagName(t)[0], k.async=1, k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(71894266, "init", {clickmap:true, trackLinks:true, accurateTrackBounce:true, trackHash:true, ecommerce:"dataLayer"});
      ym(31643078, "init", {clickmap:true, trackLinks:true, accurateTrackBounce:true, trackHash:true, ecommerce:"dataLayer"});
    `;

    script.onload = () => {
      this.isInitialized = true;
      this.processPendingMetrics(); // Отправляем все накопленные метрики
      this.clearPolling();
    };

    script.onerror = () => {
      console.error('Yandex.Metrika script failed to load');
      this.clearPolling();
    };

    document.body.appendChild(script);
  }

  /**
   * Отправка метрики.
   * Если Метрика не готова, добавляет в очередь и запускает проверку.
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
   * Немедленная SbiMetricsStepData метрики (если Метрика инициализирована).
   * @param {SbiMetricsStepData} step - Параметры метрики шага степпера
   * @returns {void}
   */
  private static sendMetricsImmediately(step: SbiMetricsStepData): void {
    if (!(window as any).yaCounter71894266) {
      console.warn('Yandex.Metrika counter not available');
      return;
    }

    const { metricsEvent = 'eventAction', metricsProduct = 'PRODUCT', metricsStep = 'step' } = step;
    (window as any).yaCounter71894266.reachGoal(
      `calc_event_online_policy_${metricsEvent}_${metricsProduct}_step_${metricsStep}`
    );
  }

  /**
   *  Отправка метрики при переходе на оплату полиса (платежный шлюз).
   * @param {SbiMetricsStepData} step - Параметры метрики для оплаты
   * @returns {void}
   */
  public static sendFinalStepMetric(step: SbiMetricsStepData): void {
    if (!(window as any).yaCounter71894266) {
      console.warn('Yandex.Metrika counter not available');
      return;
    }

    const { metricsEvent = 'final', metricsProduct = 'PRODUCT', metricsStep = 'final' } = step;
    (window as any).yaCounter71894266.reachGoal(
      `calc_event_online_policy_${metricsEvent}_${metricsProduct}_step_${metricsStep}`
    );
  }

  /**
   *  Отправка метрики после успешной оплате (если есть возможность отслеживать событие).
   * @param {SbiMetricsStepData} step - Параметры метрики успешной оплаты
   * @returns {void}
   */
  public static sendSuccessPaymentMetric(step: SbiMetricsStepData): void {
    if (!(window as any).yaCounter71894266) {
      console.warn('Yandex.Metrika counter not available');
      return;
    }

    const { metricsEvent = 'purchase_done', metricsProduct = 'PRODUCT', metricsStep = 'done' } = step;
    (window as any).yaCounter71894266.reachGoal(
      `calc_event_online_policy_${metricsEvent}_${metricsProduct}_step_${metricsStep}`
    );
  }

  /**
   * Отправка метрики после успешной авторизации.
   * @param {string} productName - Название продукта
   * @returns
   */
  public static sendSuccessfullAuthorizationMetric(productName: string): void {
    if (!(window as any).yaCounter71894266) {
      console.warn('Yandex.Metrika counter not available');
      return;
    }

    (window as any).yaCounter71894266.reachGoal(
      `calc_event_online_policy_purchase_${productName}_step_sberid`
    );
  }

  /**
   * Запуск периодической проверки готовности Метрики.
   */
  private static startPolling(): void {
    if (this.checkInterval !== null) return; // Проверка уже запущена

    this.checkInterval = window.setInterval(() => {
      if ((window as any).yaCounter71894266) {
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
