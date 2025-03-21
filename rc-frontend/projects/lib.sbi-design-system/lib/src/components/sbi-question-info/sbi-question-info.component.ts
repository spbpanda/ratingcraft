import { SbiTooltipDirective } from '../sbi-tooltip/sbi-tooltip.directive';
import { Component, Input, TemplateRef } from '@angular/core';
import { QUESTION_MARK_SVG_ICON } from './../../const/icons';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';

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
  imports: [
    SbiIconComponent,
    SbiTooltipDirective,
  ],
  templateUrl: './sbi-question-info.component.html',
  styleUrl: './sbi-question-info.component.scss'
})
export class SbiQuestionInfoComponent {
  /**
   * Позиция всплывающей подсказки (tooltip). Может быть 'top', 'bottom', 'left' или 'right'.
   * По умолчанию 'bottom'.
   * @type {'top' | 'bottom'}
   */
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  /**
   * Контент всплывающей подсказки (tooltip). Может быть строкой или шаблоном (TemplateRef).
   * @type {string | TemplateRef<any> | null}
   */
  @Input() tooltipContent: string | TemplateRef<any> | null = null;

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId = 'sbi-test-id';

  /**
   * Иконка вопросительного знака, используемая в компоненте.
   * @type {string}
   */
  questionIcon = QUESTION_MARK_SVG_ICON;

}
