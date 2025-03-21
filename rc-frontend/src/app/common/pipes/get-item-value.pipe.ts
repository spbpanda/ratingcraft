import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../interfaces/filter';

@Pipe({
  name: 'getItemValue',
  standalone: true
})
export class GetItemValuePipe implements PipeTransform {

  transform(value: Item, ...args: unknown[]): unknown {
    return value?.value ?? ''
  }

}
