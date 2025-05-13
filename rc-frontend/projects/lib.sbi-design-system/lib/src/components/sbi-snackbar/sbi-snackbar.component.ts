import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { CROSS_OUTLINE, STATUS_ATTENTION_OUTLINE, STATUS_INFO_OUTLINE, STATUS_SUCCES_OUTLINE } from '../../const/icons';
import { DataModel } from './sbi-snackbar.models';

/**
 * Компонент всплывающего баннера.
 *
 * @Component
 * @selector: 'sbi-snackbar'
 * @standalone: true
 * @imports: [CommonModule, SbiIconComponent, MatSnackBarModule]
 * @templateUrl: './sbi-snackbar.component.html',
 * @styleUrl: './sbi-snackbar.component.scss'
 */
@Component({
  selector: 'sbi-snackbar',
  standalone: true,
  imports: [CommonModule, SbiIconComponent, MatSnackBarModule],
  templateUrl: './sbi-snackbar.component.html',
  styleUrl: './sbi-snackbar.component.scss'
})
export class SbiSnackbarComponent {
  /**
   *  @public
   *  @getter
   *  @description Возвращает иконку скрытия баннера.
   *  @return {string}
   * */
  public get clearIcon(): string {
    return CROSS_OUTLINE;
  }

  /**
   *  @public
   *  @getter
   *  @description Возвращает иконку success баннера.
   *  @return {string}
   * */
  public get successIcon(): string {
    return STATUS_SUCCES_OUTLINE;
  }

  /**
   *  @public
   *  @getter
   *  @description Возвращает иконку error баннера.
   *  @return {string}
   * */
  public get errorIcon(): string {
    return STATUS_ATTENTION_OUTLINE;
  }

  /**
   *  @public
   *  @getter
   *  @description Возвращает иконку info баннера.
   *  @return {string}
   * */
  public get infoIcon(): string {
    return STATUS_INFO_OUTLINE;
  }

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: DataModel,
    private snackBar: MatSnackBar,
  ) {
  }

  /**
   *  @public
   *  @description Скрывает всплывающий баннер.
   * */
  public onClose(): void {
    this.snackBar.dismiss();
  }

}
