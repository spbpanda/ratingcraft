import { Injectable } from '@angular/core';
import { MetricsStepData } from '../components/sbi-stepper/stepper.model';

@Injectable({
  providedIn: 'root'
})
export class DmpkitMetricsService {

  /**
   * Инициализация DMPKit Tag Manager
   */
  public static initDMPMetrika(): void {
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

    document.body.prepend(script);
  }


  /**
   * Передача метрики при переходе по шагам степпера
   */
  public static sendStepMetrics(step: MetricsStepData | null): void {
    if (!(window as any).dataLayer) {
      throw new Error(' DMPKit Tag Manager не инициализирован. Вызовите DmpkitMetricsService.initDMPMetrika() перед использованием.');
    }
    const { metricsEvent = 'eventAction', metricsProduct = 'PRODUCT', metricsStep = 'step' } = step || {};
  
    (window as any).dataLayer.push({
      'event': 'calc_event',
      'eventCategory': 'online_policy',
      'eventAction': metricsEvent,
      'eventLabel': metricsProduct,
      'step': metricsStep
    });
    
  }
}
