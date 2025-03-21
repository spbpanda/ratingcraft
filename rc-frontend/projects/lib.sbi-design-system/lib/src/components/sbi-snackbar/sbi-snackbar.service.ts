import { inject, Injectable } from "@angular/core";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { DataModel, SbiSnackbarComponent } from "./sbi-snackbar.component";



@Injectable()
export class SbiSnackBarService {
    private _snackBar = inject(MatSnackBar); 

    /**
     * Открыть сообщение
     * @param data Информация для сообщшения
     * @param horizontalPosition Горизонтальное расположение
     * @param verticalPosition Вертикально расположение
     * @param duration Задержка до закрытия окна (сек)
     */
    public openSnackBar(
        data: DataModel,
        horizontalPosition: MatSnackBarHorizontalPosition = 'center',
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