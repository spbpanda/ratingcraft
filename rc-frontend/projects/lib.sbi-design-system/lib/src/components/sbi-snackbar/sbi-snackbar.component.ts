import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { CLEAR_ICON_SVG, EXCLAMATION_MARK_SVG_ICON_24_px, SUCCESS_MARK_SVG_ICON_24_px } from '../../const/icons';


export interface DataModel {
    contentText: string;
    appearance: 'warn' | 'success';
}

@Component({
    selector: 'sbi-snackbar',
    standalone: true,
    imports: [
        CommonModule,
        SbiIconComponent,
        MatSnackBarModule,
    ],
    templateUrl: './sbi-snackbar.component.html',
    styleUrl: './sbi-snackbar.component.scss'
})
export class SbiSnackbarComponent {

    public get clearIcon() {
        return CLEAR_ICON_SVG;
    }

    public get svgIcon() {
        switch (this.data.appearance) {
        case 'warn':
            return EXCLAMATION_MARK_SVG_ICON_24_px;
        case 'success':
            return SUCCESS_MARK_SVG_ICON_24_px;
        }
    }

    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: DataModel,
        private snackBar: MatSnackBar,
    ) { }

    public onClose(): void {    
        this.snackBar.dismiss();
    }

}
