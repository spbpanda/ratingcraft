import { Component, Inject, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SbiSidebarPromoCodeModalForm } from './sbi-promo-code-modal-form.models';
import { SbiDialogComponent } from '../../../sbi-dialog/sbi-dialog.component';
import { SbiInputComponent } from '../../../sbi-input/sbi-input.component';

/**
 * Компонент модального окна с полем ввода промокода. Используется совместно с компонентом sidebar.
 *
 * @Component
 * @selector: 'sbi-promo-code-modal-form'
 * @standalone: true
 * @imports: [SbiDialogComponent, SbiInputComponent, NgIf, AsyncPipe]
 * @templateUrl: './sbi-promo-code-modal-form.component.html'
 * @styleUrls: ['./sbi-promo-code-modal-form.component.scss']
 */
@Component({
  selector: 'sbi-promo-code',
  standalone: true,
  imports: [SbiDialogComponent, SbiInputComponent, NgIf, AsyncPipe],
  templateUrl: './sbi-promo-code-modal-form.component.html',
  styleUrls: ['./sbi-promo-code-modal-form.component.scss'],
})
export class SbiPromoCodeModalFormComponent implements OnInit, OnDestroy {
  /**
   * @private
   * @readonly
   * @description Событие уничтожения компонента, используется для отписок.
   * @type {Subject<void>}
   * */
  private readonly destroy$: Subject<void> = new Subject<void>();

  /**
   * @public
   * @readonly
   * @description Экземпляр DialogRef<SbiPromoCodeModalFormComponent>.
   * @type {DialogRef<SbiPromoCodeModalFormComponent>}
   * */
  public readonly dialogRef: DialogRef<SbiPromoCodeModalFormComponent> = inject(DialogRef<SbiPromoCodeModalFormComponent>);

  /**
   * @public
   * @description Отображать ли статус применённости промокода.
   * @type {WritableSignal<boolean>}
   * */
  public showPromoCodeStatusText: WritableSignal<boolean> = signal(false);

  constructor(@Inject(MAT_DIALOG_DATA) public data: SbiSidebarPromoCodeModalForm) {
  }

  ngOnInit() {
    this.showPromoCodeStatusText.set(!!this.data.promoCodeControl.value);
    this.connectChangePromoCode();
  }

  /**
   * @private
   * @description Подписка на изменение поля промокода.
   * */
  private connectChangePromoCode() {
    this.data.promoCodeControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(100), distinctUntilChanged())
      .subscribe(() => {
        if (this.showPromoCodeStatusText()) {
          this.data.applyPromo$.next(this.data.promoCodeControl.value || '');
          this.showPromoCodeStatusText.set(false);
        }
      });
  }

  /**
   * @public
   * @description Обработка события применения промокода.
   * */
  public applyPromo() {
    this.data.applyPromo$.next(this.data.promoCodeControl.value || '');
    this.showPromoCodeStatusText.set(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
