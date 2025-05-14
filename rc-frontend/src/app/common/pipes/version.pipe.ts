import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../interfaces/filter';

@Pipe({
  name: 'version',
  standalone: true
})
export class VersionPipe implements PipeTransform {

  transform(values: Item[], ...args: unknown[]): unknown {
    return values && values.length > 0 ? values.length > 1 ? `${values[values.length-1].value} - ${values[0].value}` : values[0].value : '';
  }

}
