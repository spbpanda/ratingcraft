import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputMode, InputType } from '../models/input.types';

@Component({
  template: ``
})
export abstract class SbiComponentWithInput<T> implements OnInit {
  focused = signal(false);

  @Input() value?: T;
  @Input() control!: FormControl<T | null>;
  @Input() placeholder = '';
  @Input() label = '';
  @Input() testId: string = 'sbiInput';
  @Input() readonly = false;
  @Input() errorMessages?: Record<string, string>;
  @Input() subtitle?: string;
  @Input() type: InputType = 'text';
  @Input() inputMode: InputMode = 'text';
  @Input() hideRequiredMarker: boolean = true;

  @Output() inputChange = new EventEmitter<Event>();
  @Output() focus = new EventEmitter<boolean>();
  @Output() clearControl = new EventEmitter<Event>();

  ngOnInit(): void {
    if (this.value || this.value === '' || this.value === 0) {
      this.control = new FormControl(this.value);
    }
  }

  public onInputChange(event: Event): void {
    this.inputChange.emit(event);
  }

  public onFocusChange(focus: boolean) {
    this.focused.set(focus);
    this.focus.emit(focus);
  }

  public onClearControl(event: Event) {
    this.control.setValue(null);
    this.clearControl.emit(event);
  }
}
