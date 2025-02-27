export interface StepperModel {
    number: number;
    name: string;
    state: 'completed' | 'active' | 'disabled' | 'visited';
    // visited: boolean;
    // isValid?: boolean; // Валидность формы шага
}
