import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SbiDarkSliderComponent, SbiButtonComponent, SbiDialogComponent } from '@sbi/design-system';
import { LoginComponent } from '../components/login/login.component';
import { AuthService } from '../services/auth.service';
import { User } from '../common/interfaces/user';
import { take } from 'rxjs';

@Component({
  selector: 'rc-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    SbiDarkSliderComponent,
    SbiButtonComponent,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  private readonly dialog = inject(MatDialog);
  readonly authService = inject(AuthService);
  user: User | null = null;

  ngOnInit() {
    this.dialog.afterAllClosed.pipe(take(1)).subscribe(() => {
      this.user = this.authService.getLoggedInUser();
    });
  }

  openLoginDialog() {
   this.dialog.open(LoginComponent);
  }


}
