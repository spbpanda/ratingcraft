import { Component, Input } from '@angular/core';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiButtonType } from "../sbi-button/sbi-button.models";
import { SbiIconButtonAppearance } from "./sbi-icon-button.models";

/**
 * Компонент кнопки-иконки.
 *
 * @Component
 * @selector: 'sbi-icon-button'
 * @standalone: true
 * @imports: [SbiIconComponent,]
 * @templateUrl: './sbi-icon-button.component.html'
 * @styleUrl: './sbi-icon-button.component.scss'
 * @host: { '[class.disabled]': 'disabled' }
 */
@Component({
  selector: 'sbi-icon-button',
  standalone: true,
  imports: [SbiIconComponent,],
  templateUrl: './sbi-icon-button.component.html',
  styleUrl: './sbi-icon-button.component.scss',
  host: {
    '[class.disabled]': 'disabled',
  },
})
export class SbiIconButtonComponent {
  /**
   * @public
   * @description SVG icon.
   * @type {string}
   * @defaultValue ''
   */
  @Input({ required: true }) public icon: string = '';

  /**
   * @public
   * @description Цвет иконки (hover/focus/disabled).
   * @type {'primary' | 'warn'}
   * @defaultValue 'primary'
   */
  @Input() public appearance: SbiIconButtonAppearance = 'primary';

  /**
   * @public
   * @description Тип кнопки.
   * @type {'button' | 'submit' | 'reset'}
   * @defaultValue 'button'
   */
  @Input() public type: SbiButtonType = 'button';

  /**
   * @public
   * @description Активный/неактивный.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public disabled: boolean = false;

  /**
   * @public
   * @description id для авто тестов.
   * @type {string}
   * @defaultValue 'sbi-icon-button'
   */
  @Input() public testId: string = 'sbi-icon-button';

}
