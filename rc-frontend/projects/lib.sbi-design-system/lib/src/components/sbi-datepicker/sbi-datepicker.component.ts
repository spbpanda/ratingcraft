import { Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {
  MatDatepicker,
  MatDatepickerActions,
  MatDatepickerApply,
  MatDatepickerCancel,
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerToggle,
  MatDatepickerToggleIcon,
} from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MAT_LUXON_DATE_FORMATS } from '@angular/material-luxon-adapter';
import { MY_FORMATS } from '../../const/date-adapter.const';
import { CALENDAR_FILL } from '../../const/icons';
import { SbiDatepickerHeaderComponent } from './sbi-datepicker-header/sbi-datepicker-header.component';
import { SbiDateAdapterService } from './sbi-date-adapter.service';
import { SbiComponentWithInput } from '../../classes/sbi-component-with-input.component';
import { SbiDateMaskDirective } from '../../directives/sbi-date-mask.directive';
import { SbiErrorComponent } from '../sbi-error/sbi-error.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiButtonComponent } from '../sbi-button/sbi-button.component';
import { DateTime } from 'luxon';
import { DateRange } from '../../models/date-range.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sbi-datepicker',
  templateUrl: './sbi-datepicker.component.html',
  styleUrls: ['./sbi-datepicker.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    SbiDateMaskDirective,
    SbiErrorComponent,
    SbiIconComponent,
    SbiButtonComponent,
    MatFormField,
    MatDatepickerInput,
    MatInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatSuffix,
    MatDatepickerToggleIcon,
    MatDatepickerActions,
    MatDatepickerCancel,
    MatDatepickerApply,
    MatInputModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: SbiDateAdapterService },
    { provide: MAT_DATE_FORMATS, useValue: MAT_LUXON_DATE_FORMATS },
    { provide: MAT_LUXON_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SbiDatepickerComponent extends SbiComponentWithInput<DateTime | string> implements OnDestroy {
  @ViewChild('datePickerToggle') public datePickerToggle!: ElementRef<HTMLElement>;
  @ViewChild('picker') picker!: MatDatepicker<DateTime>;

  @Input() public declare control: FormControl<DateTime | string | null>;
  @Input() min?: string;
  @Input() max?: string;
  @Input() showDatePickerButtons = false;
  @Input() cancelButtonText = 'Сбросить';
  @Input() applyButtonText = 'Применить';
  @Input() isRange = false;
  @Input() endControl?: FormControl<DateTime | null>;

  @Input()
  set showTimePicker(value: boolean) {
    this._showTimePicker = value;
    // Передаем значение в адаптер
    (this.dateAdapter as SbiDateAdapterService).showTimePicker = value;
  }

  get showTimePicker(): boolean {
    return this._showTimePicker;
  }

  private _showTimePicker: boolean = false;

  @Output() dateInputChange = new EventEmitter<DateTime | string | null>();
  @Output() dateSelectChange = new EventEmitter<DateTime | string | null>();
  @Output() dateRangeChange = new EventEmitter<DateRange>();

  public hoveredDate: DateTime | null = null;
  public startDate: DateTime | null = null;
  public endDate: DateTime | null = null;
  public selectedTime = { hours: 0, minutes: 0, seconds: 0 };

  private pickerClosedSubscription?: Subscription;

  constructor(private ngZone: NgZone, private dateAdapter: DateAdapter<DateTime>) {
    super();
  }

  ngAfterViewInit() {
    if (this.isRange && this.showDatePickerButtons) {
      this.pickerClosedSubscription = this.picker.closedStream.subscribe(() => {
        if (this.startDate && !this.endDate) {
          this.picker.open();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.pickerClosedSubscription) {
      this.pickerClosedSubscription.unsubscribe();
    }
  }

  public getDisplayValue(): string {
    if (!this.isRange) {
      if (this.showTimePicker) {
        return this.formatDateWithTime(this.control.value);
      } else {
        return this.getDateTimeObject(this.control.value)?.toFormat('dd.MM.yyyy') ?? '';
      }
    }

    const start = this.startDate?.toFormat('dd.MM.yyyy') || '';
    const end = this.endDate?.toFormat('dd.MM.yyyy') || '';
    return start && end ? `${start} - ${end}` : start;
  }

  public onCalendarClick(event: MouseEvent): void {
    if (!this.isRange) return;

    const target = event.target as HTMLElement;
    const dateElement = target.closest('.mat-calendar-body-cell');
    if (!dateElement) return;

    const dateContent = dateElement.querySelector('.mat-calendar-body-cell-content');
    if (!dateContent) return;

    const dateAttr = dateContent.textContent;
    if (!dateAttr) return;

    const periodHeader = document.querySelector('.mat-calendar-period-button')?.textContent;
    if (!periodHeader) return;

    const [month, year] = periodHeader.split(' ');
    const clickedDate = DateTime.fromFormat(`${dateAttr}.${month}.${year}`, 'd.MMMM.yyyy', { locale: 'ru' });
    if (!clickedDate.isValid) return;

    this.handleDateSelection(clickedDate);
  }

  private handleDateSelection(date: DateTime) {
    this.ngZone.run(() => {
      // Если диапазон ещё не выбран или уже выбран (начальная и конечная даты заданы),
      // начинаем новый выбор диапазона.
      if (!this.startDate || (this.startDate && this.endDate)) {
        this.startDate = date;
        this.endDate = null;
        this.hoveredDate = null;
        // Сразу эмитим событие с выбранной начальной датой (как в Taiga UI)
        this.dateRangeChange.emit({
          start: date,
          end: null,
        });
      } else {
        // Второй клик – завершаем выбор диапазона.
        // Если вторая дата меньше первой, меняем их местами.
        if (date < this.startDate) {
          this.endDate = this.startDate;
          this.startDate = date;
        } else {
          this.endDate = date;
        }
        this.hoveredDate = null;
        // Эмитим событие с полным диапазоном.
        this.dateRangeChange.emit({
          start: this.startDate,
          end: this.endDate,
        });
        if (!this.showDatePickerButtons) {
          this.picker.close();
        }
      }
    });
  }

  public dateClass = (date: DateTime) => {
    if (!this.isRange) return '';

    const classes: string[] = [];

    if (this.startDate && this.endDate) {
      if (date >= this.startDate && date <= this.endDate) {
        classes.push('in-range');
      }
    }

    if (this.startDate && date.hasSame(this.startDate, 'day')) {
      classes.push('range-start');
    }

    if (this.endDate && date.hasSame(this.endDate, 'day')) {
      classes.push('range-end');
    }

    return classes.join(' ');
  };

  public isInRange(date: DateTime): boolean {
    if (!this.isRange || !this.startDate) return false;

    const end = this.endDate || this.hoveredDate;
    if (!end) return false;

    return (
      date >= (this.startDate < end ? this.startDate : end) && date <= (this.startDate < end ? end : this.startDate)
    );
  }

  public override onFocusChange(focused: boolean) {
    this.focused.set(focused);
  }

  public override onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (!value) {
      this.control.setValue(null);
    }
  }

  public onOpened() {
    this.focused.set(true);
    setTimeout(() => {
      document.getElementById('sbi-datepicker-previous-button')?.addEventListener('click', () => {
        setTimeout(() => this.removeEmptyCalendarRow(), 10);
      });
      document.getElementById('sbi-datepicker-next-button')?.addEventListener('click', () => {
        setTimeout(() => this.removeEmptyCalendarRow(), 10);
      });
      setTimeout(() => this.removeEmptyCalendarRow(), 10);

      if (this.showTimePicker) {
        setTimeout(() => {
          const overlayElem = document.querySelector('.mat-datepicker-content');
          if (overlayElem && !overlayElem.querySelector('.time-picker')) {
            const timePickerElem = document.createElement('div');
            timePickerElem.className = 'time-picker';
            timePickerElem.innerHTML = `
              <div class="time-block">
                <button type="button" class="arrow up hours">▲</button>
                <div class="time-value hours">${this.pad(this.selectedTime.hours)}</div>
                <button type="button" class="arrow down hours">▼</button>
              </div>
              <div class="separator">:</div>
              <div class="time-block">
                <button type="button" class="arrow up minutes">▲</button>
                <div class="time-value minutes">${this.pad(this.selectedTime.minutes)}</div>
                <button type="button" class="arrow down minutes">▼</button>
              </div>
              <div class="separator">:</div>
              <div class="time-block">
                <button type="button" class="arrow up seconds">▲</button>
                <div class="time-value seconds">${this.pad(this.selectedTime.seconds)}</div>
                <button type="button" class="arrow down seconds">▼</button>
              </div>
            `;
            overlayElem.appendChild(timePickerElem);

            const arrowUpHours = timePickerElem.querySelector('.arrow.up.hours');
            const arrowDownHours = timePickerElem.querySelector('.arrow.down.hours');
            arrowUpHours?.addEventListener('click', () => {
              this.incrementHours();
              this.updateTimeDisplayBlock(timePickerElem);
            });
            arrowDownHours?.addEventListener('click', () => {
              this.decrementHours();
              this.updateTimeDisplayBlock(timePickerElem);
            });

            const arrowUpMinutes = timePickerElem.querySelector('.arrow.up.minutes');
            const arrowDownMinutes = timePickerElem.querySelector('.arrow.down.minutes');
            arrowUpMinutes?.addEventListener('click', () => {
              this.incrementMinutes();
              this.updateTimeDisplayBlock(timePickerElem);
            });
            arrowDownMinutes?.addEventListener('click', () => {
              this.decrementMinutes();
              this.updateTimeDisplayBlock(timePickerElem);
            });

            const arrowUpSeconds = timePickerElem.querySelector('.arrow.up.seconds');
            const arrowDownSeconds = timePickerElem.querySelector('.arrow.down.seconds');
            arrowUpSeconds?.addEventListener('click', () => {
              this.incrementSeconds();
              this.updateTimeDisplayBlock(timePickerElem);
            });
            arrowDownSeconds?.addEventListener('click', () => {
              this.decrementSeconds();
              this.updateTimeDisplayBlock(timePickerElem);
            });
          }
        }, 20);
      }
    });
  }

  public onViewChanged() {
    this.removeEmptyCalendarRow();
  }

  private removeEmptyCalendarRow() {
    const calendarBody: HTMLElement | null = document.querySelector('.mat-calendar-body');
    if (!calendarBody) {
      return;
    }
    const firstRow = calendarBody.children.item(0);
    if (firstRow && firstRow.children.length === 1) {
      firstRow.remove();
    }
  }

  public onClosed() {
    this.focused.set(false);
    const timePickerElem = document.querySelector('.mat-datepicker-content .time-picker');
    if (timePickerElem) {
      timePickerElem.remove();
    }
  }

  public onDateInputChange(event: MatDatepickerInputEvent<DateTime>) {
    this.dateInputChange.emit(event.value);
  }

  public onCalendarHover(event: MouseEvent): void {
    if (!this.isRange || !this.control.value || this.endDate) return;

    const target = event.target as HTMLElement;
    const dateElement = target.closest('.mat-calendar-body-cell');
    if (!dateElement) {
      this.hoveredDate = null;
      return;
    }

    const dateContent = dateElement.querySelector('.mat-calendar-body-cell-content');
    if (!dateContent) return;

    const dateAttr = dateContent.textContent;
    if (!dateAttr) return;

    const periodHeader = document.querySelector('.mat-calendar-period-button')?.textContent;
    if (!periodHeader) return;

    const [month, year] = periodHeader.split(' ');
    const hoverDate = DateTime.fromFormat(`${dateAttr}.${month}.${year}`, 'd.MMMM.yyyy', { locale: 'ru' });
    if (hoverDate.isValid) {
      this.hoveredDate = hoverDate;
    }
  }

  public onDateSelectChange(event: MatDatepickerInputEvent<DateTime>): void {
    const selectedDate = event.value;
    if (!selectedDate) return;

    if (!this.isRange) {
      if (this.showTimePicker) {
        // Сохраняем выбранное время при выборе новой даты
        const dateWithTime = selectedDate.set({
          hour: this.selectedTime.hours,
          minute: this.selectedTime.minutes,
          second: this.selectedTime.seconds,
        });
        this.dateSelectChange.emit(dateWithTime);
        this.control.setValue(dateWithTime);
      } else {
        this.dateSelectChange.emit(selectedDate);
        this.control.setValue(selectedDate);
      }
      return;
    }

    if (!this.startDate || (this.startDate && this.endDate)) {
      // Начинаем новый выбор диапазона
      this.startDate = selectedDate;
      this.endDate = null;
      this.control.setValue(selectedDate);
      this.endControl?.setValue(null);
      this.dateRangeChange.emit({
        start: selectedDate,
        end: null,
      });
    } else {
      // Завершаем выбор диапазона
      if (selectedDate < this.startDate) {
        this.endDate = this.startDate;
        this.startDate = selectedDate;
      } else {
        this.endDate = selectedDate;
      }

      this.control.setValue(this.startDate);
      this.endControl?.setValue(this.endDate);
      this.dateRangeChange.emit({
        start: this.startDate,
        end: this.endDate,
      });
    }
  }

  onCancel() {
    this.startDate = null;
    this.endDate = null;
    this.control.setValue(null);
    this.endControl?.setValue(null);
    this.dateRangeChange.emit({ start: null, end: null });
    this.onClosed();
    this.picker.close();
  }

  public onApply() {
    if (this.isRange) {
      if (!this.startDate) {
        return;
      }

      if (!this.endDate) {
        // Если конечная дата не выбрана, календарь остаётся открытым
        return;
      }

      this.dateRangeChange.emit({
        start: this.startDate,
        end: this.endDate,
      });
      // Закрываем календарь только если обе даты выбраны
      this.picker.close();
    } else {
      if (this.showTimePicker && this.control.value) {
        const dateWithTime = this.getDateTimeObject(this.control.value)!.set({
          hour: this.selectedTime.hours,
          minute: this.selectedTime.minutes,
          second: this.selectedTime.seconds,
        });
        this.control.setValue(dateWithTime);
      }
      this.dateInputChange.emit(this.control.value);
      this.dateSelectChange.emit(this.control.value);
      this.picker.close();
    }
  }

  protected readonly DatepickerHeaderComponent = SbiDatepickerHeaderComponent;

  public get calendarIcon() {
    return CALENDAR_FILL;
  }

  public getTimeDisplay(): string {
    return `${this.pad(this.selectedTime.hours)}:${this.pad(this.selectedTime.minutes)}:${this.pad(
      this.selectedTime.seconds
    )}`;
  }

  private pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  public updateTimeDisplayBlock(timePickerElem: Element): void {
    const hoursElem = timePickerElem.querySelector('.time-value.hours');
    const minutesElem = timePickerElem.querySelector('.time-value.minutes');
    const secondsElem = timePickerElem.querySelector('.time-value.seconds');
    if (hoursElem) hoursElem.textContent = this.pad(this.selectedTime.hours);
    if (minutesElem) minutesElem.textContent = this.pad(this.selectedTime.minutes);
    if (secondsElem) secondsElem.textContent = this.pad(this.selectedTime.seconds);

    // Обновляем значение в control только если есть выбранная дата
    if (this.showTimePicker && this.control.value) {
      const dateWithTime = this.getDateTimeObject(this.control.value)!.set({
        hour: this.selectedTime.hours,
        minute: this.selectedTime.minutes,
        second: this.selectedTime.seconds,
      });
      this.control.setValue(dateWithTime);
      this.dateInputChange.emit(dateWithTime);
    }
  }

  public incrementHours(): void {
    this.selectedTime.hours = (this.selectedTime.hours + 1) % 24;
  }

  public decrementHours(): void {
    this.selectedTime.hours = (this.selectedTime.hours - 1 + 24) % 24;
  }

  public incrementMinutes(): void {
    this.selectedTime.minutes = (this.selectedTime.minutes + 1) % 60;
  }

  public decrementMinutes(): void {
    this.selectedTime.minutes = (this.selectedTime.minutes - 1 + 60) % 60;
  }

  public incrementSeconds(): void {
    this.selectedTime.seconds = (this.selectedTime.seconds + 1) % 60;
  }

  public decrementSeconds(): void {
    this.selectedTime.seconds = (this.selectedTime.seconds - 1 + 60) % 60;
  }

  // Добавляем новый метод для форматирования даты с временем
  private formatDateWithTime(date: DateTime | string | null): string {
    if (!date) return '';
    if (typeof date === 'string') {
      return DateTime.fromISO(date).toFormat('dd.MM.yyyy HH:mm:ss');
    }
    return date.toFormat('dd.MM.yyyy HH:mm:ss');
  }

  private getDateTimeObject(date: DateTime | string | null): DateTime | null {
    if (typeof date === 'string') {
      return DateTime.fromISO(date);
    }
    return date;
  }
}
