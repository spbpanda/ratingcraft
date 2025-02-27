import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICustomFile, UploadFileErrors } from '../models/upload-files';

@Component({
  template: ``,
})
export abstract class SbiCommonFileUploaderComponent<T extends ICustomFile> {

  protected abstract attachFiles(files: T[]): void;
  protected abstract fileCheckExcept(file: File, errorMessage: string): void;
  protected abstract createCustomFile(file: File, errorMessage: string | undefined): T;

  @Input() files: T[] = [];
  @Input() maxFileSize = 5;
  @Input() maxAllFilesSize = 100;
  @Input() maxFileCount = 20;
  @Input() fileTypes: string[] = [];
  @Input() errors = UploadFileErrors;
  @Input() uploadFilesWithError = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() isMultiple = false;
  @Input() uploaderOveredLabel = '';
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
        const errorMessage = this.fileCheck(file);
        if (!!errorMessage) {
          this.fileCheckExcept(file, errorMessage);
        }
        const customFile = this.createCustomFile(file, errorMessage);
        this.uploadFilesWithError && this.files.push(customFile);
        attachedFiles.push(customFile);
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
