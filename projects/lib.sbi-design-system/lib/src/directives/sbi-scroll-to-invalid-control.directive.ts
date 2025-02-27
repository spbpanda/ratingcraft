import { Directive, ElementRef, HostListener } from '@angular/core';
import { FormArray, FormGroup, FormGroupDirective } from '@angular/forms';

@Directive({
    selector: '[sbiScrollToInvalidControl]',
    standalone: true
})
export class SbiScrollToInvalidControlDirective {

    constructor(private el: ElementRef, private formGroup: FormGroupDirective) {}

    @HostListener('ngSubmit')
    public onSubmit() {
        this.touchMe(this.formGroup.control);
        
        if (this.formGroup.control.invalid) {
            this.scrollToFirstInvalidControl();
        }
    }

    private scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector('.ng-invalid');
        
        if (firstInvalidControl) {
            firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    private touchMe(group: FormGroup): void {
        Object.values(group.controls).forEach(control => {
            if (control instanceof FormGroup) {
                this.touchMe(control);
            }
            if (control instanceof FormArray) {
                control.controls.forEach(group => {
                    if (group instanceof FormGroup) {
                        this.touchMe(group);
                    }
                });
            }
            control.markAsDirty();
            control.markAsTouched();
        })
    }
}
