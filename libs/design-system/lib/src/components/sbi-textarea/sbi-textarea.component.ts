import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'sbi-textarea',
    templateUrl: './sbi-textarea.component.html',
    styleUrl: './sbi-textarea.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        SbiErrorComponent,
    ],
})
export class SbiTextareaComponent implements OnInit {

    @Input() control!: FormControl<string | null>;

    @Input() placeholder: string = '';

    @Input() label: string | null = null;

    @Input() readonly: boolean = false;

    @Input() isAutoResize: boolean = false;

    @Input() height: string = '56px';

    @Input() minRows: number | null = 1;

    @Input() maxRows: number | null = null;

    /**
     *Максимальное кол-во символов
     */
    @Input() maxLength: number | null = null;

    @Input() suffixIconType: 'clear' | 'copy' | 'custom' | 'close' = 'clear';

    @Input() testId: string = 'sbiTextarea';

    @Input() errorMessages: Record<string, string> | undefined;

    @Input() size: 'default' | 'small' = 'default';

    constructor(private elementRef: ElementRef) {
    }

    public ngOnInit(): void {
        if (this.size === 'small') {
            this.elementRef.nativeElement.querySelector('.sbi-textarea').classList.add('small');
        }
    }
        
    public clearControl() {
        this.control.setValue(null);
    }
}
