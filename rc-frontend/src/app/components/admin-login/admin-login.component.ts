import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { SbiDialogComponent, SbiInputComponent } from '@sbi/design-system';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, shareReplay, take } from 'rxjs';
import { RcButtonComponent } from '../rc-button/rc-button.component';


export interface AdminLoginForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'rc-admin-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SbiInputComponent,
    SbiDialogComponent,
    RcButtonComponent
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  public readonly dialogRef = inject(DialogRef<AdminLoginComponent>);
  public readonly auth = inject(AuthService);

  loginForm: FormGroup<AdminLoginForm> = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  onSumbit() {
    if (this.loginForm.valid) {
      this.auth.adminLogin({username: this.loginForm.value.username!, password: this.loginForm.value.password!})
      .pipe(
        take(1),
        catchError(() => {
          alert('Ошибка входа');
          return [];
        }),
        shareReplay()
      )
      .subscribe(
        (res) => {
          this.dialogRef.close();
        }
      )
    }

  }
}
