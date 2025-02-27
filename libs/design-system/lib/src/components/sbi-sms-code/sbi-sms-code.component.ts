import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor, NgIf } from '@angular/common';
import { smsAutocomplete } from './utils/sms-autocomplete';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'sbi-sms-code',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sbi-sms-code.component.html',
  styleUrl: './sbi-sms-code.component.scss'
})
export class SbiSmsCodeComponent implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  @ViewChildren('smsCodeInputField') inputFields!: QueryList<ElementRef<HTMLInputElement>>;

  @Input() successMessage: string = '';
  @Input() errorMessage: string = '';
  @Input() smsCodeLength: number = 4;
  @Input() testId: string = 'sbiSmsCode';
  @Input() resendCodeLabel = 'Получить код повторно';
  @Input() timerLabel = 'Отправить код еще раз через';

  /**
   * Для корректной автоподстановки кода, в тексте смс должен содержаться текст формата
   * * @online.sberbankins.ru #код
   * *
   * *
   * * Например:
   * *
   * * Уважаемый Клиент! Ваш код для
   * * подтвержения введённых данных - 1111
   * * @online.sberbankins.ru #1111
   * */
  @Input() useAutocompleteSmsCode = false;

  @Output() formComplete = new EventEmitter<string | null>();
  @Output() resendSmsCode = new EventEmitter();

  smsCodeForm: FormGroup;
  timer: number = 0; // Начальное значение таймера
  showResendLink: boolean = true;
  private timerId: any;

  constructor(
    private fb: FormBuilder
  ) {
    this.smsCodeForm = this.createSmsCodeForm();
    this.smsCodeForm.statusChanges.subscribe(() => {
      this.emitFormValue(); // Проверяем и отправляем значение при каждом изменении статуса
    });
  }

  ngAfterViewInit() {
    if (this.useAutocompleteSmsCode) {
      this.connectAutocompleteSmsCode();
    }
  }

  private connectAutocompleteSmsCode() {
    const control = new FormControl<string>('');
    control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(codeString => {
      const codeArray: string [] = (codeString ?? '').split('') ?? [];
      codeArray.forEach((char, idx) => this.codeControls[idx]?.setValue(char))
    })
    smsAutocomplete(control, window, navigator);
  }

  private emitFormValue(): void {
    if (this.smsCodeForm.valid) {
      const codeValue = this.smsCodeForm.value.code.join(''); // Объединяем значение
      this.formComplete.emit(codeValue); // Отправляем строку
    } else {
      this.formComplete.emit(null); // Если невалидно, отправляем null
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private createSmsCodeForm(): FormGroup {
    return this.fb.group({
      code: this.fb.array(this.createControls(this.smsCodeLength)),
    });
  }

  private createControls(count: number): FormControl[] {
    const controls: FormControl[] = [];
    for (let i = 0; i < count; i++) {
      controls.push(new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]));
    }
    return controls;
  }

  get codeControls(): FormControl[] {
    return (this.smsCodeForm.get('code') as FormArray).controls as FormControl[];
  }

  onInput(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (!/^\d$/.test(value)) {
      target.value = '';
      this.codeControls[index].setValue('');
      return;
    }

    if (value && index < this.codeControls.length - 1) {
      const inputFieldsArray = this.inputFields.toArray();
      const nextInput = inputFieldsArray[index + 1].nativeElement as HTMLInputElement;
      nextInput?.focus();
    }
  }

  onKeyDown(index: number, event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      const currentControl = this.codeControls[index];
      if (!target.value && index > 0) {
        currentControl.setValue('');
        const inputFieldsArray = this.inputFields.toArray();
        const prevInput = inputFieldsArray[index - 1].nativeElement as HTMLInputElement;
        prevInput?.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const clipboardData = event.clipboardData?.getData('text') || '';
    const digits = clipboardData.replace(/\D/g, '').slice(0, this.codeControls.length);

    digits.split('').forEach((char, index) => {
      if (index < this.codeControls.length) {
        this.codeControls[index].setValue(char);
      }
    });

    const nextInputIndex = Math.min(digits.length, this.codeControls.length - 1);
    const inputFieldsArray = this.inputFields.toArray();
    const nextInput = inputFieldsArray[nextInputIndex].nativeElement as HTMLInputElement;
    nextInput?.focus();
  }

  resendCode(): void {
    this.resetTimer();
    this.resendSmsCode.emit();
  }

  resetTimer(): void {
    this.stopTimer(); // Останавливаем предыдущий таймер
    this.timer = 300; // 5 минут в секундах
    this.showResendLink = false;
    this.startTimer(); // Запускаем новый таймер
  }

  startTimer(): void {
    const updateTimer = () => {
      if (this.timer > 0) {
        this.timer -= 1;
        this.timerId = setTimeout(updateTimer, 1000); // Обновляем таймер каждую секунду
      } else {
        this.stopTimer();
        this.showResendLink = true;
      }
    };

    updateTimer(); // Сразу запускаем таймер
  }

  stopTimer(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }

  getCodeValue(): string {
    return this.smsCodeForm.value.code.join('');
  }

  getTimerMinutes(): string {
    const minutes = Math.floor(this.timer / 60);
    return minutes < 10 ? `0${minutes}` : `${minutes}`;
  }

  getTimerSeconds(): string {
    const seconds = this.timer % 60;
    return seconds < 10 ? `0${seconds}` : `${seconds}`;
  }

  ngOnChanges(): void {
    const codeArray = this.smsCodeForm.get('code') as FormArray;
    codeArray.clear();
    this.createControls(this.smsCodeLength).forEach(control => codeArray.push(control));
  }

  public get codeValue(): string {
    return this.codeControls.map((control) => control.value).join('');
  }
}
