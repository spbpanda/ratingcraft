import { Injectable, signal, computed, effect } from "@angular/core";
import { StepperModel } from "./stepper.model";

@Injectable()
export class SbiStepperService {
  // Используем signal для хранения текущего шага
  private _currentStep = signal(1);
  public currentStep = this._currentStep.asReadonly(); // Делаем сигнал доступным только для чтения

  // Используем signal для хранения списка шагов
  private _steps = signal<Array<StepperModel>>([]);
  public steps = this._steps.asReadonly(); // Делаем сигнал доступным только для чтения

  // Добавляем новый сигнал для управления скроллом
  private _isScrollTopPage = signal(true);
  public isScrollTopPage = this._isScrollTopPage.asReadonly();

  /**
   * Шаг вперёд
   */
  public next(): void {
    if (this._currentStep() < this._steps().length) {
        this.updateStepState(this._currentStep(), 'completed'); 
        this._currentStep.update((step) => step + 1);
        this.updateStepState(this._currentStep(), 'active');
        if (this._isScrollTopPage()) {
          window.scrollTo(0, 0);
        }
    }
  }
  /**
   * Шаг назад
   */
  public prev(): void {
    if (this._currentStep() > 1) {
        this.updateStepState(this._currentStep(), 'visited'); 
        this._currentStep.update((step) => step - 1);
        this.updateStepState(this._currentStep(), 'active');
        if (this._isScrollTopPage()) {
          window.scrollTo(0, 0);
        }
    }
  }
  /**
   * Задать список шагов
   * @param steps
   */
  public setSteps(steps: StepperModel[]): void {
    this._steps.set(steps);
  }

  /**
   * Задать текущий шаг
   * @param currentStep
   */
  public setCurrentStep(currentStep: number): void {
    if (this._isScrollTopPage()) {
      window.scrollTo(0, 0);
    }
    this._currentStep.set(currentStep);
  }

  /**
   * Обновление валидности конкретного шага
   * @param stepNumber
   * @param isValid
   */
  public updateStepState(stepNumber: number, state: 'active' | 'completed' | 'disabled' | 'visited'): void {
    this._steps.update((steps) =>
      steps.map((step) => {
        if (step.number === stepNumber) {
          return { ...step, state };
        }
        return step;
      })
    );
  }

  // Добавляем метод для установки значения
  public setScrollTopPage(value: boolean): void {
    this._isScrollTopPage.set(value);
  }
}
