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
  imports: [],
  templateUrl: './sbi-footer.component.html',
  styleUrls: ['./sbi-footer.component.scss']
})
export class SbiFooterComponent {

  /**
   * Ширина компонента.
   * @type {number}
   */
  @Input() maxWidth: number = 1440;

  /**
   * Отступ с низу страницы.
   * @type {number}
   */
  @Input() paddingBottom: number = 20;

  /**
   * Текст компонента.
   *
   * @type {string}
   */
  private _footerText: string = `© ${new Date().getFullYear()} ООО СК «Сбербанк страхование». Лицензии Банка России: СИ № 4331 выдана 12.10.2020 бессрочно, СЛ № 4331 выдана 12.10.2020 бессрочно, ПС № 4331 выдана 12.10.2020 бессрочно, ОС № 4331 – 05 выдана 12.10.2020 бессрочно, ОС № 4331 – 04 выдана 12.10.2020 бессрочно, ОС № 4331-03 выдана 10.06.2021 бессрочно.`;

  /**
   * Установка текста компонента.
   *
   * @param {string} footerText
   * @type {number}
   */
  @Input() public set footerText(footerText: string) {
    this._footerText = footerText;
  }

  /**
   * Возвращает текст компонента.
   *
   * @returns {string}
   */
  public get footerText(): string {
    return this._footerText;
  }

  /**
   * Ссылка на политику обработки ПД.
   *
   * @type {string}
   */
  public POLICY_LINK: string = `https://sberbankins.ru/upload/files/doc/prilozhenie-politika-pnd.pdf`;

  /**
   * Ссылка на политику обработки cookie.
   *
   * @type {string}
   */
  public COOCKIE_LINK: string = `https://sberbankins.ru/upload/files/doc/politika-obrabotki-cookie.pdf`;

  /**
   * Ссылка на порядок запросов субъектов ПД.
   *
   * @type {string}
   */
  public RULES_LINK: string = `https://sberbankins.ru/upload/docs/poryadok-raboti-s-zaprosami.pdf`;

  /**
   * Устанавливает ширину текста.
   *
   * @returns {number}
   */
  @HostBinding('style.--max-width.px')
  public get width(): number {
    return this.maxWidth;
  }

  /**
   * Устанавливает отступ текста с низу страницы.
   *
   * @returns {number}
   */
  @HostBinding('style.--padding-bottom.px')
  public get paddingBottomSize(): number {
    return this.paddingBottom;
  }

}
