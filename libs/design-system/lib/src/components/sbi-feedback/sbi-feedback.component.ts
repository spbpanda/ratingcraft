import { Component, computed, EventEmitter, Input, Output, Signal, signal, WritableSignal } from '@angular/core';
import { SbiButtonComponent } from '../sbi-button/sbi-button.component';
import { STAR_ICON_SVG } from '../../const/icons';
import { NgIf } from '@angular/common';
import { SbiFeedbackPointsComponent } from './sbi-feedback-points/sbi-feedback-points.component';
import { SbiFeedbackQuestionsComponent } from './sbi-feedback-questions/sbi-feedback-questions.component';
import { FeedbackQuestion } from '../../models/feedback-question';

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
  @Input() questions: FeedbackQuestion[] = [];
  @Input() testId = 'sbi-feedback-test-id';

  @Output() sendPointsFeedback = new EventEmitter<number>();
  @Output() sendInfoFeedback = new EventEmitter<FeedbackQuestion[]>();
  @Output() toMain = new EventEmitter();

  public step = signal(1);
  public selectedPoints = signal(0);
  public selectedQuestions: WritableSignal<FeedbackQuestion[]> = signal([]);
  public disabled: Signal<boolean> = computed(() => {
    if (this.status === 'fail') {
      return false;
    }
    if (this.step() === 1) {
      return !this.selectedPoints();
    }
    if (this.step() === 2) {
      return !this.selectedQuestions().length;
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
    }
    if (this.step() === 3) {
      this.toMain.emit();
    }
    this.step.update(step => Math.min(step + 1, 3));
  }
}
