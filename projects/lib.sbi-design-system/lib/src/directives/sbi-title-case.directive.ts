import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[sbiTitleCase]',
  standalone: true
})
export class SbiTitleCaseDirective {
  @Input() appTitleCaseActive = false;
  constructor(
    public ngControl: NgControl,
    public ref: ElementRef
  ) {}

  @HostListener('keypress', ['$event'])
  titleCaseTransform(event: KeyboardEvent): void {
    if (!this.appTitleCaseActive) {
      return;
    }
    const inputValue = this.ref.nativeElement.value;
    const key = event.key;
    if (!inputValue.length && key.match('[а-яё]')) {
      event.preventDefault();
      this.ngControl.control?.patchValue(key.toUpperCase());
    }
  }
}
