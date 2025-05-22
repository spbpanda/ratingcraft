import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminLoginComponent } from '../../components/admin-login/admin-login.component';
import { catchError } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SbiSuggestChipComponent } from '@sbi/design-system';


@Component({
  selector: 'rc-admin-panel',
  standalone: true,
  imports: [
    MatSidenavModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    AsyncPipe,
    SbiSuggestChipComponent
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  public readonly dialog = inject(MatDialog);
  public readonly auth = inject(AuthService);
  public readonly router = inject(Router);
  isAdmin$ = this.auth.isAdmin$

  constructor() {}

  ngOnInit() {
    this.auth.isAdmin().pipe(
      catchError(() => {
        this.openDialogLogin();
        return [];
      })
    ).subscribe((isAdmin: boolean) => {
      if (!isAdmin) {
        this.openDialogLogin();
      }
    })
  }

  openDialogLogin() {
    this.dialog.open(AdminLoginComponent);
  }

  routerLink(path: string) {
    return this.router.navigate(['admin-panel', path])
  }
}
