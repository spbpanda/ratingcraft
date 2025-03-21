import { Component, inject, OnDestroy } from '@angular/core';
import { RcBackendService } from '../../../services/rc-backend.service';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Server } from '../../../common/interfaces/server';
import { MatIconModule } from '@angular/material/icon';
import { RcButtonComponent } from '../../../components/rc-button/rc-button.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteServerComponent } from '../../../components/delete-server/delete-server.component';
import { Router } from '@angular/router';
import { GetItemValuePipe } from '../../../common/pipes/get-item-value.pipe';

@Component({
  selector: 'rc-my-servers',
  standalone: true,
  imports: [
    AsyncPipe,
    RcButtonComponent,
    MatIconModule,
    GetItemValuePipe
  ],
  templateUrl: './my-servers.component.html',
  styleUrl: './my-servers.component.scss'
})
export class MyServersComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  rcBackend = inject(RcBackendService);
  dialog = inject(MatDialog);
  router = inject(Router);
  servers$: Observable<Server[]> = this.rcBackend.getUserServers()

  promote(server: Server) {
  }
  edit(server: Server) {
    this.router.navigate(['/user/edit-server', server.id]);
  }
  openDeleteConfirmationDialog(server: Server) {
    const dialogRef = this.dialog.open(DeleteServerComponent);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmed) => {
      if (confirmed) {
          try {
            console.log('Сервер удалён', server);
            this.rcBackend.deleteServer(server.id).pipe(take(1)).subscribe(() => {
              this.servers$ = this.rcBackend.getUserServers();
            });
          } catch (error: any) {
            console.error('Ошибка при удалении сервера:', error.message);
          }
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
