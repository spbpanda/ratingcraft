/**
 * @deprecated Необходимо использовать SbiStepperModel
 * */
export interface StepperModels {
  number: number;
  name: string;
  state: SbiStepperState;
  metricsData?: SbiMetricsStepData;
}

/**
 * @deprecated Необходимо использовать SbiStepperState
 * */
export type StepperState = 'completed' | 'active' | 'disabled' | 'visited';

/**
 * @deprecated Необходимо использовать SbiMetricsStepData
 * */
export interface MetricsStepData {
  /** Название продукта (например, 'cargo-insurance') */
  metricsProduct: string;
  /** Название события (например, 'step-1', purchase_done') */
  metricsEvent: string | SbiFinalTypeEvent;
  /** Шаг процесса (например, '1', done') */
  metricsStep: string | SbiFinalTypeSteps;
}

export type SbiFinalTypeEvent = 'final' | 'purchase_done';
export type SbiFinalTypeSteps = 'final' | 'done';

export interface SbiStepperModel extends StepperModels {
}

export type SbiStepperState = StepperState;

export interface SbiMetricsStepData extends MetricsStepData {
}
