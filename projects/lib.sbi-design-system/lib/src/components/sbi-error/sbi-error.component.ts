import { Component, Input } from '@angular/core';
import { MatError } from '@angular/material/form-field';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'sbi-error',
  templateUrl: './sbi-error.component.html',
  styleUrls: ['./sbi-error.component.scss'],
  imports: [
    MatError
  ],
  standalone: true
})
export class SbiErrorComponent {
  @Input({ required: true }) errors: ValidationErrors | null = null;
  @Input() testId = 'sbi-error';

  private defaultErrorMessages: Record<string, string> = {
    required: 'Поле обязательное.',
  };

  private _errorMessages: Record<string, string> | undefined = {};

  @Input()
  set errorMessages(messages: Record<string, string> | undefined) {
    this._errorMessages = messages ? { ...this.defaultErrorMessages, ...messages } : this.defaultErrorMessages;
  }

  get errorMessages(): Record<string, string> {
    return this._errorMessages ?? {};
  }

  public getErrorMessage() {
    if (!this.errors) {
      return ''
    }
    const errorKeys = Object.keys(this.errors);
    if (errorKeys.length > 0) {
      const errorKey = errorKeys[0];
      return this.errorMessages[errorKey] ?? '';
    }
    return '';
  }
}
