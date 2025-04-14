import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { BUTTON_CROSS, STATUS_ATTENTION_FILL, STATUS_SUCCES_FILL } from '../../const/icons';


export interface DataModel {
    contentText: string;
    appearance: 'warning' | 'success';
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
        return BUTTON_CROSS;
    }

    public get svgIcon() {
        switch (this.data.appearance) {
        case 'warning':
            return STATUS_ATTENTION_FILL;
        case 'success':
            return STATUS_SUCCES_FILL;
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
