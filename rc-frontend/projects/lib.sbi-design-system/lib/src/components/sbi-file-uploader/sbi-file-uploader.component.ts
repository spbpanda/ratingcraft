import { Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { SbiCommonFileUploaderComponent } from '../../classes/sbi-common-file-uploader.component';
import { ICustomFile } from '../../models/upload-files';
import { DragAndDropDirective } from '../../directives/sbi-upload-file.directive';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SbiButtonComponent } from '../sbi-button/sbi-button.component';
import { SbiProgressSpinnerComponent } from '../sbi-progress-spinner/sbi-progress-spinner.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { CLEAR_UPLOADED_FILE_ICON } from '../../const/icons';
import { SbiStatusComponent } from '../sbi-status/sbi-status.component';

@Component({
  selector: 'sbi-file-uploader',
  templateUrl: './sbi-file-uploader.component.html',
  styleUrls: ['./sbi-file-uploader.component.scss'],
  standalone: true,
  imports: [
    DragAndDropDirective,
    NgIf,
    SbiButtonComponent,
    NgForOf,
    SbiProgressSpinnerComponent,
    SbiIconComponent,
    NgClass,
    SbiStatusComponent,
  ],
})
export class SbiFileUploaderComponent<T extends ICustomFile> extends SbiCommonFileUploaderComponent<T> {
  @ViewChild('sbiFileUploader') private sbiFileUploader!: ElementRef<HTMLInputElement>;

  public uploaderOvered = signal(false);

  public get clearIcon() {
    return CLEAR_UPLOADED_FILE_ICON;
  }

  @Input() label?: string;
  @Input() note?: string;
  @Input() uploadFileButtonLabel = '';
  @Input() uploadFileLabel = '';
  @Input() filesIsLoading = false;
  @Input() requiredLabel = 'Обязательно';

  @Output() dropLoadingEvent = new EventEmitter();

  protected override attachFiles(files: T[]) {
    this.filesAttachedEvent.emit(files);
  }

  protected fileCheckExcept(file: File, errorMessage: string) {
  }

  protected createCustomFile(file: File, errorMessage: string | undefined) {
    return {file, errorMessage, isValid: !errorMessage} as T;
  }

  public openUploadFileByButton() {
    this.sbiFileUploader.nativeElement?.click();
  }

  public onDropLoading() {
    this.dropLoadingEvent.emit();
  }

  public getFileType(file: File) {
    return file.name.split('.').reverse()[0] ?? '';
  }
}
