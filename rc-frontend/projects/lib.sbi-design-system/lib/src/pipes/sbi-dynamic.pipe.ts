import { Injector, Pipe, PipeTransform } from '@angular/core';

/**
 * Пайп для динамического применения других пайпов во время выполнения.
 *
 * Позволяет динамически применять любой пайп к значению, передавая токен пайпа и необходимые аргументы.
 * Это особенно полезно когда нужно выбрать пайп во время выполнения программы.
 *
 * @Pipe
 * @name: 'sbiDynamic'
 * @standalone: true
 */
@Pipe({
  name: 'sbiDynamic',
  standalone: true,
})
export class SbiDynamicPipe implements PipeTransform {
  /**
   * Конструктор с Injector для получения экземпляров пайпов.
   *
   * @param {Injector} injector - Инжектор Angular для создания экземпляров пайпов
   */
  public constructor(private injector: Injector) {
  }

  /**
   * Применяет указанный пайп к значению с переданными аргументами.
   *
   * @param {any} value - Значение для трансформации
   * @param {any} pipeToken - Токен пайпа, который нужно применить
   * @param {Array<any>} pipeArgs - Массив аргументов для пайпа
   * @returns {any} - Результат трансформации значения указанным пайпом
   */
  transform(value: any, pipeToken: any, pipeArgs?: Array<any>): any {
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
