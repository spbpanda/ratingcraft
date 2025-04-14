import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { SbiDarkSliderComponent, SbiButtonComponent, SbiIconComponent, BUTTON_ARROWS_DOWN } from '@sbi/design-system';
import { LoginComponent } from '../components/login/login.component';
import { AuthService } from '../services/auth.service';
import { User } from '../common/interfaces/user';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RcButtonComponent } from '../components/rc-button/rc-button.component';

@Component({
  selector: 'rc-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatMenuModule,
    SbiDarkSliderComponent,
    SbiButtonComponent,
    SbiIconComponent,
    RcButtonComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly dialog = inject(MatDialog);
  readonly authService = inject(AuthService);
  user: User | null = this.authService.getLoggedInUser();
  arrow_down = BUTTON_ARROWS_DOWN;

  ngOnInit() {
  }

  openLoginDialog() {
   var dialogRef = this.dialog.open(LoginComponent);
   
   dialogRef.afterClosed()
   .pipe(takeUntil(this.destroy$))
   .subscribe(() => {
     this.user = this.authService.getLoggedInUser();
     console.log(this.user)

   });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
