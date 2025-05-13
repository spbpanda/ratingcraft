import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { SbiBannerComponent } from './sbi-banner.component';
import { SbiBannerDataModel } from './sbi-banner.models';

/**
 * @Injectable Сервис, отвечающий за открытие sbiBanner c помощью MatSnackBar
 * */
@Injectable()
export class SbiBannerService {
  /**
   * @private
   * @description Экземпляр сервиса MatSnackBar
   * @type {MatSnackBar}
   * */
  private _snackBar: MatSnackBar = inject(MatSnackBar);

  /**
   * @description Открыть всплывающий баннер
   * @param bannerData Информация для банера
   * @param horizontalPosition Горизонтальное расположение
   * @param verticalPosition Вертикально расположение
   * @param duration Задержка до закрытия окна (сек)
   */
  openNotification(
    bannerData: SbiBannerDataModel,
    horizontalPosition: MatSnackBarHorizontalPosition = 'end',
    verticalPosition: MatSnackBarVerticalPosition = 'bottom',
    duration: number = 5
  ) {
    this._snackBar.openFromComponent(SbiBannerComponent,
      {
        data: bannerData,
        horizontalPosition: horizontalPosition,
        verticalPosition: verticalPosition,
        duration: duration * 1000,
        panelClass: 'sbi-banner',
      }
    );
  }
}
