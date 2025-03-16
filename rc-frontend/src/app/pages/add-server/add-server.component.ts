import { take } from 'rxjs';
import { Component, inject } from '@angular/core';
import { RcBackendService } from '../../services/rc-backend.service';
import { AuthService } from '../../services/auth.service';
import { SbiInputComponent } from '@sbi/design-system';
import { RcButtonComponent } from '../../components/rc-button/rc-button.component';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'rc-add-server',
  standalone: true,
  imports: [
    SbiInputComponent,
    RcButtonComponent
  ],
  templateUrl: './add-server.component.html',
  styleUrl: './add-server.component.scss'
})
export class AddServerComponent {
  authService = inject(AuthService);
  rcBackend = inject(RcBackendService);
  router = inject(Router);

  address = new FormControl('', Validators.required);

  addServer() {
    if (this.address.valid) {
      const addressPort = this.address.value?.split(':');
      console.log(addressPort);
      addressPort && this.rcBackend.addServer(addressPort[0], Number(addressPort[1]) ?? 25565).pipe(take(1)).subscribe((result => {
        console.log('Server added:', result);
        this.router.navigateByUrl('user/my-servers');
      }));
      this.address.reset();
    } else {
      console.error('Invalid address');
    }
  }
}
