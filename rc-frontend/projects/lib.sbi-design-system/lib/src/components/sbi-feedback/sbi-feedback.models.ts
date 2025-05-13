export type SbiFeedbackStep = 'points' | 'questions' | 'custom';

/**
 * @deprecated Нужно использовать SbiFeedbackQuestion
 * */
export interface FeedbackQuestion {
  label: string;
  note?: string;
}

export interface SbiFeedbackQuestion extends FeedbackQuestion {
}
