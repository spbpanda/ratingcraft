import { RcBackendService } from './../../services/rc-backend.service';
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SbiAnimatedNumberPipe, SbiDialogComponent, SbiInputComponent, SbiSnackBarService, SbiSumFormatterPipe } from '@sbi/design-system';
import { RcButtonComponent } from '../rc-button/rc-button.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of, pairwise, Subject, take, takeUntil } from 'rxjs';
import { Server } from '../../common/interfaces/server';

@Component({
  selector: 'rc-boost-server',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SbiSumFormatterPipe,
    SbiInputComponent,
    SbiDialogComponent,
    RcButtonComponent
  ],
  templateUrl: './boost-server.component.html',
  styleUrl: './boost-server.component.scss'
})
export class BoostServerComponent {
  private destroy$ = new Subject();
  boostControl: FormControl = new FormControl(null);
  previousValue: number | null = null;
  rcBackendService = inject(RcBackendService);
  snackbarService = inject(SbiSnackBarService);

  constructor(public dialogRef: MatDialogRef<BoostServerComponent>, @Inject(MAT_DIALOG_DATA) public data: {server: Server}) {}

  ngOnInit() {
    // this.boostControl.valueChanges.pipe(takeUntil(this.destroy$), pairwise()).subscribe(([prev, next]) => {
    //   this.previousValue = prev;
    //   console.log(this.previousValue)
    // })
  }

  boostServer() {
    this.rcBackendService.boostServer(this.data.server, this.boostControl.value)
    .pipe(
      take(1), 
      catchError((err) => {
        this.snackbarService.openSnackBar({
          contentText: err.error.error,
          appearance: 'warning',
        });
        throw of(err)
      }))
      .subscribe((result) => {
        this.snackbarService.openSnackBar({
          contentText: 'Оплата прошла успешно! Сервер поднят в рейтинге!',
          appearance: 'success',
        });
        this.dialogRef.close(true);
      })
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
