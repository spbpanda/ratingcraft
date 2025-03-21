import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICustomFile, UploadFileErrors } from '../models/upload-files';
import { BASE_FILE_UPLOAD_ERRORS } from '../const/file-upload.const';

@Component({
  template: ``,
})
export abstract class SbiCommonFileUploaderComponent<T extends ICustomFile> {
  protected abstract attachFiles(files: T[]): void;

  protected abstract fileCheckExcept(file: File, errorMessage: string): void;

  protected abstract createCustomFile(file: File, errorMessage: string | undefined): T;

  private _errorMessages: Record<string, string> = BASE_FILE_UPLOAD_ERRORS;

  @Input() files: T[] = [];
  @Input() maxFileSize = 5;
  @Input() maxAllFilesSize = 100;
  @Input() maxFileCount = 20;
  @Input() fileTypes: string[] = [];
  @Input() errors: Record<string, string> = UploadFileErrors;
  @Input() uploadFilesWithError = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() isMultiple = false;
  @Input() uploaderOveredLabel = '';
  @Input() errorMessage = '';

  @Input() set errorMessages(errorMessages: Record<string, string>) {
    this._errorMessages = { ...errorMessages, ...BASE_FILE_UPLOAD_ERRORS };
  }

  @Input()
  fileCheck(file: File): string | undefined {
    if (this.files.length + 1 > this.maxFileCount) {
      return UploadFileErrors.filesLimitExceeded;
    }

    let allSize = this.getMbFromBite(file.size);
    this.files.forEach(file => (allSize += this.getMbFromBite(file.file.size)));
    if (allSize > this.maxAllFilesSize) {
      return UploadFileErrors.filesAmountExceeded;
    }

    if (this.files.find(f => f.file.name === file.name)) {
      return UploadFileErrors.fileAlreadyUploaded;
    }

    if (this.getMbFromBite(file.size) > this.maxFileSize) {
      return UploadFileErrors.fileLimitExceeded;
    }

    if (!this.fileTypes.includes(file.type)) {
      return UploadFileErrors.invalidFileFormat;
    }
    return;
  }

  @Output() deleteFileEvent = new EventEmitter<T>();
  @Output() filesAttachedEvent = new EventEmitter<T[]>();

  public fileDirectiveHandler(fileList: FileList) {
    fileList && this.filesCheck(fileList);
  }

  public fileBrowseHandler(fileList: Event) {
    const files = (fileList.target as HTMLInputElement).files;
    files && this.filesCheck(files);
  }

  private filesCheck(fileList: FileList) {
    const attachedFiles: T[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      if (file) {
        const errorFileUpload = this.fileCheck(file);
        const customFile = this.createCustomFile(file, errorFileUpload);
        if (!!errorFileUpload) {
          this.fileCheckExcept(file, errorFileUpload);
          if (this.uploadFilesWithError) {
            attachedFiles.push(customFile);
          } else {
            this.errorMessage = this._errorMessages[errorFileUpload] ?? '';
          }
        } else {
          attachedFiles.push(customFile);
        }
      }
    }
    //Другие обработчики ошибок файлов

    this.attachFiles(attachedFiles);
  }

  protected getMbFromBite(bite: number) {
    return +(bite / (1024 * 1024)).toFixed(2);
  }

  public deleteFile(deletedFile: T) {
    this.files = this.files.filter(file => file.file.name !== deletedFile.file.name);
    this.deleteFileEvent.emit(deletedFile);
  }
}
