import { Component, Inject, Input, OnInit, Optional, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { BUTTON_CROSS, STATUS_ATTENTION_FILL, STATUS_INFO_FILL, STATUS_SUCCES_FILL } from '../../const/icons';
import { SbiBannerAppearance, SbiBannerDataModel } from './sbi-banner.models';
import { SbiIconColor } from '../sbi-icon/sbi-icon.models';

/**
 * Компонент для отображения всплывающего окна с текстовым содержимым.
 *
 * Поддерживает различные типы стилей.
 *
 * @Component
 * @selector: 'sbi-banner'
 * @standalone: true
 * @imports: [CommonModule, SbiIconComponent, MatSnackBarAction, MatSnackBarModule]
 * @templateUrl: './sbi-banner.component.html'
 * @styleUrl: './sbi-banner.component.scss'
 * @host: { '[class.hide-banner]': 'hideStaticBanner' }
 */
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
export class SbiBannerComponent implements OnInit {

  /**
   * @public
   * @description Статичный банер или плавающий.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public isStatic: boolean = true;

  /**
   * @public
   * @description Строчный контент.
   * @type {string | null}
   * @defaultValue null
   */
  @Input() public contentText: string | null = null;

  /**
   * @public
   * @description Шаблонный контент.
   */
  @Input() public content: TemplateRef<any> | null = null;

  /**
   * @public
   * @description svg для иконки.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public svgIcon: string = '';

  /**
   * @public
   * @description Заголовок банера.
   * @type {string | null}
   * @defaultValue null
   */
  @Input() public title: string | null = null;

  /**
   * @public
   * @description Цвет банера и иконки.
   * @type {'info' | 'warn' | 'success'}
   * @defaultValue 'info'
   */
  @Input() public appearance: SbiBannerAppearance = 'info';

  /**
   * @public
   * @description svg код иконки, отображаемой по умолчанию.
   * @type {string}
   * @defaultValue ''
   * */
  public defaultIcon: string = '';

  /**
   * @public
   * @description Флаг, видимости баннера.
   * @type {boolean}
   * @defaultValue false
   * */
  public hideStaticBanner: boolean = false;

  /**
   * @public
   * @getter
   * @description Возвращает картинку крестика (закрытия баннера).
   * @return {string}
   * */
  public get clearIcon(): string {
    return BUTTON_CROSS;
  }

  constructor(
    @Optional() @Inject(MAT_SNACK_BAR_DATA) public data: SbiBannerDataModel,
    @Optional() public snackBarRef: MatSnackBarRef<SbiBannerComponent>,
  ) {
  }

  ngOnInit(): void {
    !this.svgIcon && this.setDefaultIcon();

    this.setInitParams();
  }

  /**
   * @private
   * @description Устанавливает значения параметров, для последующего отображения.
   * */
  private setInitParams() {
    if (this.data && !this.data.isStatic) {
      this.isStatic = this.data.isStatic;
      this.contentText = this.data.contentText || this.contentText;
      this.content = this.data.content || this.content;
      this.title = this.data.title || this.title;
      this.appearance = this.data.appearance || this.appearance;
      this.setDefaultIcon();
    }
  }

  /**
   * @private
   * @description Устанавливает значение отображаемой иконки.
   * */
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

  /**
   * @public
   * @description Скрывает баннер.
   * */
  public closeStaticBanner() {
    this.hideStaticBanner = true;
  }

  /**
   * @public
   * @getter
   * @description Возвращает актуальный цвет иконки.
   * @return {SbiIconColor | undefined}
   * */
  public get getIconColor(): SbiIconColor | undefined {
    if (this.appearance === 'info') {
      return 'information'
    }
    if (this.appearance === 'success') {
      return 'accent';
    }
    if (this.appearance === 'warn') {
      return 'warning';
    }
    return undefined;
  }

}
