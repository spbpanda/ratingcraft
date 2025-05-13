import { SbiTooltipDirective } from '../sbi-tooltip/sbi-tooltip.directive';
import { Component, Input, TemplateRef } from '@angular/core';
import { STATUS_QUESTION_FILL } from '../../const/icons';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiTooltipContent, SbiTooltipPosition } from '../sbi-tooltip/sbi-tooltip.models';

/**
 * Компонент для отображения иконки с вопросительным знаком и всплывающей подсказкой (tooltip).
 *
 * @Component
 * @selector: 'sbi-question-info'
 * @standalone: true
 * @imports: [SbiIconComponent, SbiTooltipDirective]
 * @templateUrl: './sbi-question-info.component.html'
 * @styleUrl: './sbi-question-info.component.scss'
 */
@Component({
  selector: 'sbi-question-info',
  standalone: true,
  imports: [SbiIconComponent, SbiTooltipDirective],
  templateUrl: './sbi-question-info.component.html',
  styleUrl: './sbi-question-info.component.scss'
})
export class SbiQuestionInfoComponent {
  /**
   * @public
   * @description Позиция всплывающей подсказки (tooltip). Может быть 'top', 'bottom', 'left' или 'right'.
   * @type {'top' | 'bottom' | 'left' | 'right'}
   * @defaultValue 'bottom'
   */
  @Input() tooltipPosition: SbiTooltipPosition = 'bottom';

  /**
   * @public
   * @description Контент всплывающей подсказки (tooltip). Может быть строкой или шаблоном (TemplateRef).
   * @type {string | TemplateRef<any> | null}
   * @defaultValue null
   */
  @Input() tooltipContent: SbiTooltipContent = null;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-test-id'
   */
  @Input() testId: string = 'sbi-test-id';

  /**
   * @public
   * @description Иконка вопросительного знака, используемая в компоненте.
   * @type {string}
   * @defaultValue STATUS_QUESTION_FILL
   */
  public questionIcon: string = STATUS_QUESTION_FILL;

}
