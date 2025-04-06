import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { MatCalendar, MatCalendarView } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { takeUntil } from 'rxjs/operators';
import { ARROW_DOWN, DATEPICKER_ARROW } from '../../../const/icons';
import { SbiIconComponent } from '../../sbi-icon/sbi-icon.component';

@Component({
  selector: 'sbi-datepicker-header',
  templateUrl: './sbi-datepicker-header.component.html',
  styleUrls: ['sbi-datepicker-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule, SbiIconComponent],
})
export class SbiDatepickerHeaderComponent<D> implements OnInit, OnDestroy {
  public readonly testId = 'sbi-datepicker-header';

  private readonly destroyed$ = new Subject<void>();
  private readonly yearsOnPage = 24;

  public label = signal('');

  public get arrow() {
    return DATEPICKER_ARROW;
  }

  public get selectorArrow() {
    return ARROW_DOWN;
  }

  public get isMonthView(): boolean {
    return this.datepicker.currentView === 'month';
  }

  public get isYearView(): boolean {
    return this.datepicker.currentView === 'year';
  }

  public get isMultiYearView(): boolean {
    return this.datepicker.currentView === 'multi-year';
  }

  private normalizeMonthName(name: string) {
    return name[0].toUpperCase() + name.slice(1).toLowerCase();
  }

  constructor(private datepicker: MatCalendar<D>, private dateAdapter: DateAdapter<D>, cdr: ChangeDetectorRef) {
    datepicker.stateChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => cdr.markForCheck());
  }

  ngOnInit() {
    this.connectChangeHeaderView();
  }

  private connectChangeHeaderView() {
    this.setLabelByViewState(this.datepicker.currentView);
    this.datepicker.viewChanged.pipe(takeUntil(this.destroyed$)).subscribe(val => this.setLabelByViewState(val));
  }

  private setLabelByViewState(val: MatCalendarView) {
    const date = this.datepicker.activeDate;
    const monthName = this.dateAdapter.getMonthNames('long')[this.dateAdapter.getMonth(date)];
    if (val === 'month') {
      this.label.set(`${this.normalizeMonthName(monthName)} ${this.dateAdapter.getYear(date)}`);
    }
    if (val === 'year') {
      this.label.set(this.dateAdapter.getYear(date).toString());
    }
    if (val === 'multi-year') {
      this.label.set(this.getMultiyearLabel());
    }
  }

  private getMultiyearLabel() {
    const rows = this.datepicker?.multiYearView?._matCalendarBody?.rows;
    console.log(rows);
    const startYear = rows[0][0].value ?? 0;
    return `${startYear} - ${startYear + this.yearsOnPage - 1}`;
  }

  public changeView() {
    if (this.isMonthView) {
      this.datepicker.currentView = 'multi-year';
    } else if (this.isMultiYearView || this.isYearView) {
      this.datepicker.currentView = 'month';
    }
  }

  public previous() {
    this.changeDatePickerSelected(-1);
  }

  public next() {
    this.changeDatePickerSelected();
  }

  private changeDatePickerSelected(mode: 1 | -1 = 1) {
    if (this.isMultiYearView) {
      this.datepicker.activeDate = this.dateAdapter.addCalendarYears(
        this.datepicker.activeDate,
        mode * this.yearsOnPage
      );
    } else if (this.isMonthView) {
      this.datepicker.activeDate = this.dateAdapter.addCalendarMonths(this.datepicker.activeDate, mode * 1);
    } else {
      this.datepicker.activeDate = this.dateAdapter.addCalendarYears(this.datepicker.activeDate, mode * 1);
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
