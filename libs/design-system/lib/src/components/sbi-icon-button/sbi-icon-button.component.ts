import { Component, Input } from '@angular/core';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';

@Component({
    selector: 'sbi-icon-button',
    standalone: true,
    imports: [
        SbiIconComponent,
    ],
    templateUrl: './sbi-icon-button.component.html',
    styleUrl: './sbi-icon-button.component.scss',
    host: {
        '[class.disabled]': 'disabled',
    },
})
export class SbiIconButtonComponent {
    /**
     * SVG icon
     */
    @Input({ required: true }) icon: string = '';

    /**
     * Цвет иконки (hover/focus/disabled)
     */
    @Input() appearance: 'primary' | 'warn' = 'primary';

    /**
     * Тип кнопки
     */
    @Input() type: 'button' | 'submit' | 'reset' = 'button';

    /**
     * Активный/неактивный
     */
    @Input() disabled: boolean = false;

    /**
     * id для автотестов
     */
    @Input() testId: string = 'sbi-icon-button';

}
