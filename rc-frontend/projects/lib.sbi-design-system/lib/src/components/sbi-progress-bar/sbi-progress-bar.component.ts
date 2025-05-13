import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { SbiProgressBarMode, SbiProgressBarSize } from './sbi-progress-bar.models';

/**
 * Компонент для отображения прогресса прохождения процесса или прогресса загрузки.
 *
 * @Component
 * @selector: 'sbi-progress-bar'
 * @standalone: true
 * @imports: [MatProgressBar, NgIf]
 * @templateUrl: './sbi-progress-bar.component.html'
 * @styleUrl: './sbi-progress-bar.component.scss'
 */
@Component({
  selector: 'sbi-progress-bar',
  standalone: true,
  imports: [MatProgressBar, NgIf],
  templateUrl: './sbi-progress-bar.component.html',
  styleUrl: './sbi-progress-bar.component.scss'
})
export class SbiProgressBarComponent implements AfterViewInit, OnChanges {
  /**
   * @private
   * @description Элемент шкалы прогресса.
   * @type {MatProgressBar}
   * @defaultValue MatProgressBar
   */
  @ViewChild('progressBar') private progressBar!: MatProgressBar;

  /**
   * @public
   * @description Режим работы шкалы прогресса.
   * @type {'determinate' | 'indeterminate'}
   * @defaultValue 'indeterminate'
   */
  @Input() public mode: SbiProgressBarMode = 'indeterminate';

  /**
   * @public
   * @description Процент заполненности шкалы прогресса.
   * @type {number}
   * @defaultValue 0
   */
  @Input() public value: number = 0;

  /**
   * @public
   * @description Размер шкалы прогресса.
   * @type {'large' | 'small'}
   * @defaultValue 'large'
   */
  @Input() public size: SbiProgressBarSize = 'large';

  /**
   * @public
   * @description Лейбл шкалы прогресса.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public label?: string;

  /**
   * @public
   * @description Примечание шкалы прогресса.
   * @type {string | undefined}
   * @defaultValue undefined
   */
  @Input() public note?: string;

  /**
   * @public
   * @description Валидность или не валидность шкалы прогресса.
   * @type {boolean}
   * @defaultValue false
   */
  @Input() public invalid: boolean = false;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-progress-bar-test-id'
   */
  @Input() public testId: string = 'sbi-progress-bar-test-id';

  /**
   * @private
   * @getter
   * @description Процент прогресса.
   * @return {number}
   */
  private get width(): number {
    return Math.min(Math.max(this.value, 0), 100);
  }

  /**
   * @private
   * @getter
   * @description Компонент линии шкалы прогресса.
   * @return {HTMLElement | null | undefined}
   */
  private get progressLine(): HTMLElement | null | undefined {
    return this.progressBar?._elementRef?.nativeElement?.children?.item(1) as HTMLElement | null | undefined;
  }

  ngAfterViewInit() {
    this.setWidth();
    if (this.mode === 'determinate' && this.progressLine) {
      this.progressLine.style.transition = 'width 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Object.prototype.hasOwnProperty.call(changes, 'value') && this.progressLine) {
      this.setWidth();
    }
    if (changes['mode'] && changes['mode'].currentValue === 'determinate' && this.progressLine) {
      this.progressLine.style.transition = 'width 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)';
    }
    if (changes['mode'] && changes['mode'].currentValue === 'indeterminate' && this.progressLine) {
      this.progressLine.style.transition = 'transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)';
    }
  }

  /**
   * @private
   * @description Устанавливает процент прогресса.
   */
  private setWidth() {
    if (this.progressLine) {
      this.progressLine.style.width = `${this.width}%`;
    }
  }
}
