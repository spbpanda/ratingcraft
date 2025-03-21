import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgClass } from '@angular/common';

/**
 * Компонент (кружок\крутилка) для отображения прогресса прохождения процесса или прогресса загрузки.
 *
 * @Component
 * @selector: 'sbi-progress-spinner'
 * @standalone: true
 * @imports: [MatProgressSpinner, NgClass]
 * @templateUrl: './sbi-progress-spinner.component.html'
 * @styleUrl: './sbi-progress-spinner.component.scss'
 */
@Component({
  selector: 'sbi-progress-spinner',
  standalone: true,
  imports: [MatProgressSpinner, NgClass],
  templateUrl: './sbi-progress-spinner.component.html',
  styleUrl: './sbi-progress-spinner.component.scss'
})
export class SbiProgressSpinnerComponent implements OnInit, AfterViewInit, OnChanges {
  /**
   * Элемент спиннера.
   */
  @ViewChild('progressSpinner') private progressSpinner!: MatProgressSpinner;

  /**
   * Режим работы спиннера.
   * @type {'accent' | 'neutral'}
   */
  @Input() appearance: 'accent' | 'neutral' = 'accent';

  /**
   * Режим работы спиннера.
   * @type {'determinate' | 'indeterminate'}
   */
  @Input() mode: 'determinate' | 'indeterminate' = 'indeterminate';

  /**
   * Процент заполненности спиннера.
   * @type {number}
   */
  @Input() value = 0;

  /**
   * Кастомный размер спиннера (в px).
   * @type {number}
   */
  @Input() diameter?: number;

  /**
   * Размер спиннера.
   * @type {'large' | 'small'}
   */
  @Input() size: 'large' | 'small' = 'large'

  /**
   * Режим работы спиннера.
   * @type {boolean}
   */
  @Input() isIntegrate: boolean = true;

  /**
   * Идентификатор для тестирования.
   * @type {string}
   */
  @Input() testId = 'sbi-progress-spinner-test-id';

  /**
   * Элемент - контейнер determinate спиннера .
   */
  private get progressRound(): HTMLElement | null | undefined {
    return this.progressSpinner?._elementRef?.nativeElement?.children?.item(0) as HTMLElement
  }

  /**
   * Процент прогресса.
   */
  private get width() {
    return Math.min(Math.max(this.value, 0), 100);
  }

  /**
   * Градус отклонения для не активной (серой) части.
   */
  private get degrees() {
    return this.diameter! >= 80 ? 15 : 30;
  }

  ngOnInit() {
    if (!this.diameter) {
      this.diameter = this.size === 'large' ? 48 : 24;
    }
  }

  ngAfterViewInit() {
    this.initDeterminateSpinner();
    if (this.mode === 'determinate' && this.progressRound) {
      this.appendDeterminateSpinner();
      this.updateAnimation();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['diameter'] && changes['size'] && changes['size'].currentValue) {
      this.diameter = this.size === 'large' ? 48 : 24;
    }
    if (Object.prototype.hasOwnProperty.call(changes, 'value')) {
      this.updateAnimation();
      setTimeout(() => this.setCircleSize());
    }
  }

  /**
   * Добавляем вторую картинку - неактивная часть прогресса.
   */
  private initDeterminateSpinner() {
    if (this.progressRound) {
      const img = this.progressRound.children.item(0) as HTMLElement;
      if (img) {
        img.style.position = 'absolute';
        this.progressRound.appendChild(img);
      }
    }
  }

  /**
   * Добавляем круг - неактивной части прогресса.
   */
  private appendDeterminateSpinner() {
    if (this.progressRound) {
      const img = this.progressRound.children.item(0) as HTMLElement;
      const circle = img.children.item(0) as HTMLElement;
      this.progressRound.appendChild(img.cloneNode());
      const determinateRoundIcon = this.progressRound.children.item(1) as HTMLElement;
      determinateRoundIcon.style.position = 'absolute';
      determinateRoundIcon.style.transform = `rotate(-${this.degrees}deg)`;
      determinateRoundIcon.appendChild(circle.cloneNode());
      const newCircle = determinateRoundIcon.children.item(0) as HTMLElement;
      if (newCircle) {
        newCircle.style.stroke = '#FFFFFF66';
        this.setCircleSize();
      }
    }
  }

  /**
   * Изменяет размер неактивной части спиннера
   */
  private setCircleSize() {
    if (this.progressRound) {
      const progressCircle = this.progressRound.children.item(0)!.children.item(0) as HTMLElement;
      const determinateCircle = this.progressRound.children.item(1)!.children.item(0) as HTMLElement;
      const progressCircleStrokeDasharray = this.toNumber(progressCircle.style.strokeDasharray);
      const progressCircleStrokeDashoffset = this.toNumber(progressCircle.style.strokeDashoffset);
      let maxSize = progressCircleStrokeDasharray - progressCircleStrokeDashoffset;
      const offsetByRotate = this.width > 0 ? progressCircleStrokeDasharray / (180 / this.degrees) : 0;
      const newStrokeDashoffset = Math.min(Math.abs(Math.min(-maxSize - offsetByRotate, 0)), Math.abs(progressCircleStrokeDasharray));
      determinateCircle.style.strokeDashoffset = this.toString(-newStrokeDashoffset);
    }
  }

  /**
   * Преобразует строку с пискелей в число пикселей
   *
   * @param px - строковое значение размера (в пикселях)
   */
  private toNumber(px: string) {
    return Number(px.replace('px', ''))
  }

  /**
   * Преобразует число пискелей в строковое значение размера (в пикселях)
   *
   * @param numb - числовое значение размера (в пикселях)
   */
  private toString(numb: number) {
    return `${numb}px`;
  }

  /**
   * Обновление анимации не активной части спиннера. Нужно для анимаций начала и конца круга спиннера.
   */
  private updateAnimation() {
    if (!this.progressRound) {
      return
    }
    const determinateCircle = this.progressRound.children.item(1)!.children.item(0) as HTMLElement
    if (this.width === 0) {
      setTimeout(() => determinateCircle.style.transition = 'stroke-dashoffset 200ms  0ms cubic-bezier(0, 0, 0.2, 1)', 750)
    } else if (this.width === 100) {
      determinateCircle.style.transition = 'stroke-dashoffset 700ms 0ms cubic-bezier(0, 0, 0.2, 1)'
    } else {
      setTimeout(() => determinateCircle.style.transition = 'stroke-dashoffset 500ms 0ms cubic-bezier(0, 0, 0.2, 1)', 250);
    }
  }
}
