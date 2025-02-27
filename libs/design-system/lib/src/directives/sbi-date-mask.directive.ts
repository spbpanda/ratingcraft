import { Directive, ElementRef, OnDestroy, Input } from '@angular/core';
import * as vanillaTextMask from 'vanilla-text-mask-legacy'; // Import the entire module

@Directive({
  selector: '[sbiMaskDate]',
  standalone: true
})
export class SbiDateMaskDirective implements OnDestroy {
  private _showTimePicker = false;
  
  @Input('sbiMaskDate')
  set showTimePicker(value: boolean) {
    this._showTimePicker = value;
    if (this.maskedInputController) {
      this.maskedInputController.destroy();
      this.maskedInputController = (vanillaTextMask as any).maskInput({
        inputElement: this.element.nativeElement,
        mask: this.mask,
      });
    }
  }
  
  get showTimePicker(): boolean {
    return this._showTimePicker;
  }

  public get mask() {
    return this.showTimePicker ? 
      [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/] :
      [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
  }

  public maskedInputController;

  constructor(private element: ElementRef) {
    this.maskedInputController = (vanillaTextMask as any).maskInput({
      inputElement: this.element.nativeElement,
      mask: this.mask,
    });
  }

  public ngOnDestroy(): void {
    this.maskedInputController.destroy();
  }
}
