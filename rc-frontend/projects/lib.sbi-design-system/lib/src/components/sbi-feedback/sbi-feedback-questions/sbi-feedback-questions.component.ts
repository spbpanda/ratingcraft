import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForOf } from '@angular/common';
import { FeedbackQuestion } from '../../../models/feedback-question';
import { SbiOptionalCardComponent } from '../../sbi-optional-card/sbi-optional-card.component';

@Component({
  selector: 'sbi-feedback-questions',
  standalone: true,
  imports: [NgForOf, SbiOptionalCardComponent],
  templateUrl: './sbi-feedback-questions.component.html',
  styleUrl: './sbi-feedback-questions.component.scss',
})
export class SbiFeedbackQuestionsComponent {
  private compareFn = (elem1: FeedbackQuestion, elem2: FeedbackQuestion) =>
    JSON.stringify(elem1) === JSON.stringify(elem2);
  private selectedFeedbackQuestions = new SelectionModel<FeedbackQuestion>(true, [], true, this.compareFn);

  @Input() questions: FeedbackQuestion[] = [];
  @Input() testId: string = 'sbi-feedback-questions-test-id';

  @Output() changeSelectedFeedbackQuestions = new EventEmitter<FeedbackQuestion[]>();

  onSelectedFeedbackQuestions(selectedFeedbackQuestion: FeedbackQuestion) {
    this.selectedFeedbackQuestions.toggle(selectedFeedbackQuestion);
    this.changeSelectedFeedbackQuestions.emit(this.selectedFeedbackQuestions.selected);
  }
}
