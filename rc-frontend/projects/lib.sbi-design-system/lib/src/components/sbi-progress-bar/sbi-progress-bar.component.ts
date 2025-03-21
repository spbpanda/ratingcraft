import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';

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
   * Элемент шкалы прогресса.
   */
  @ViewChild('progressBar') progressBar!: MatProgressBar;

  /**
   * Режим работы шкалы прогресса.
   * @type {'determinate' | 'indeterminate'}
   */
  @Input() mode: 'determinate' | 'indeterminate' = 'indeterminate';

  /**
   * Процент заполненности шкалы прогресса.
   * @type {number}
   */
  @Input() value = 0;

  /**
   * Размер шкалы прогресса.
   * @type {'large' | 'small'}
   */
  @Input() size: 'large' | 'small' = 'large';

  /**
   * Лейбл шкалы прогресса.
   * @type {string | undefined}
   */
  @Input() label?: string;

  /**
   * Примечание шкалы прогресса.
   * @type {string | undefined}
   */
  @Input() note?: string;

  /**
   * Валидность или не валидность шкалы прогресса.
   * @type {boolean}
   */
  @Input() invalid = false;

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId = 'sbi-progress-bar-test-id';

  /**
   * Процент прогресса.
   */
  private get width() {
    return Math.min(Math.max(this.value, 0), 100);
  }

  /**
   * Компонент линии шкалы прогресса.
   */
  private get progressLine() {
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
   * Устанавливает процент прогресса.
   */
  private setWidth() {
    if (this.progressLine) {
      this.progressLine.style.width = `${this.width}%`;
    }
  }
}
