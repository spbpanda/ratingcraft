import { Component, Inject, inject } from '@angular/core';
import { NgForOf } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { DOCUMENT_FILL } from '../../../../const/icons';
import { DocumentModalForm } from './sbi-document-modal-form.models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SbiDialogComponent } from '../../../sbi-dialog/sbi-dialog.component';
import { SbiOptionalCardComponent } from '../../../sbi-optional-card/sbi-optional-card.component';
import { SbiTooltipDirective } from '../../../sbi-tooltip/sbi-tooltip.directive';

/**
 * Компонент модального окна со списком документов. Используется совместно с компонентом sidebar.
 *
 * @Component
 * @selector: 'sbi-documents-modal-form'
 * @standalone: true
 * @imports: [SbiDialogComponent, SbiOptionalCardComponent, NgForOf, SbiTooltipDirective]
 * @templateUrl: './sbi-document-modal-form.component.html'
 * @styleUrls: ['./sbi-document-modal-form.component.scss']
 */
@Component({
  selector: 'sbi-documents',
  standalone: true,
  imports: [SbiDialogComponent, SbiOptionalCardComponent, NgForOf, SbiTooltipDirective],
  templateUrl: './sbi-document-modal-form.component.html',
  styleUrls: ['./sbi-document-modal-form.component.scss'],
})
export class SbiDocumentModalFormComponent {
  /**
   * @public
   * @readonly
   * @description Экземпляр DialogRef<SbiDocumentModalFormComponent>.
   * @type {DialogRef<SbiDocumentModalFormComponent>}
   * */
  public readonly dialogRef: DialogRef<SbiDocumentModalFormComponent> = inject(DialogRef<SbiDocumentModalFormComponent>);

  /**
   * @public
   * @readonly
   * @description Иконка документа.
   * @type {string}
   * @defaultValue DOCUMENT_FILL
   * */
  public readonly documentIcon: string = DOCUMENT_FILL;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DocumentModalForm) {
  }

  /**
   * @public
   * @description Обрабатывает скачивание документа.
   * */
  public openDocument(href: string) {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.click();
    a.remove();
  }
}
