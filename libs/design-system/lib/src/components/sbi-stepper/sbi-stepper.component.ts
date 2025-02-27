import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SbiStepperService } from './sbi-stepper.service';
import { CHECK_MARK_SVG } from '../../const/icons';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { StepperModel } from './stepper.model';

@Component({
    selector: 'sbi-stepper',
    standalone: true,
    imports: [
        CommonModule,
        SbiIconComponent,
    ],
    templateUrl: './sbi-stepper.component.html',
    styleUrl: './sbi-stepper.component.scss',
})
export class SbiStepperComponent {
    /**
     * Параметр кликабельности шага
     */
    @Input() isStepClickable: boolean = false;
    @Output() stepClick = new EventEmitter<number>();
    
    public get checkMark() {
        return CHECK_MARK_SVG;
    }

    constructor(public stepperService: SbiStepperService) {}
    
    public goTo(nextStep: StepperModel): void {
        this.stepClick.emit(nextStep.number);
    }
}
