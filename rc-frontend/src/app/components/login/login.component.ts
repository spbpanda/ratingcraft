import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { SbiDialogComponent } from '@sbi/design-system';
import { AuthService } from '../../services/auth.service';
declare var google: any;

@Component({
  selector: 'rc-login',
  standalone: true,
  imports: [
    SbiDialogComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public readonly dialogRef = inject(DialogRef<LoginComponent>);
  public readonly auth = inject(AuthService);

  ngOnInit() {
    google.accounts.id.initialize({
      client_id: '365887367810-8gpokqje8e87c95s8r69450a0au22nks.apps.googleusercontent.com',
      callback: (response: any) => this.handleLogin(response),
    })

    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: 'filled_black',
      size: 'large',
      shape: 'pill',
      text: 'Логин через Google',
      width: '328'
    })
  }

  private decodeToken(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

  handleLogin(response: any) {
    if (response) {
      const payLoad = this.decodeToken(response.credential);
      this.auth.setLoggedInUser(payLoad);
      sessionStorage.setItem('authRcToken', response.credential);
      console.log("User logged in successfully: ", payLoad);
      this.dialogRef.close();
    }
  }
}
