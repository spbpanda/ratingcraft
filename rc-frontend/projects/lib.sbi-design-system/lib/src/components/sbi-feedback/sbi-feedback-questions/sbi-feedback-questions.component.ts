import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForOf, NgIf } from '@angular/common';
import { FeedbackQuestion } from '../../../models/feedback-question';
import { SbiOptionalCardComponent } from '../../sbi-optional-card/sbi-optional-card.component';
import { SbiTextareaComponent } from '../../sbi-textarea/sbi-textarea.component';
import { FormControl } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'sbi-feedback-questions',
  standalone: true,
  imports: [NgForOf, SbiOptionalCardComponent, SbiTextareaComponent, NgIf],
  templateUrl: './sbi-feedback-questions.component.html',
  styleUrl: './sbi-feedback-questions.component.scss',
})
export class SbiFeedbackQuestionsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  private compareFn = (elem1: FeedbackQuestion, elem2: FeedbackQuestion) =>
    JSON.stringify(elem1) === JSON.stringify(elem2);
  private selectedFeedbackQuestions = new SelectionModel<FeedbackQuestion>(true, [], true, this.compareFn);

  public comment = new FormControl('');

  @Input() questions: FeedbackQuestion[] = [];
  @Input() testId: string = 'sbi-feedback-questions-test-id';

  @Output() changeSelectedFeedbackQuestions = new EventEmitter<FeedbackQuestion[]>();
  @Output() changeComment = new EventEmitter<string>();

  public get showComment() {
    return this.selectedFeedbackQuestions.isSelected({label: 'Другое'})
  }

  ngOnInit() {
    this.comment.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300))
      .subscribe(comment => this.changeComment.emit(comment || ''));
  }

  public onSelectedFeedbackQuestions(selectedFeedbackQuestion: FeedbackQuestion) {
    this.selectedFeedbackQuestions.toggle(selectedFeedbackQuestion);
    this.changeSelectedFeedbackQuestions.emit(this.selectedFeedbackQuestions.selected);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
