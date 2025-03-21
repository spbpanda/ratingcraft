import { Component, Inject, Input, Optional, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { CLEAR_ICON_SVG, EXCLAMATION_MARK_SVG_ICON_24_px, INFO_MARK_SVG_ICON_24_px, SUCCESS_MARK_SVG_ICON_24_px } from '../../const/icons';


export interface BannerDataModel {
  isStatic: boolean;
  title?: string;
  content?: TemplateRef<any>;
  context?: unknown;
  contentText?: string;
  appearance: 'info' | 'warn' | 'success';
}


@Component({
  selector: 'sbi-banner',
  standalone: true,
  imports: [
    CommonModule,
    SbiIconComponent,
    MatSnackBarAction,
    MatSnackBarModule,
  ],
  templateUrl: './sbi-banner.component.html',
  styleUrl: './sbi-banner.component.scss',
  host: {
    '[class.hide-banner]': 'hideStaticBanner',
  }
})
export class SbiBannerComponent {

  /**
   * Статичный банер или плавающий
   */
  @Input() isStatic: boolean = true;

  /**
   * Строчный контент
   */
  @Input() contentText: string | null = null;

  /**
   * Шаблонный контент
   */
  @Input() content: TemplateRef<any> | null = null;

  /**
   * svg для иконки
   */
  @Input() svgIcon: string = '';

  /**
   * Заголовок банера
   */
  @Input() title: string | null = null;

  /**
   * Цвет банера и иконки
   */
  @Input() appearance: 'info' | 'warn' | 'success' = 'info';

  public defaultIcon: string = '';

  public hideStaticBanner: boolean = false;

  public get clearIcon() {
    return CLEAR_ICON_SVG;
  }

  constructor(
    @Optional() @Inject(MAT_SNACK_BAR_DATA) public data: BannerDataModel,
    @Optional() public snackBarRef: MatSnackBarRef<SbiBannerComponent>,
  ) { }

  ngOnInit(): void {
    !this.svgIcon && this.setDefaultIcon();
    
    if (this.data && !this.data.isStatic) {
      this.isStatic = this.data.isStatic;
      this.contentText = this.data.contentText || this.contentText;
      this.content = this.data.content || this.content;
      this.title = this.data.title || this.title;
      this.appearance = this.data.appearance || this.appearance;
      this.setDefaultIcon(); 
    }
    
  }

  private setDefaultIcon() {
    switch (this.appearance) {
      case 'warn':
        this.defaultIcon = EXCLAMATION_MARK_SVG_ICON_24_px;
        break;
      case 'info':
        this.defaultIcon = INFO_MARK_SVG_ICON_24_px;
        break
      case 'success':
        this.defaultIcon = SUCCESS_MARK_SVG_ICON_24_px;
        break
    }
  }

  public closeStaticBanner() {
    this.hideStaticBanner = true;
  }

}
