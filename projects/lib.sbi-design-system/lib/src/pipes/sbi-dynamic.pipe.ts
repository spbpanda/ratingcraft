import { Injector, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sbiDynamic',
  standalone: true,
})
export class SbiDynamicPipe implements PipeTransform {
  public constructor(private injector: Injector) {}

  transform(value: any, pipeToken: any, pipeArgs?: any[]): any {
    if (!pipeToken) {
      return value;
    }
    const pipe = this.injector.get(pipeToken);
    if (pipeArgs && pipeArgs.length) {
      return pipe.transform(value, ...pipeArgs);
    }
    return pipe.transform(value);
  }
}
