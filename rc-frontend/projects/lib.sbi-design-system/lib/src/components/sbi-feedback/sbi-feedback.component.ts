import { Component, computed, EventEmitter, Input, Output, Signal, signal, WritableSignal } from '@angular/core';
import { SbiButtonComponent } from '../sbi-button/sbi-button.component';
import { STAR_ICON_SVG } from '../../const/icons';
import { NgIf } from '@angular/common';
import { SbiFeedbackPointsComponent } from './sbi-feedback-points/sbi-feedback-points.component';
import { SbiFeedbackQuestionsComponent } from './sbi-feedback-questions/sbi-feedback-questions.component';
import { FeedbackQuestion } from '../../models/feedback-question';

/**
 * @deprecated Возможно не будет будет использоваться из-за использования обратной формы связи из ЛК
 *
 * Принимает несколько ng-content для отображения контента:
 * 1. points-content - контент отображаемы на странице выбора оценки, сверху над блоком оценок;
 * 2. questions-content - контент отображаемы на странице выбора комментариев, сверху над блоком комментариев;
 * 3. thanks-content - контент отображаемы на странице завершения прохождения опроса, сверху над блоком спасибо.
 * */
@Component({
  selector: 'sbi-feedback',
  standalone: true,
  imports: [SbiButtonComponent, NgIf, SbiFeedbackPointsComponent, SbiFeedbackQuestionsComponent],
  templateUrl: './sbi-feedback.component.html',
  styleUrl: './sbi-feedback.component.scss',
})
export class SbiFeedbackComponent {
  @Input() status: 'success' | 'fail' = 'success';
  @Input() pointsLabel = 'Насколько вам было удобно при заполнении данных';
  @Input() pointsCount = 5;
  @Input() sendFeedbackButtonLabel = 'Отправить';
  @Input() toMainPageButtonLabel = 'На главную';
  @Input() icon = STAR_ICON_SVG;
  @Input() testId = 'sbi-feedback-test-id';

  private _questions: FeedbackQuestion[] = [];
  @Input() public set questions(questions: FeedbackQuestion[]) {
    this._questions = [...questions, { label: 'Другое' }]
  };

  public get questions() {
    return this._questions;
  };

  @Output() sendPointsFeedback = new EventEmitter<number>();
  @Output() sendInfoFeedback = new EventEmitter<FeedbackQuestion[]>();
  @Output() sendFeedbackComment = new EventEmitter<string>();
  @Output() toMain = new EventEmitter();

  public step = signal(1);
  public selectedPoints = signal(0);
  public selectedQuestions: WritableSignal<FeedbackQuestion[]> = signal([]);
  public comment: WritableSignal<string> = signal('');
  public disabled: Signal<boolean> = computed(() => {
    if (this.status === 'fail') {
      return false;
    }
    if (this.step() === 1) {
      return !this.selectedPoints();
    }
    if (this.step() === 2) {
      return !this.selectedQuestions().length ||
        this.selectedQuestions().length === 1 && this.selectedQuestions()[0].label === 'Другое' && !this.comment().length;
    }
    return false;
  });
  public buttonLabel: Signal<string> = computed(() => {
    if (this.step() === 3 || this.status === 'fail') {
      return this.toMainPageButtonLabel;
    }
    return this.sendFeedbackButtonLabel;
  });

  public onSendFeedback() {
    if (this.status === 'fail') {
      this.toMain.emit();
      return
    }
    if (this.step() === 1) {
      this.sendPointsFeedback.emit(this.selectedPoints());
    }
    if (this.step() === 2) {
      this.sendInfoFeedback.emit(this.selectedQuestions());
      this.sendFeedbackComment.emit(this.comment());
    }
    if (this.step() === 3) {
      this.toMain.emit();
    }
    this.step.update(step => Math.min(step + 1, 3));
  }
}
