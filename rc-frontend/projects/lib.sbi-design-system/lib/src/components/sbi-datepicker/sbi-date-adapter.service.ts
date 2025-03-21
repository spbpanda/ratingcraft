import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';

@Injectable()
export class SbiDateAdapterService extends LuxonDateAdapter {
  private _showTimePicker = false;

  set showTimePicker(value: boolean) {
    this._showTimePicker = value;
  }

  public override format(date: DateTime, displayFormat: string): string {
    if (!date) return '';
    
    if (this._showTimePicker) {
      return date.toFormat('dd.MM.yyyy HH:mm:ss');
    }
    return date.toFormat('dd.MM.yyyy');
  }

  public override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    // Возвращаем кастомные названия месяцев
    if (style === 'long') {
      return ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    }
    return ['Янв', 'Февр', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'];
  }

  public override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    // Возвращаем кастомные названия месяцев
    if (style === 'long') {
      return ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    }
    return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  }

  override parse(value: any): DateTime | null {
    if (typeof value === 'string') {
      if (this._showTimePicker && value.includes(':')) {
        const dateTime = DateTime.fromFormat(value, 'dd.MM.yyyy HH:mm:ss');
        if (dateTime.isValid) return dateTime;
      }
      
      if (value.indexOf('.') > -1) {
        const str = value.slice(0, 10).split('.');
        const year = Number(str[2]);
        const month = Number(str[1]);
        const day = Number(str[0]);
        return !isNaN(year) && !isNaN(month) && !isNaN(day) ? 
          DateTime.fromObject({year, month, day, 
            hour: this._showTimePicker ? 0 : undefined,
            minute: this._showTimePicker ? 0 : undefined,
            second: this._showTimePicker ? 0 : undefined
          }) : null;
      }
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : DateTime.fromMillis(timestamp).setLocale(this.locale);
  }

  override getFirstDayOfWeek(): number {
    return 1;
  }
}
