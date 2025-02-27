import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sbiSumFormatter',
  standalone: true,
})
export class SbiSumFormatterPipe implements PipeTransform {
  transform(value: number | string | null, curr: string = '₽'): string {
    if (value == null || isNaN(Number(value))) {
      return '';
    }
    const strValue = value.toString().split('.');

    const formatedSum = (strValue[0] ?? '')
      .toString()
      .split('')
      .reverse()
      .map((char, idx) => (!(idx % 3) ? `${char} ` : char))
      .reverse()
      .join('');
    return `${formatedSum}${strValue.length > 1 ? `.${strValue[1]}` : ''} ${curr}`;
  }
}
