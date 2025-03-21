export interface StepperModel {
    number: number;
    name: string;
    state: StepperState;
    metricsData?: MetricsStepData;
}

export type StepperState = 'completed' | 'active' | 'disabled' | 'visited';

export interface MetricsStepData {
    metricsProduct?: string;
    metricsEvent?: string;
    metricsStep?: string;
}