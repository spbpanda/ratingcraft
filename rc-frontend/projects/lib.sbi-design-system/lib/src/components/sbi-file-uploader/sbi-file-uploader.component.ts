import { Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild, WritableSignal } from '@angular/core';
import { SbiCommonFileUploaderComponent } from '../../classes/sbi-common-file-uploader.component';
import { SbiCustomFile } from './sbi-file-uploader.models';
import { DragAndDropDirective } from '../../directives/sbi-upload-file.directive';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SbiButtonComponent } from '../sbi-button/sbi-button.component';
import { SbiProgressSpinnerComponent } from '../sbi-progress-spinner/sbi-progress-spinner.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { CLEAR_UPLOADED_FILE_ICON } from '../../const/icons';
import { SbiStatusComponent } from '../sbi-status/sbi-status.component';

/**
 * Компонент загрузчика файлов.
 * - не имеет пред просмотра загруженных файлов;
 * - имеет возможность удаления прикреплённых файлов
 * - имеет возможность загрузить несколько или один файл
 * - имеет возможность отобразить ошибку прикрепления файлов.
 *
 * @Component
 * selector: 'sbi-file-uploader'
 * @templateUrl: './sbi-file-uploader.component.html'
 * @styleUrls: ['./sbi-file-uploader.component.scss']
 * @standalone: true
 * @imports: [
 *   DragAndDropDirective,
 *   NgIf,
 *   SbiButtonComponent,
 *   NgForOf,
 *   SbiProgressSpinnerComponent,
 *   SbiIconComponent,
 *   NgClass,
 *   SbiStatusComponent,
 * ]
 */
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
export class SbiFileUploaderComponent<T extends SbiCustomFile> extends SbiCommonFileUploaderComponent<T> {
  /**
   * @private
   * @description Элемент поля ввода загрузчика файлов взятый из DOM.
   * @type {ElementRef<HTMLInputElement>}
   * @defaultValue ElementRef<HTMLInputElement>
   */
  @ViewChild('sbiFileUploader') private sbiFileUploader!: ElementRef<HTMLInputElement>;

  /**
   * @public
   * @description Состояние наведения на загрузчик файлов файла.
   * @type {WritableSignal<boolean>}
   * @defaultValue false
   */
  public uploaderOvered: WritableSignal<boolean> = signal(false);

  /**
   * @public
   * @getter
   * @description Возвращает иконку удаления файла.
   * @return string
   */
  public get clearIcon(): string {
    return CLEAR_UPLOADED_FILE_ICON;
  }

  /**
   * @public
   * @description Заголовок загрузчика файлов.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public label?: string;

  /**
   * @public
   * @description Примечание загрузчика файлов.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public note?: string;

  /**
   * @public
   * @description Текст кнопки прикрепления файла.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public uploadFileButtonLabel: string = '';

  /**
   * @public
   * @description Текст кнопки, появляющийся при наведении файлом на загрузчик файлов.
   * @type {string}
   * @defaultValue ''
   */
  @Input() public uploadFileLabel: string = '';

  /**
   * @public
   * @description Флаг, обозначающий процесс загрузки файла.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public filesIsLoading: boolean = false;

  /**
   * @public
   * @description Текстовка обязательного прикрепления файла.
   * @type {string}
   * @defaultValue 'Обязательно'
   */
  @Input() public requiredLabel: string = 'Обязательно';

  /**
   * @public
   * @description Событие остановки загрузки файлов.
   * @type {EventEmitter<void>}
   */
  @Output() public dropLoadingEvent: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @protected
   * @override
   * @description Обработчкик прикрепления файлов.
   * @param {Array<T>} files
   */
  protected override attachFiles(files: Array<T>) {
    this.filesAttachedEvent.emit(files);
  }

  /**
   * @protected
   * @description Обработка ошибочного файла.
   * @param {File} file Ошибочный файл
   * @param {string} errorMessage Текст ошибки
   */
  protected fileCheckExcept(file: File, errorMessage: string) {
  }

  /**
   * @protected
   * @description Создание экземпляра прикреплённого файла.
   * @param {File} file Ошибочный файл
   * @param {string | undefined} errorMessage Текст ошибки
   * @return {T}
   */
  protected createCustomFile(file: File, errorMessage: string | undefined): T {
    return { file, errorMessage, isValid: !errorMessage } as T;
  }

  /**
   * @public
   * @description Нажатие на кнопку прикрепления файлов.
   */
  public openUploadFileByButton() {
    this.sbiFileUploader.nativeElement?.click();
  }

  /**
   * @public
   * @description Обработка события остановки загрузки.
   */
  public onDropLoading() {
    this.dropLoadingEvent.emit();
  }

  /**
   * @public
   * @description Возвращает тип файла.
   * @param {File} file
   * @return {string}
   */
  public getFileType(file: File): string {
    return file.name.split('.').reverse()[0] ?? '';
  }
}
