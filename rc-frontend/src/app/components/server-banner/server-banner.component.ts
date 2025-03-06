import { Component, inject, Input } from '@angular/core';
import { Server } from '../../common/interfaces/server';
import { RcButtonComponent } from '../rc-button/rc-button.component';
import { SbiChipComponent } from '@sbi/design-system';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'rc-server-banner',
  standalone: true,
  imports: [
    MatIconModule,
    SbiChipComponent,
    RcButtonComponent,
  ],
  templateUrl: './server-banner.component.html',
  styleUrl: './server-banner.component.scss'
})
export class ServerBannerComponent {
  @Input() index!: number;
  @Input() server!: Server;

  private route = inject(Router);

  redirectToServer(id: number) {
    this.route.navigate(['server-info', id]);
  }
}
