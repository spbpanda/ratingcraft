import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgClass } from '@angular/common';
import { SbiProgressBarMode, SbiProgressBarSize } from '../sbi-progress-bar/sbi-progress-bar.models';
import { SbiProgressSpinnerAppearance } from './sbi-progress-spinner.models';

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
  styleUrl: './sbi-progress-spinner.component.scss',
})
export class SbiProgressSpinnerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  /**
   * @private
   * @description Элемент контейнера спиннера.
   * @type {ElementRef<HTMLDivElement>}
   * @defaultValue ElementRef<HTMLDivElement>
   */
  @ViewChild('spinnerContainer') private spinnerContainer!: ElementRef<HTMLDivElement>;

  /**
   * @private
   * @description Элемент спиннера.
   * @type {MatProgressSpinner}
   * @defaultValue MatProgressSpinner
   */
  @ViewChild('progressSpinner') private progressSpinner!: MatProgressSpinner;

  /**
   * @private
   * @readonly
   * @description Сервис проверки необходимости пере отрисовки экрана.
   */
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  /**
   * @public
   * @description Режим работы спиннера.
   * @type {'determinate' | 'indeterminate'}
   * @defaultValue 'indeterminate'
   */
  @Input() public mode: SbiProgressBarMode = 'indeterminate';

  /**
   * @public
   * @description Режим работы спиннера.
   * @type {'accent' | 'neutral'}
   * @defaultValue 'accent'
   */
  @Input() public appearance: SbiProgressSpinnerAppearance = 'accent';

  /**
   * @public
   * @description Процент заполненности спиннера.
   * @type {number}
   * @defaultValue 0
   */
  @Input() public value: number = 0;

  /**
   * @public
   * @description Кастомный размер спиннера (в px).
   * @type {number | undefined}
   * @defaultValue undefined
   */
  @Input() public diameter?: number;

  /**
   * @public
   * @description Размер спиннера.
   * @type {'large' | 'small'}
   * @defaultValue 'large'
   */
  @Input() public size: SbiProgressBarSize = 'large';

  /**
   * @public
   * @description Режим работы спиннера.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public isIntegrate: boolean = true;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-progress-spinner-test-id'
   */
  @Input() testId: string = 'sbi-progress-spinner-test-id';

  /**
   * @private
   * @getter
   * @description Элемент - контейнер determinate спиннера.
   * @return {HTMLElement | null | undefined}
   */
  private get progressRound(): HTMLElement | null | undefined {
    return this.progressSpinner?._elementRef?.nativeElement?.children?.item(0) as HTMLElement;
  }

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
   * @description Градус отклонения для не активной (серой) части.
   * @return {number}
   */
  private get degrees(): number {
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
      this.cdr.detectChanges();
      this.updateAnimation();
      this.setCircleSize();
    }
    if (Object.prototype.hasOwnProperty.call(changes, 'isIntegrate')) {
      this.cdr.detectChanges();
      this.spinnerContainer.nativeElement.remove();
      if (!changes['isIntegrate'].currentValue) {
        document.body.appendChild(this.spinnerContainer.nativeElement);
      }
    }
  }

  /**
   * @private
   * @description Добавляем вторую картинку - неактивная часть прогресса.
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
   * @private
   * @description Добавляем круг - неактивной части прогресса.
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
   * @private
   * @description Изменяет размер неактивной части спиннера
   */
  private setCircleSize() {
    if (this.progressRound) {
      const progressCircle = this.progressRound.children.item(0)!.children.item(0) as HTMLElement;
      const determinateCircle = this.progressRound.children.item(1)!.children.item(0) as HTMLElement;
      const progressCircleStrokeDasharray = this.toNumber(progressCircle.style.strokeDasharray);
      const progressCircleStrokeDashoffset = this.toNumber(progressCircle.style.strokeDashoffset);
      let maxSize = progressCircleStrokeDasharray - progressCircleStrokeDashoffset;
      const offsetByRotate = this.width > 0 ? progressCircleStrokeDasharray / (180 / this.degrees) : 0;
      const newStrokeDashoffset = Math.min(
        Math.abs(Math.min(-maxSize - offsetByRotate, 0)),
        Math.abs(progressCircleStrokeDasharray)
      );
      determinateCircle.style.strokeDashoffset = this.toString(-newStrokeDashoffset);
    }
  }

  /**
   * @private
   * @description Преобразует строку с пискелей в число пикселей.
   * @param px - строковое значение размера (в пикселях)
   * @return {number}
   */
  private toNumber(px: string): number {
    return Number(px.replace('px', ''));
  }

  /**
   * @private
   * @description Преобразует число пискелей в строковое значение размера (в пикселях).
   * @param numb - числовое значение размера (в пикселях)
   * @return {string}
   */
  private toString(numb: number): string {
    return `${numb}px`;
  }

  /**
   * @private
   * @description Обновление анимации не активной части спиннера. Нужно для анимаций начала и конца круга спиннера.
   */
  private updateAnimation() {
    if (!this.progressRound) {
      return;
    }
    const determinateCircle = this.progressRound.children.item(1)!.children.item(0) as HTMLElement;
    if (this.width === 0) {
      setTimeout(
        () => (determinateCircle.style.transition = 'stroke-dashoffset 200ms  0ms cubic-bezier(0, 0, 0.2, 1)'),
        750
      );
    } else if (this.width === 100) {
      determinateCircle.style.transition = 'stroke-dashoffset 700ms 0ms cubic-bezier(0, 0, 0.2, 1)';
    } else {
      setTimeout(
        () => (determinateCircle.style.transition = 'stroke-dashoffset 500ms 0ms cubic-bezier(0, 0, 0.2, 1)'),
        250
      );
    }
  }

  ngOnDestroy() {
    this.spinnerContainer.nativeElement.remove();
  }
}
