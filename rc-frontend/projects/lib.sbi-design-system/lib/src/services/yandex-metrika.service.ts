import { Injectable } from '@angular/core';
import { MetricsStepData } from '../components/sbi-stepper/stepper.model';


@Injectable({
  providedIn: 'root'
})
export class YandexMetrikaService {

  /**
   * Инициализация Яндекс Метрики
   */
  public static initYandexMetrika(): void {
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

    const noScript = document.createElement('noscript');
    const divEl = document.createElement('div');
    divEl.innerHTML = `<img src="https://mc.yandex.ru/watch/71894266" style="position:absolute; left:-9999px;" alt="" />
      <img src="https://mc.yandex.ru/watch/31643078" style="position:absolute; left:-9999px;" alt="" />`;

    noScript.appendChild(divEl);

    document.body.prepend(script, noScript);
  }


  /**
   * Передача метрики при переходе по шагам степпера
   */
  public static sendStepMetrics(step: MetricsStepData | null): void {
    if (!(window as any).yaCounter71894266) {
      throw new Error('Yandex.Metrika не инициализирована. Вызовите YandexMetrikaService.initYandexMetrika() перед использованием.');
    }
    const { metricsEvent = 'eventAction', metricsProduct = 'PRODUCT', metricsStep = 'step' } = step || {};
    (window as any).yaCounter71894266.reachGoal(
      `calc_event_online_policy_${metricsEvent}_${metricsProduct}_step_${metricsStep}`
    );
  }
}