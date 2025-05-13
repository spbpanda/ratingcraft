import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SbiCustomFile, UploadFileErrors } from '../components/sbi-file-uploader/sbi-file-uploader.models';
import { BASE_FILE_UPLOAD_ERRORS } from '../const/file-upload.const';

/**
 * Абстрактный класс, предоставляющий интерфейс для компонентов загрузчиков файлов.
 *
 * @abstract
 * @Component
 *
 * @template: ``
 * */
@Component({
  template: ``,
})
export abstract class SbiCommonFileUploaderComponent<T extends SbiCustomFile> {
  /**
   * @protected
   * @description Список текстовок ошибок, которые могут возникнуть при загрузке файла.
   * @type {Record<string, string>}
   * @defaultValue BASE_FILE_UPLOAD_ERRORS
   */
  private _errorMessages: Record<string, string> = BASE_FILE_UPLOAD_ERRORS;

  /**
   * @private
   * @description Мапа сиснеймов ошибок, которые могут возникнуть при загрузке файла.
   * @type Record<string, string>
   * @defaultValue UploadFileErrors
   */
  private _errors: Record<string, string> = UploadFileErrors;

  /**
   * @protected
   * @abstract
   * @description Функция прикрепления файлов.
   * @param {Array<T>} files
   */
  protected abstract attachFiles(files: Array<T>): void;

  /**
   * @protected
   * @abstract
   * @description Обработчик ошибки загрузки файла.
   * @param {File} file прикрепляемый ошибочный файл.
   * @param {string} errorMessage текст ошибки.
   */
  protected abstract fileCheckExcept(file: File, errorMessage: string): void;

  /**
   * @protected
   * @abstract
   * @description Функция создания экземпляра кастомного файла.
   * @param {File} file прикрепляемый файл.
   * @param {string | undefined} errorMessage текст ошибки.
   * @return {T}
   */
  protected abstract createCustomFile(file: File, errorMessage: string | undefined): T;

  /**
   * @public
   * @description Список прикреплённых файлов.
   * @type {Array<T>}
   * @defaultValue []
   */
  @Input() public files: Array<T> = [];

  /**
   * @public
   * @description Максимальный размер файла (в мегабайтах).
   * @type {number}
   * @defaultValue 5
   */
  @Input() public maxFileSize: number = 5;

  /**
   * @public
   * @description Максимальный размер всех прикреплённых файлов (в мегабайтах).
   * @type {number}
   * @defaultValue 100
   */
  @Input() public maxAllFilesSize: number = 100;

  /**
   * @public
   * @description максимально допустимо количество файлов для прикрепления.
   * @type {number}
   * @defaultValue 20
   */
  @Input() public maxFileCount: number = 20;

  /**
   * @public
   * @description Список допустимых для прикрепления форматов файлов.
   * @type {Array<string>}
   * @defaultValue []
   */
  @Input() public fileTypes: Array<string> = [];

  /**
   * @public
   * @setter
   * @description Устанавливает сиснеймы ошибок, которые могут возникнуть при загрузке файла.
   * @param {Record<string, string>} errors
   */
  @Input()
  public set errors(errors: Record<string, string>) {
    this._errors = { ...errors, ...UploadFileErrors };
  };

  /**
   * @public
   * @description Флаг, обозначающий возможность прикрепления файлов с ошибками.
   * @type boolean
   * @defaultValue false
   */
  @Input() public uploadFilesWithError: boolean = false;

  /**
   * @public
   * @description Флаг, обозначающий блокировку поля для взаимодействия.
   * @type boolean
   * @defaultValue false
   */
  @Input() public disabled: boolean = false;

  /**
   * @public
   * @description Флаг, обозначающий обязательность прикрепления хотя бы одного файла.
   * @type boolean
   * @defaultValue false
   */
  @Input() public required: boolean = false;

  /**
   * @public
   * @description Флаг, обозначающий возможность прикрепления нескольких файлов разом.
   * @type boolean
   * @defaultValue false
   */
  @Input() public isMultiple: boolean = false;

  /**
   * @public
   * @description Текст, отображаемый при наведении файла на область элемента.
   * @type string
   * @defaultValue ''
   */
  @Input() public uploaderOveredLabel: string = '';

  /**
   * @public
   * @description Текст глобальной ошибки, отображаемый в элементе.
   * @type string
   * @defaultValue ''
   */
  @Input() public errorMessage: string = '';

  /**
   * @public
   * @setter
   * @description Объединяет тексты ошибок переданные в компонент с текстами из BASE_FILE_UPLOAD_ERRORS.
   * @param {Record<string, string>} errorMessages - кастомный список ошибок
   */
  @Input()
  public set errorMessages(errorMessages: Record<string, string>) {
    this._errorMessages = { ...errorMessages, ...BASE_FILE_UPLOAD_ERRORS };
  }

  /**
   * @public
   * @description Проверяет можно ли прикрепить выбранный пользователем файл.
   * @type {(file: File) => string | undefined}
   * @return {string | undefined} string - сиснейм ошибки прикрепления (UploadFileErrors), undefined - файл доступен для прикрепления.
   */
  @Input() public fileCheck: (file: File) => string | undefined = (file: File): string | undefined => {
    if (this.files.length + 1 > this.maxFileCount) {
      return this._errors['filesLimitExceeded'];
    }

    let allSize = this.getMbFromBite(file.size);
    this.files.forEach(file => (allSize += this.getMbFromBite(file.file.size)));
    if (allSize > this.maxAllFilesSize) {
      return this._errors['filesAmountExceeded'];
    }

    if (this.files.find(f => f.file.name === file.name)) {
      return this._errors['fileAlreadyUploaded'];
    }

    if (this.getMbFromBite(file.size) > this.maxFileSize) {
      return this._errors['fileLimitExceeded'];
    }

    if (!this.fileTypes.includes(file.type)) {
      return this._errors['invalidFileFormat'];
    }
    return;
  }

  /**
   * @public
   * @description Событие удаления файла.
   * @type {EventEmitter<T>}
   */
  @Output() public deleteFileEvent: EventEmitter<T> = new EventEmitter<T>();

  /**
   * @public
   * @description Событие прикрепления файла\файлов. Возвращает все прикреплённые файлы.
   * @type {EventEmitter<Array<T>>}
   */
  @Output() public filesAttachedEvent: EventEmitter<Array<T>> = new EventEmitter<Array<T>>();

  /**
   * @public
   * @description Обрабатывает список файлов, прикреплённых с помощью директивы.
   * @param {FileList} fileList
   */
  public fileDirectiveHandler(fileList: FileList) {
    fileList && this.filesCheck(fileList);
  }

  /**
   * @public
   * @description Обрабатывает список файлов, прикреплённых с помощью html.
   * @param {Event} fileList
   */
  public fileBrowseHandler(fileList: Event) {
    const files = (fileList.target as HTMLInputElement).files;
    files && this.filesCheck(files);
  }

  /**
   * @private
   * @description Обрабатывает список прикрепляемых файлов на наличие ошибок и возможность прикрепления.
   * @param {FileList} fileList
   */
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

  /**
   * @protected
   * @description Считает размер файла в мегабайтах.
   * @param {number} bite
   * @return {number}
   */
  protected getMbFromBite(bite: number): number {
    return +(bite / (1024 * 1024)).toFixed(2);
  }

  /**
   * @public
   * @description Обрабатывает событие удаления файла.
   * @param {T} deletedFile
   */
  public deleteFile(deletedFile: T) {
    this.files = this.files.filter(file => file.file.name !== deletedFile.file.name);
    this.deleteFileEvent.emit(deletedFile);
  }
}
