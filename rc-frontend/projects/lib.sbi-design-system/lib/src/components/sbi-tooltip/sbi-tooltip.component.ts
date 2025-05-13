import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { SbiTooltipPosition } from './sbi-tooltip.models';

/**
 * Компонент всплывающей подсказки.
 *
 * @Component
 * @selector: 'sbi-tooltip'
 * @standalone: true
 * @imports: [NgClass, NgTemplateOutlet]
 * @templateUrl: './sbi-tooltip.component.html'
 * @styleUrl: './sbi-tooltip.component.scss'
 */
@Component({
  selector: 'sbi-tooltip',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  templateUrl: './sbi-tooltip.component.html',
  styleUrl: './sbi-tooltip.component.scss'
})
export class SbiTooltipComponent {
  /**
   * @public
   * @description Текстовое значение всплывающей подсказки.
   * @type {string | null}
   * @defaultValue null
   * */
  @Input() public contentText: string | null = null;

  /**
   * @public
   * @description Шаблонное значение всплывающей подсказки.
   * @type {TemplateRef<any> | null}
   * @defaultValue null
   * */
  @Input() public content: TemplateRef<any> | null = null;

  /**
   * @public
   * @description Положение всплывающей подсказки.
   * @type {'top' | 'bottom' | 'left' | 'right'}
   * @defaultValue 'bottom'
   * */
  @Input() public tooltipPosition: SbiTooltipPosition = 'bottom';

  /**
   * @public
   * @description Контекст всплывающей подсказки.
   * @type any
   * @defaultValue undefined
   * */
  @Input() public context: any;
}
