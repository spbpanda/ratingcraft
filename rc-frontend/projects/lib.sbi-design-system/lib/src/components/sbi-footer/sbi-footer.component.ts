import { Component, HostBinding, Input } from '@angular/core';

/**
 * Компонент подвала сайта (footer)
 *
 * Блок в нижней части страницы. Содержит полезную, но не первостепенную информацию.
 * Виден на всех страницах сайта. В футер можно вынести: копирайт, название компании, контакты, ознакомительные документы.
 *
 * @Component
 * @selector: 'sbi-footer'
 * @standalone: true
 * @templateUrl: './sbi-footer.component.html'
 * @styleUrls: ['./sbi-footer.component.scss']
 */
@Component({
  selector: 'sbi-footer',
  standalone: true,
  templateUrl: './sbi-footer.component.html',
  styleUrls: ['./sbi-footer.component.scss']
})
export class SbiFooterComponent {

  /**
   * @public
   * @description Ширина компонента.
   * @type {number}
   * @default 1440
   */
  @Input() public maxWidth: number = 1440;

  /**
   * @public
   * @description Отступ снизу страницы.
   * @type {number}
   * @defaultValue 20
   */
  @Input() public paddingBottom: number = 20;

  /**
   * @private
   * @description Текст компонента.
   * @type {string}
   * @defaultValue `© ${new Date().getFullYear()} ООО СК «Сбербанк страхование». Лицензии Банка России: СИ № 4331 выдана 12.10.2020 бессрочно, СЛ № 4331 выдана 12.10.2020 бессрочно, ПС № 4331 выдана 12.10.2020 бессрочно, ОС № 4331 – 05 выдана 12.10.2020 бессрочно, ОС № 4331 – 04 выдана 12.10.2020 бессрочно, ОС № 4331-03 выдана 10.06.2021 бессрочно.`
   */
  private _footerText: string = `© ${new Date().getFullYear()} ООО СК «Сбербанк страхование». Лицензии Банка России: СИ № 4331 выдана 12.10.2020 бессрочно, СЛ № 4331 выдана 12.10.2020 бессрочно, ПС № 4331 выдана 12.10.2020 бессрочно, ОС № 4331 – 05 выдана 12.10.2020 бессрочно, ОС № 4331 – 04 выдана 12.10.2020 бессрочно, ОС № 4331-03 выдана 10.06.2021 бессрочно.`;

  /**
   * @public
   * @setter
   * @description Установка текста компонента.
   * @param {string} footerText
   * @type {number}
   */
  @Input()
  public set footerText(footerText: string) {
    this._footerText = footerText;
  }

  /**
   * @public
   * @getter
   * @description Возвращает текст компонента.
   * @returns {string}
   */
  public get footerText(): string {
    return this._footerText;
  }

  /**
   * @public
   * @description Ссылка на политику обработки ПД.
   * @type {string}
   * @defaultValue `https://sberbankins.ru/upload/files/doc/prilozhenie-politika-pnd.pdf`
   */
  public POLICY_LINK: string = `https://sberbankins.ru/upload/files/doc/prilozhenie-politika-pnd.pdf`;

  /**
   * @public
   * @description Ссылка на политику обработки cookie.
   * @type {string}
   * @defaultValue `https://sberbankins.ru/upload/files/doc/politika-obrabotki-cookie.pdf`
   */
  public COOCKIE_LINK: string = `https://sberbankins.ru/upload/files/doc/politika-obrabotki-cookie.pdf`;

  /**
   * @public
   * @description Ссылка на порядок запросов субъектов ПД.
   * @type {string}
   * @defaultValue `https://sberbankins.ru/upload/docs/poryadok-raboti-s-zaprosami.pdf`
   */
  public RULES_LINK: string = `https://sberbankins.ru/upload/docs/poryadok-raboti-s-zaprosami.pdf`;

  /**
   * @HostBinding ('style.--max-width.px')
   * @getter
   * @description Устанавливает ширину текста.
   * @returns {number}
   */
  @HostBinding('style.--max-width.px')
  public get width(): number {
    return this.maxWidth;
  }

  /**
   * @HostBinding ('style.--padding-bottom.px')
   * @getter
   * @description Устанавливает отступ текста с низу страницы.
   * @returns {number}
   */
  @HostBinding('style.--padding-bottom.px')
  public get paddingBottomSize(): number {
    return this.paddingBottom;
  }

}
