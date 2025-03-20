import { Location, NgFor, NgIf } from '@angular/common';
import { RcBackendService } from './../../services/rc-backend.service';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FullImageDialogComponent } from '../../components/full-image-dialog/full-image-dialog.component';
import { SbiDividerComponent } from '@sbi/design-system';

@Component({
  selector: 'rc-server-info',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatDialogModule,
    SbiDividerComponent
  ],
  templateUrl: './server-info.component.html',
  styleUrl: './server-info.component.scss'
})
export class ServerInfoComponent {
  private activatedRoute = inject(ActivatedRoute);
  private rcBackend = inject(RcBackendService);
  readonly dialog = inject(MatDialog);
  server: any = null;

  ngOnInit() {
    const serverId = this.activatedRoute.snapshot.paramMap.get('id');
    if (serverId) {
      this.rcBackend.getServerById(Number(serverId)).pipe(take(1)).subscribe((serverInfo: any) => {
        this.server = serverInfo;
      })
    }
  }

  openImageDialog(imageSrc: string) {
    this.dialog.open(FullImageDialogComponent, {
      data: { imageSrc },
      panelClass: 'full-image-dialog',
    });
  }
}
