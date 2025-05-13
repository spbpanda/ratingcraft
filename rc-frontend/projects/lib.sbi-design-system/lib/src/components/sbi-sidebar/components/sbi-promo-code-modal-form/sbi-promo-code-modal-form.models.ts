import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

/**
 * @description Модель конфигурации модального окна с промокодом. Используется для передачи через @Input в компонент sidebar.
 * */
export interface SbiSidebarPromoCodeConfiguration {
  title?: string;
  submitButtonTitle?: string;
  validApplyPromoLabel?: string;
  inValidApplyPromoLabel?: string;
}

/**
 * @description Модель конфигурации для открытия модального окна с промокодом из компонента sidebar.
 * */
export interface SbiSidebarPromoCodeModalForm extends SbiSidebarPromoCodeConfiguration {
  promoCodeCheck$: Observable<boolean>;
  applyPromo$: Subject<string>;
  promoCodeControl: FormControl<string | null>;
}
