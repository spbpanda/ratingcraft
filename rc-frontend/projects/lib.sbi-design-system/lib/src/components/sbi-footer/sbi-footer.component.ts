import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'sbi-footer',
  standalone: true,
  imports: [],
  templateUrl: './sbi-footer.component.html',
  styleUrl: './sbi-footer.component.scss'
})
export class SbiFooterComponent {

  /**
   * Ширина контейнера для футера
   */
  @Input() maxWidth: number = 1440;

  /**
   * Размер отступа снизу для планшета и мобилы
   */
  @Input() paddingBottom: number = 20;

  public currentYear = new Date().getFullYear();

  public POLICY_LINK = `https://sberbankins.ru/upload/files/doc/prilozhenie-politika-pnd.pdf`;
  public COOCKIE_LINK = `https://sberbankins.ru/upload/files/doc/politika-obrabotki-cookie.pdf`;
  public RULES_LINK = `https://sberbankins.ru/upload/docs/poryadok-raboti-s-zaprosami.pdf`;

  @HostBinding('style.--max-width.px') 
  public get width() {
    return this.maxWidth;
  }

  @HostBinding('style.--padding-bottom.px') 
  public get paddingBottomSize() {
    return this.paddingBottom;
  }

}
