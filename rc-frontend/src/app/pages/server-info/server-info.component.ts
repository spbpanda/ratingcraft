import { JsonPipe } from '@angular/common';
import { RcBackendService } from './../../services/rc-backend.service';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'rc-server-info',
  standalone: true,
  imports: [
    JsonPipe
  ],
  templateUrl: './server-info.component.html',
  styleUrl: './server-info.component.scss'
})
export class ServerInfoComponent {
  private activatedRoute = inject(ActivatedRoute);
  private rcBackendService = inject(RcBackendService);
  server: any = null;

  ngOnInit() {
    const serverId = this.activatedRoute.snapshot.paramMap.get('id');
    if (serverId) {
      this.rcBackendService.getServerInfo(Number(serverId)).pipe(take(1)).subscribe((serverInfo: any) => this.server = serverInfo)
    }
  }

}
