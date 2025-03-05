import { JsonPipe, NgFor } from '@angular/common';
import { RcBackendService } from './../../../services/rc-backend.service';
import { Component, inject } from '@angular/core';
import { ServerBannerComponent } from '../../../components/server-banner/server-banner.component';

@Component({
  selector: 'rc-servers',
  standalone: true,
  imports: [
    JsonPipe,
    NgFor,
    ServerBannerComponent
  ],
  templateUrl: './servers.component.html',
  styleUrl: './servers.component.scss'
})
export class ServersComponent {
  rcBackendService = inject(RcBackendService);
  servers = this.rcBackendService.servers;

}
