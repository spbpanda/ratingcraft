import { catchError, take } from 'rxjs';
import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { RcBackendService } from '../../services/rc-backend.service';
import { AuthService } from '../../services/auth.service';
import { SbiInputComponent, SbiProgressSpinnerComponent, SbiSnackBarService } from '@sbi/design-system';
import { RcButtonComponent } from '../../components/rc-button/rc-button.component';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'rc-add-server',
  standalone: true,
  imports: [SbiInputComponent, RcButtonComponent, SbiProgressSpinnerComponent],
  providers: [SbiSnackBarService],
  templateUrl: './add-server.component.html',
  styleUrl: './add-server.component.scss',
})
export class AddServerComponent {
  authService = inject(AuthService);
  rcBackend = inject(RcBackendService);
  snackbarService = inject(SbiSnackBarService);
  router = inject(Router);

  isLoading: WritableSignal<boolean> = signal(false);

  address = new FormControl('', Validators.required);

  addServer() {
    if (this.address.valid) {
      this.isLoading.set(true);
      const addressPort = this.address.value?.split(':');
      addressPort &&
        this.rcBackend
          .addServer(addressPort[0], Number(addressPort[1]) ?? 25565)
          .pipe(
            take(1),
            catchError((err: any) => {
              this.snackbarService.openSnackBar({
                contentText: err.error.error,
                appearance: 'warning',
              });
              
              this.isLoading.set(false);
              throw err;
            })
          )
          .subscribe((result) => {
            console.log(result);
            this.snackbarService.openSnackBar({
              contentText: 'Сервер успешно добавлен!',
              appearance: 'success',
            });

            this.isLoading.set(false);
            this.router.navigateByUrl('user/my-servers');
          });
      this.address.reset();
    } else {
      this.snackbarService.openSnackBar({
        contentText: 'Неверный адрес сервера',
        appearance: 'warning',
      });
    }
  }
}
