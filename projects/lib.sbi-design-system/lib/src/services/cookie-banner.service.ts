import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieBannerService {
  public static loadScript(): void {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function (w, d, s, v, j, p) {
        w[s] = w[s] || {};
        var e = w[s][v] || 0,
          n = new Date().getTime();
        if (e <= n) {
          var f = d.getElementsByTagName(j)[0],
            i = d.createElement(j);
          i.id = v;
          i.async = true;
          i.src = p;
          f.parentNode.insertBefore(i, f);
        }
      })(window, document, 'localStorage', 'SBSCookieAlert', 'script', 'https://sberbankins.ru/cookie-alert.js');
    `;
    document.head.appendChild(script);
  }
}
