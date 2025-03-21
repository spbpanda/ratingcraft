import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[sbiUploadFile]',
  standalone: true,
})
export class DragAndDropDirective {
  @HostBinding('class.sbi-file-over') fileOver?: boolean;
  @Output() fileDropped = new EventEmitter<FileList>();
  @Output() uploaderOvered = new EventEmitter<boolean>();

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
    this.uploaderOvered.emit(this.fileOver);
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    this.uploaderOvered.emit(this.fileOver);
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    this.uploaderOvered.emit(this.fileOver);
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
