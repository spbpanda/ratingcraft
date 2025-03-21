import { inject, Injectable } from "@angular/core";
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BannerDataModel, SbiBannerComponent } from "./sbi-banner.component";


@Injectable()
export class SbiBannerService {
    private _snackBar = inject(MatSnackBar); 

    /**
     * Открыть всплывающий баннер
     * @param bannerData Информация для банера
     * @param horizontalPosition Горизонтальное расположение
     * @param verticalPosition Вертикально расположение
     * @param duration Задержка до закрытия окна (сек)
     */
    openNotification(
        bannerData: BannerDataModel,
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