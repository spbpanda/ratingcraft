import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForOf, NgIf } from '@angular/common';
import { SbiOptionalCardComponent } from '../../sbi-optional-card/sbi-optional-card.component';
import { SbiTextareaComponent } from '../../sbi-textarea/sbi-textarea.component';
import { FormControl } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SbiFeedbackQuestion } from "../sbi-feedback.models";

@Component({
  selector: 'sbi-feedback-questions',
  standalone: true,
  imports: [NgForOf, SbiOptionalCardComponent, SbiTextareaComponent, NgIf],
  templateUrl: './sbi-feedback-questions.component.html',
  styleUrl: './sbi-feedback-questions.component.scss',
})
export class SbiFeedbackQuestionsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  private compareFn = (elem1: SbiFeedbackQuestion, elem2: SbiFeedbackQuestion) =>
    JSON.stringify(elem1) === JSON.stringify(elem2);
  public selectedFeedbackQuestions = new SelectionModel<SbiFeedbackQuestion>(true, [], true, this.compareFn);

  public commentControl = new FormControl('');

  @Input() questions: Array<SbiFeedbackQuestion> = [];
  @Input() testId: string = 'sbi-feedback-questions-test-id';

  @Input() set selectedQuestions(selectedQuestions: Array<SbiFeedbackQuestion>) {
    this.selectedFeedbackQuestions.clear();
    this.selectedFeedbackQuestions.select(...selectedQuestions);
  }

  @Input() set comment(comment: string) {
    this.commentControl.setValue(comment);
  }

  @Output() changeSelectedFeedbackQuestions = new EventEmitter<Array<SbiFeedbackQuestion>>();
  @Output() changeComment = new EventEmitter<string>();

  public get showComment() {
    return this.selectedFeedbackQuestions.isSelected({ label: 'Другое' })
  }

  ngOnInit() {
    this.commentControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300))
      .subscribe(comment => this.changeComment.emit(comment || ''));
  }

  public onSelectedFeedbackQuestions(selectedFeedbackQuestion: SbiFeedbackQuestion) {
    if (selectedFeedbackQuestion.label === 'Другое') {
      this.commentControl.setValue('');
    }
    if (this.selectedFeedbackQuestions.isSelected(selectedFeedbackQuestion)) {
      this.changeSelectedFeedbackQuestions.emit(this.selectedFeedbackQuestions.selected.filter(elem => !this.compareFn(elem, selectedFeedbackQuestion)))
    } else {
      this.changeSelectedFeedbackQuestions.emit(this.selectedFeedbackQuestions.selected.concat(selectedFeedbackQuestion));
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
