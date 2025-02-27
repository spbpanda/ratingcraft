import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

function removeSpaces(value: string): string {
  const charList = value.split(' ');
  return charList.filter((char, idx) => !!char || idx === charList.length - 1).join(' ');
}

@Directive({
  selector: '[sbiMultiUppercase]',
  standalone: true,
})
export class SbiMultiUppercaseDirective {
  @Input() inputMultiUppercaseActive = true;

  constructor(public ref: ElementRef, private readonly control: NgControl) {}

  @HostListener('input', ['$event'])
  titleCaseTransform(event: KeyboardEvent): void {
    if (this.ref.nativeElement.value && this.inputMultiUppercaseActive) {
      const value: string = this.ref.nativeElement.value;
      const words: string[] = removeSpaces(value).split(' ');
      const newValue = words.map(word => `${word ? word[0].toUpperCase() : word}${word.slice(1)}`).join(' ');
      this.control.control?.setValue(newValue, { emitEvent: false });
    }
  }
}
