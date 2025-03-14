import { RcBackendService } from './../../../services/rc-backend.service';
import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { ServerBannerComponent } from '../../../components/server-banner/server-banner.component';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { take } from 'rxjs';

@Component({
  selector: 'rc-servers',
  standalone: true,
  imports: [
    ServerBannerComponent,
    MatPaginatorModule
  ],
  templateUrl: './servers.component.html',
  styleUrl: './servers.component.scss'
})
export class ServersComponent {
  @Output() onFindServers: EventEmitter<any> = new EventEmitter();
  rcBackend = inject(RcBackendService);
  servers = this.rcBackend.servers;
  paginatorBack = this.rcBackend.paginator;
  pageSize = 10;
  pageIndex = 0;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.rcBackend.updateFilterPagination(this.pageIndex, this.pageSize);
    this.rcBackend.findServers().pipe(take(1)).subscribe();
  }
}
