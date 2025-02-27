import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { InputMode } from '../models/input.types';

@Directive({
  selector: '[sbiInputMode]',
  standalone: true
})
export class SbiInputModeDirective implements AfterViewInit {
  @Input() inputMode: InputMode = 'text';

  constructor(private element: ElementRef) {
  }

  ngAfterViewInit() {
    this.element.nativeElement.setAttribute('inputMode', this.inputMode);
  }
}
