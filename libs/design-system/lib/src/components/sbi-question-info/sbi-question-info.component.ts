import { SbiTooltipDirective } from '../sbi-tooltip/sbi-tooltip.directive';
import { Component, Input, TemplateRef } from '@angular/core';
import { QUESTION_MARK_SVG_ICON } from './../../const/icons';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';

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
  @Input() tooltipPosition: 'top' | 'bottom' = 'bottom';
  @Input() tooltipContent: string | TemplateRef<any> | null = null;
  @Input() testId = 'sbi-test-id';

  questionIcon = QUESTION_MARK_SVG_ICON;

}
