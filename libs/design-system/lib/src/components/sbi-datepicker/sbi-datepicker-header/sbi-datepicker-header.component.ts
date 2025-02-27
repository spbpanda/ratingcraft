import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { takeUntil } from 'rxjs/operators';
import { DATEPICKER_ARROW, DATEPICKER_MONTH_AND_YEAR_SELECTOR_ICON_SVG } from '../../../const/icons';
import { SbiIconComponent } from '../../sbi-icon/sbi-icon.component';

@Component({
  selector: 'sbi-datepicker-header',
  templateUrl: './sbi-datepicker-header.component.html',
  styleUrls: ['sbi-datepicker-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule, SbiIconComponent],
})
export class SbiDatepickerHeaderComponent<D> implements OnDestroy {
  testId = 'sbi-datepicker-header';

  private destroyed = new Subject<void>();
  private yearsOnPage = 24;

  public get arrow() {
    return DATEPICKER_ARROW;
  }

  public get selectorArrow() {
    return DATEPICKER_MONTH_AND_YEAR_SELECTOR_ICON_SVG;
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

  public get label() {
    const date = this.datepicker.activeDate;
    const monthName = this.dateAdapter.getMonthNames('long')[this.dateAdapter.getMonth(date)];
    if (this.isMonthView) {
      return `${this.normalizeMonthName(monthName)} ${this.dateAdapter.getYear(date)}`
    }
    if (this.isYearView) {
      return this.dateAdapter.getYear(date).toString();
    }
    return this.getMultiyearLabel();
  }

  private normalizeMonthName(name: string) {
    return name[0].toUpperCase() + name.slice(1).toLowerCase();
  }

  private getMultiyearLabel() {
    const year = this.dateAdapter.getYear(this.datepicker.activeDate);
    const listNumber = Math.floor(year / this.yearsOnPage);
    return `${listNumber * this.yearsOnPage} - ${(listNumber + 1) * this.yearsOnPage - 1}`;
  }

  constructor(
    private datepicker: MatCalendar<D>,
    private dateAdapter: DateAdapter<D>,
    cdr: ChangeDetectorRef,
  ) {
    datepicker.stateChanges.pipe(takeUntil(this.destroyed)).subscribe(() => cdr.markForCheck());
  }

  public changeView() {
    if (this.isMonthView) {
      this.datepicker.currentView = 'multi-year';
    } else if (this.isMultiYearView || this.isYearView) {
      this.datepicker.currentView = 'month';
    }
  }

  public previous() {
    this.changeDatePickerSelected(-1)
  }

  public next() {
    this.changeDatePickerSelected()
  }

  private changeDatePickerSelected(mode: 1 | -1 = 1) {
    if (this.isMultiYearView) {
      this.datepicker.activeDate = this.dateAdapter.addCalendarYears(this.datepicker.activeDate, mode * this.yearsOnPage)
    } else if (this.isMonthView) {
      this.datepicker.activeDate = this.dateAdapter.addCalendarMonths(this.datepicker.activeDate, mode * 1)
    } else {
      this.datepicker.activeDate = this.dateAdapter.addCalendarYears(this.datepicker.activeDate, mode * 1);
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
