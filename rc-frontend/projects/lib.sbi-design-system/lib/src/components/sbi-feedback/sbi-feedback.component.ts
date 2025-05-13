import { Component, computed, EventEmitter, Input, Output, Signal, signal, WritableSignal } from '@angular/core';
import { SbiButtonComponent } from '../sbi-button/sbi-button.component';
import { STAR_ICON_SVG } from '../../const/icons';
import { NgIf } from '@angular/common';
import { SbiFeedbackPointsComponent } from './sbi-feedback-points/sbi-feedback-points.component';
import { SbiFeedbackQuestionsComponent } from './sbi-feedback-questions/sbi-feedback-questions.component';
import { SbiFeedbackQuestion, SbiFeedbackStep } from "./sbi-feedback.models";

/**
 * @deprecated Возможно не будет использоваться из-за использования обратной формы связи из ЛК
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
  private _step = signal<SbiFeedbackStep>('custom')
  @Input() set step(step: SbiFeedbackStep) {
    this._step.set(step);
  }

  public get step() {
    return this._step();
  }

  @Input() pointsLabel = 'Насколько вам было удобно при заполнении данных';
  @Input() pointsCount = 5;
  @Input() primaryButtonLabel = '';
  @Input() secondaryButtonLabel = '';
  @Input() icon = STAR_ICON_SVG;
  @Input() testId = 'sbi-feedback-test-id';

  private _questions: Array<SbiFeedbackQuestion> = [];
  @Input()
  public set questions(questions: Array<SbiFeedbackQuestion>) {
    this._questions = [...questions, { label: 'Другое' }]
  };

  public get questions() {
    return this._questions;
  };

  @Output() sendPointsFeedback = new EventEmitter<number>();
  @Output() sendInfoFeedback = new EventEmitter<Array<SbiFeedbackQuestion>>();
  @Output() sendFeedbackComment = new EventEmitter<string>();
  @Output() primaryButtonClick = new EventEmitter();
  @Output() secondaryButtonClick = new EventEmitter();

  public selectedPoints = signal(0);
  public selectedQuestions: WritableSignal<Array<SbiFeedbackQuestion>> = signal([]);
  public comment: WritableSignal<string> = signal('');
  public disabled: Signal<boolean> = computed(() => {
    if (this._step() === 'points') {
      return !this.selectedPoints();
    }
    if (this._step() === 'questions') {
      return !this.selectedQuestions().length ||
        this.selectedQuestions().length === 1 && this.selectedQuestions()[0].label === 'Другое' && !this.comment().length;
    }
    return false;
  });

  public onPrimaryButtonClick() {
    this.primaryButtonClick.emit();
  }

  public onSecondaryButtonClick() {
    this.secondaryButtonClick.emit();
  }
}
