import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SbiDialogComponent } from '@sbi/design-system';
import { RcButtonComponent } from '../rc-button/rc-button.component';

@Component({
  selector: 'rc-delete-server',
  standalone: true,
  imports: [
    SbiDialogComponent,
    RcButtonComponent
  ],
  templateUrl: './delete-server.component.html',
  styleUrl: './delete-server.component.scss'
})
export class DeleteServerComponent {
  constructor(public dialogRef: MatDialogRef<DeleteServerComponent>) {}
  deleteServer() {
    this.dialogRef.close(true);
  }
}
