import { Injectable, signal } from "@angular/core";
import { MetricsStepData, StepperModel, StepperState } from "./stepper.model";
import { YandexMetrikaService } from "../../services/yandex-metrika.service";
import { DmpkitMetricsService } from "../../services/dmpkit-metrics.service";

@Injectable()
export class SbiStepperService {
  // Используем signal для хранения текущего шага
  private _currentStep = signal(1);
  public currentStep = this._currentStep.asReadonly(); // Делаем сигнал доступным только для чтения

  // Используем signal для хранения списка шагов
  private _steps = signal<Array<StepperModel>>([]);
  public steps = this._steps.asReadonly(); // Делаем сигнал доступным только для чтения

  /**
   * Признак для отправки метрик
   */
  private _isSendMetrics = signal<boolean>(true);
  public isSendMetrics = this._isSendMetrics.asReadonly();

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
      if(this._isSendMetrics()) {
        this.sendMetrics();
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
      if(this._isSendMetrics()) {
        this.sendMetrics();
      }
    }
  }

  /**
   * Задать конфигурацию Степпера (шаги, отслеживание метрик, скролл наверх)
   * @param steps  - массив шагов
   * @param isSendMetrics - метрики
   * @param needScrollTop  - скролл наверх
   */
  public setStepperConfig(steps: StepperModel[], isSendMetrics: boolean = true, needScrollTop: boolean = true): void {
    this._steps.set(steps);
    this._isScrollTopPage.set(needScrollTop);
    this._isSendMetrics.set(isSendMetrics);
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
    
    if(this._isSendMetrics()) {
      this.sendMetrics();
    }
  }

  /**
   * метод вызова метрик
   */
  private sendMetrics() {
    const metricsData = this.getMetricksStepParameters();
    try {
      YandexMetrikaService.sendStepMetrics(metricsData);
      DmpkitMetricsService.sendStepMetrics(metricsData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Обновление валидности конкретного шага
   * @param stepNumber
   * @param isValid
   */
  public updateStepState(stepNumber: number, state: StepperState): void {
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

  /**
   * Найти объект шага по его номеру
   * @param stepNumber  - номер шага
   * @returns 
   */
  public getStepModelByNumber(stepNumber: number): StepperModel | undefined {
    return this.steps().find(step => step.number === stepNumber);
  }

  /**
   * Получить данные для метрики по текю шагу
   * @returns Объект с парамаетрами метрики
   */
  public getMetricksStepParameters(): MetricsStepData | null {
    return this.steps().find(step => step.number === this.currentStep())?.metricsData || null;
  }
}
