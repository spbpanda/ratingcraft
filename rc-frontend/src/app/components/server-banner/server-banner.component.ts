import { ClipboardService } from './../../services/clipboard.service';
import { Component, inject, Input } from '@angular/core';
import { Server } from '../../common/interfaces/server';
import { RcButtonComponent } from '../rc-button/rc-button.component';
import { SbiChipComponent, SbiSnackBarService } from '@sbi/design-system';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { GetItemValuePipe } from '../../common/pipes/get-item-value.pipe';
import { BEDROCK_DEFAULT_PORT, JAVA_DEFAULT_PORT } from '../../common/consts/ports';
import { VersionPipe } from '../../common/pipes/version.pipe';

@Component({
  selector: 'rc-server-banner',
  standalone: true,
  imports: [
    MatIconModule,
    SbiChipComponent,
    RcButtonComponent,
    VersionPipe
  ],
  providers: [SbiSnackBarService],
  templateUrl: './server-banner.component.html',
  styleUrl: './server-banner.component.scss'
})
export class ServerBannerComponent {
  @Input() index!: number;
  @Input() server!: Server;

  private route = inject(Router);
  clipboardService = inject(ClipboardService);
  snackbarService = inject(SbiSnackBarService);

  redirectToServer(id: string) {
    this.route.navigate(['server-info', id]);
  }

  async copyText(server: Server) {
    await this.clipboardService.copyToClipboard(server.address);
    setTimeout(() => { this.snackbarService.openSnackBar({title: 'Скопировано!', appearance: 'success'}) },10);
  }

  getServerDomain(server: Server) {
    return server.port === JAVA_DEFAULT_PORT || server.port === BEDROCK_DEFAULT_PORT ? server.address : `${server.address}:${server.port}`
  }
}
