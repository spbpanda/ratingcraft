import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sbiCountedCaption',
  standalone: true,
})
export class SbiCountedCaptionPipe implements PipeTransform {
  transform(value: number | null, oneCaption: string, twoCaption: string, multipleCaption: string): string {
    const count = value ?? 0;
    const remainder100 = count % 100;
    const remainder10 = count % 10;

    if ((remainder100 < 10 || remainder100 > 20) && remainder10 < 5 && count > 0) {
      if (remainder10 === 1) {
        return `${count} ${oneCaption}`;
      }
      return `${count} ${twoCaption}`;
    }
    return `${count} ${multipleCaption}`;
  }
}
