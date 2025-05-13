import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SbiStepperService } from './sbi-stepper.service';
import { CHECK_MARK_SVG } from '../../const/icons';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiStepperModel } from './stepper.models';
import { SbiDividerComponent } from '../sbi-divider/sbi-divider.component';

/**
 * Компонент степпера. Степпер — это элемент интерфейса, который позволяет пользователю переходить между страницами шаг за шагом.
 *
 * @Component
 * @selector: 'sbi-stepper'
 * @standalone: true
 * @imports: [CommonModule, SbiIconComponent]
 * @templateUrl: './sbi-stepper.component.html'
 * @styleUrl: './sbi-stepper.component.scss'
 */
@Component({
  selector: 'sbi-stepper',
  standalone: true,
  imports: [CommonModule, SbiIconComponent, SbiDividerComponent],
  templateUrl: './sbi-stepper.component.html',
  styleUrl: './sbi-stepper.component.scss',
})
export class SbiStepperComponent {
  /**
   * @public
   * @description Экземпляр сервиса степпера.
   * @type {SbiStepperService}
   * @defaultValue SbiStepperService
   */
  public stepperService: SbiStepperService = inject(SbiStepperService);

  /**
   * @public
   * @description Параметр кликабельности шага.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() isStepClickable: boolean = false;

  /**
   * @public
   * @description Событие клика на шаг.
   * @type {EventEmitter<number>}
   */
  @Output() stepClick: EventEmitter<number> = new EventEmitter<number>();

  /**
   * @public
   * @getter
   * @description Возвращает иконку пройденного шага.
   * @return {string}
   */
  public get checkMark(): string {
    return CHECK_MARK_SVG;
  }

  /**
   * @public
   * @description Переход на шаг по клику.
   * @param {SbiStepperModel} nextStep номер шага.
   */
  public goTo(nextStep: SbiStepperModel): void {
    this.stepClick.emit(nextStep.number);
  }
}
