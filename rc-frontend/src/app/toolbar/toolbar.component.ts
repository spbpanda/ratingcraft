import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { SbiDarkSliderComponent, SbiButtonComponent, SbiIconComponent, ARROW_DOWN } from '@sbi/design-system';
import { LoginComponent } from '../components/login/login.component';
import { AuthService } from '../services/auth.service';
import { User } from '../common/interfaces/user';
import { Subject, take, takeUntil } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'rc-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatMenuModule,
    SbiDarkSliderComponent,
    SbiButtonComponent,
    SbiIconComponent,
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

  arrow_down = ARROW_DOWN;

  user: User | null = null;

  ngOnInit() {
    this.dialog.afterAllClosed
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.user = this.authService.getLoggedInUser();
      console.log(this.user)

    });
  }

  openLoginDialog() {
   this.dialog.open(LoginComponent);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.logout();
  }
}
