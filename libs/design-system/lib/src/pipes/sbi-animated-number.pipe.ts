import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';

const DEFAULT_START_VALUE = -999999999999;
const DEFAULT_END_VALUE = 99999999999999;

@Pipe({
  name: 'sbiAnimatedNumber',
  pure: false,
  standalone: true,
})
export class SbiAnimatedNumberPipe implements PipeTransform, OnDestroy {
  // @ts-ignore
  private changeInterval?: NodeJS.Timeout;
  private currentValue = 0;
  private startValue = DEFAULT_START_VALUE;
  private endValue = DEFAULT_END_VALUE;
  private isFloat = false;
  private duration = 2000;
  private tickDelay = 10;

  private changeDetector = inject(ChangeDetectorRef)

  transform(
    value: number | null,
    endValue: number | null,
    isFloat: boolean = false,
    duration: number = 2000,
    tickDelay: number = 10,
  ): string {
    if (value == null || endValue == null) {
      return value?.toString() ?? endValue?.toString() ?? '';
    }

    if (
      value !== this.startValue ||
      endValue !== this.endValue ||
      this.isFloat !== isFloat ||
      this.duration !== this.duration ||
      this.tickDelay !== tickDelay
    ) {
      this.customClearInterval();

      this.startValue = value;
      this.currentValue = value;
      this.endValue = endValue;
      this.isFloat = isFloat;
      this.duration = duration;
      this.tickDelay = tickDelay;

      const delta = (endValue - value) / duration * tickDelay;
      this.startAnimation(delta);
    }

    if (this.isFloat) {
      return this.currentValue.toFixed(2);
    }
    return Math.floor(this.currentValue).toString();
  }

  private startAnimation(delta: number) {
    this.changeInterval = setInterval(() => {
      this.currentValue += delta;
      if (Math.abs(delta) > Math.abs(this.currentValue - this.endValue)) {
        this.currentValue = this.endValue;
        this.customClearInterval();
      }

      this.changeDetector.markForCheck();
    }, this.tickDelay);
  }

  private customClearInterval() {
    clearInterval(this.changeInterval);
    this.changeInterval = undefined;
  }

  ngOnDestroy(): void {
    this.customClearInterval();
  }
}
