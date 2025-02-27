import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[sbiNameUppercase]',
  standalone: true,
})
export class SbiNameUppercaseDirective {
  @Input() inputNameUppercaseActive = true;
  constructor(public ref: ElementRef, private readonly control: NgControl) {}

  @HostListener('input', ['$event'])
  titleCaseTransform(event: KeyboardEvent): void {
    if (this.ref.nativeElement.value && this.inputNameUppercaseActive) {
      const arr: string[] = this.ref.nativeElement.value.split('');
      arr[0] = arr[0].toUpperCase();
      this.control.control?.setValue(arr.join(''), { emitEvent: false });
   }
  }
}
