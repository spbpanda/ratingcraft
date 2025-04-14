import { Component, Inject, Input, Optional, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { BUTTON_CROSS, STATUS_ATTENTION_FILL, STATUS_INFO_FILL, STATUS_SUCCES_FILL } from '../../const/icons';


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
    return BUTTON_CROSS;
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
        this.defaultIcon = STATUS_ATTENTION_FILL;
        break;
      case 'info':
        this.defaultIcon = STATUS_INFO_FILL;
        break
      case 'success':
        this.defaultIcon = STATUS_SUCCES_FILL;
        break
    }
  }

  public closeStaticBanner() {
    this.hideStaticBanner = true;
  }

}
