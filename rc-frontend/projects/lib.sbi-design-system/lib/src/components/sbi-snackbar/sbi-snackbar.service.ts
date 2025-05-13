import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { SbiSnackbarComponent } from './sbi-snackbar.component';
import { DataModel } from './sbi-snackbar.models';


/**
 * Сервис отображения всплывающего баннера с помощью MatSnackBar.
 *
 * @Injectable
 */
@Injectable()
export class SbiSnackBarService {
  /**
   * @private
   * @description Открыть сообщение. Экземпляр MatSnackBar.
   * @type {MatSnackBar}
   * @defaultValue MatSnackBar
   */
  private _snackBar: MatSnackBar = inject(MatSnackBar);

  /**
   * @public
   * @description Открыть сообщение
   * @param data Информация для сообщшения
   * @param horizontalPosition Горизонтальное расположение
   * @param verticalPosition Вертикально расположение
   * @param duration Задержка до закрытия окна (сек)
   */
  public openSnackBar(
    data: DataModel,
    horizontalPosition: MatSnackBarHorizontalPosition = 'right',
    verticalPosition: MatSnackBarVerticalPosition = 'bottom',
    duration: number = 5,
  ) {
    this._snackBar.openFromComponent(SbiSnackbarComponent,
      {
        data,
        horizontalPosition: horizontalPosition,
        verticalPosition: verticalPosition,
        duration: duration * 1000,
        panelClass: 'sbi-snackbar',
      }
    )
  }
}
