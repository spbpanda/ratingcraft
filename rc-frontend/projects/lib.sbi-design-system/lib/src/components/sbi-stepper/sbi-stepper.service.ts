import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { SbiMetricsStepData, SbiStepperModel, SbiStepperState } from './stepper.models';
import { SbiMetricsService } from '../../services/sbi-metrics.service';

/**
 * Степпер сервис.
 *
 * @Injectable
 */
@Injectable()
export class SbiStepperService {
  private metricService = inject(SbiMetricsService);

  /**
   * @description Используем signal для хранения текущего шага.
   * @type {Signal<number>}
   * */
  private _currentStep: WritableSignal<number> = signal(1);
  public currentStep: Signal<number> = this._currentStep.asReadonly(); // Делаем сигнал доступным только для чтения

  /**
   * @description Используем signal для хранения списка шагов.
   * @type {Signal<Array<SbiStepperModel>>}
   * */
  private _steps: WritableSignal<Array<SbiStepperModel>> = signal<Array<SbiStepperModel>>([]);
  public steps = this._steps.asReadonly(); // Делаем сигнал доступным только для чтения

  /**
   * @description Признак для отправки метрик.
   * @type {Signal<boolean>}
   * */
  private _isSendMetrics: WritableSignal<boolean> = signal<boolean>(true);
  public isSendMetrics = this._isSendMetrics.asReadonly();

  /**
   * @description Добавляем новый сигнал для управления скроллом.
   * @type {Signal<boolean>}
   * */
  private _isScrollTopPage: WritableSignal<boolean> = signal(true);
  public isScrollTopPage = this._isScrollTopPage.asReadonly();

  /**
   * @public
   * @description Шаг вперёд.
   * @param {boolean} isStepClickable - можно ли переходить по шагам с помощью клика
   */
  public next(isStepClickable: boolean = false): void {
    if (this._currentStep() < this._steps().length) {
      this.updateStepState(this._currentStep(), isStepClickable ? 'visited' : 'completed');
      this._currentStep.update((step) => step + 1);
      this.updateStepState(this._currentStep(), 'active');
      if (this._isScrollTopPage()) {
        window.scrollTo(0, 0);
      }
      if (this._isSendMetrics()) {
        this.sendMetrics();
      }
    }
  }

  /**
   * @public
   * @description Шаг назад.
   */
  public prev(): void {
    if (this._currentStep() > 1) {
      this.updateStepState(this._currentStep(), 'visited');
      this._currentStep.update((step) => step - 1);
      this.updateStepState(this._currentStep(), 'active');
      if (this._isScrollTopPage()) {
        window.scrollTo(0, 0);
      }
      if (this._isSendMetrics()) {
        this.sendMetrics();
      }
    }
  }

  /**
   * @public
   * @description Задать конфигурацию Степпера (шаги, отслеживание метрик, скролл наверх).
   * @param {Array<SbiStepperModel>} steps  - массив шагов
   * @param {boolean} isSendMetrics - метрики
   * @param {needScrollTop }needScrollTop  - скролл наверх
   */
  public setStepperConfig(steps: Array<SbiStepperModel>, isSendMetrics: boolean = true, needScrollTop: boolean = true): void {
    this._steps.set(steps);
    this._isScrollTopPage.set(needScrollTop);
    this._isSendMetrics.set(isSendMetrics);
  }

  /**
   * @public
   * @description Задать список шагов.
   * @param {Array<SbiStepperModel>} steps
   */
  public setSteps(steps: Array<SbiStepperModel>): void {
    this._steps.set(steps);
  }

  /**
   * @public
   * @description Задать текущий шаг.
   * Включает:
   * - установка текущего шага
   * - при флаге isScrollTopPage === true - скрол наверх
   * - при флаге isSendMetrics === true - отправка метрик
   * @param {number} currentStep - Номер шага
   */
  public setCurrentStep(currentStep: number): void {
    this._currentStep.set(currentStep);

    if (this._isScrollTopPage()) {
      window.scrollTo(0, 0);
    }

    if (this._isSendMetrics()) {
      this.sendMetrics();
    }
  }

  /**
   * @private
   * @description метод вызова метрик
   */
  private sendMetrics() {
    const metricsData = this.getMetricksStepParameters();
    try {
      this.metricService.sendStepMetric(metricsData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @public
   * @description Обновление валидности конкретного шага
   * @param {number} stepNumber
   * @param {SbiStepperState} state
   */
  public updateStepState(stepNumber: number, state: SbiStepperState): void {
    this._steps.update((steps) =>
      steps.map((step) => {
        if (step.number === stepNumber) {
          return { ...step, state };
        }
        return step;
      })
    );
  }

  /**
   * @public
   * @description Добавляем метод для установки значения скрола
   * @param {boolean} value
   * */
  public setScrollTopPage(value: boolean): void {
    this._isScrollTopPage.set(value);
  }

  /**
   * @public
   * @description Найти объект шага по его номеру
   * @param {number} stepNumber  - номер шага
   * @returns {SbiStepperModel | undefined}
   */
  public getStepModelByNumber(stepNumber: number): SbiStepperModel | undefined {
    return this.steps().find(step => step.number === stepNumber);
  }

  /**
   * @public
   * @description Получить данные для метрики по тек. шагу
   * @return {SbiMetricsStepData | null} Объект с парамаетрами метрики
   */
  public getMetricksStepParameters(): SbiMetricsStepData | null {
    return this.steps().find(step => step.number === this.currentStep())?.metricsData || null;
  }
}
