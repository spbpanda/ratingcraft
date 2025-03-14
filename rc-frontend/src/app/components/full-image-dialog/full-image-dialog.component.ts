import { MatButtonModule } from '@angular/material/button';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'rc-full-image-dialog',
  template: `
    <div class="dialog-content">
      <img [src]="data.imageSrc" alt="Full Screenshot" />
      <button mat-icon-button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .dialog-content {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: black;
        max-width: 90vw;
        max-height: 90vh;
      }

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
      }
    `,
  ],
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class FullImageDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { imageSrc: string },
    private dialogRef: MatDialogRef<FullImageDialogComponent>
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
