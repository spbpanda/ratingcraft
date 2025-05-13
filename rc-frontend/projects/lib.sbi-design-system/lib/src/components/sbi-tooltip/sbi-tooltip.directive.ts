import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  WritableSignal
} from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SbiTooltipComponent } from './sbi-tooltip.component';
import { SbiSwipeComponent } from '../../classes/sbi-swipe-component';
import { SbiTooltipContent, SbiTooltipPosition } from "./sbi-tooltip.models";

/**
 * Компонент всплывающей подсказки.
 *
 * @Directive
 * @selector: '[sbiTooltip]'
 * @standalone: true
 */
@Directive({
  selector: '[sbiTooltip]',
  standalone: true,
})
export class SbiTooltipDirective implements OnInit, OnDestroy {
  /**
   * @public
   * @description Наполнение всплывающей подсказки.
   * @type {string | TemplateRef<any> | null}
   * @defaultValue null
   * */
  @Input('sbiTooltip') content: SbiTooltipContent = null;

  /**
   * @public
   * @description Положение всплывающей подсказки.
   * @type {'top' | 'bottom' | 'left' | 'right'}
   * @defaultValue null
   * */
  @Input('tooltipPosition') tooltipPosition: SbiTooltipPosition = 'bottom';

  /**
   * @private
   * @description
   * @type {OverlayRef}
   * @defaultValue OverlayRef
   * */
  private overlayRef!: OverlayRef;

  /**
   * @private
   * @description Кстомное событие скрытия всплывающей подсказки.
   * @type {CustomEvent<unknown>}
   * @defaultValue null
   * */
  private readonly hideTooltipsEvent: CustomEvent<unknown> = new CustomEvent('hideTooltip');

  /**
   * @private
   * @description Блокировка обработки события клика.
   * @type {WritableSignal<boolean>}
   * @defaultValue false
   * */
  private clickDelay: WritableSignal<boolean> = signal(false);

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  /**
   * @HostListener ('click', ['$event'])
   * @public
   * @description Отрисовка подсказки в мобильной версии.
   * */
  @HostListener('click', ['$event'])
  public showTooltipByMobile(event: UIEvent) {
    !SbiSwipeComponent.isDesktop(window) && this.show(event);
  }

  /**
   * @HostListener ('mouseenter', ['$event'])
   * @public
   * @description Отрисовка подсказки.
   * */
  @HostListener('mouseenter', ['$event'])
  show(event: UIEvent) {
    if (this.content == null) {
      return;
    }
    window.dispatchEvent(this.hideTooltipsEvent);

    const positions = this.getPositions();

    const positionStrategy = this.overlayPositionBuilder.flexibleConnectedTo(this.elementRef).withPositions(positions);

    this.overlayRef = this.overlay.create({ positionStrategy });

    const tooltipRef: ComponentRef<SbiTooltipComponent> = this.overlayRef.attach(
      new ComponentPortal(SbiTooltipComponent)
    );

    // Передаю в компонент Тултипа контент
    if (typeof this.content === 'string') {
      tooltipRef.instance.contentText = this.content;
    } else if (this.content instanceof TemplateRef) {
      tooltipRef.instance.content = this.content;
    }
    tooltipRef.instance.context = { $implicit: this.elementRef.nativeElement };
    tooltipRef.instance.tooltipPosition = this.tooltipPosition;

    setTimeout(() => this.positionArrow(), 10);

    this.delayForHideTooltip();
  }

  /**
   * @private
   * @description Блокирует скрытие подсказки нажатием на 100 миллисекунд.
   * */
  private delayForHideTooltip() {
    this.clickDelay.set(true);
    setTimeout(() => this.clickDelay.set(false), 100);
  }

  /**
   * @private
   * @description Устанавливает положение элемента - указателя.
   * */
  private positionArrow() {
    const tooltipElement = this.overlayRef.overlayElement?.querySelector('.tooltip-container') as HTMLElement;
    const arrowElement = tooltipElement?.querySelector('.tooltip-arrow') as HTMLElement;
    const parentElement = this.elementRef.nativeElement;
    if (!parentElement || !tooltipElement) {
      return;
    }
    const parentRect = parentElement.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    if ((tooltipRect.x || tooltipRect.y) && tooltipElement && arrowElement) {
      // Логика для позиционирования стрелки в зависимости от позиции тултипа
      switch (this.tooltipPosition) {
        case 'top':
          let arrowXT = parentRect.x - tooltipRect.left + parentRect.width / 2 - 16;
          arrowElement.style.left = `${arrowXT}px`;
          break;
        case 'bottom':
          let arrowXB = parentRect.x - tooltipRect.left + parentRect.width / 2;
          arrowElement.style.left = `${arrowXB}px`;
          break;
        case 'left':
        case 'right':
          let arrowY = parentRect.y - tooltipRect.top + parentRect.height / 2 - 4;
          arrowElement.style.top = `${arrowY}px`;
          break;
      }
      this.cdr.detectChanges();
    }
  }

  ngOnInit() {
    window.addEventListener('hideTooltip', () => !SbiSwipeComponent.isDesktop(window) && this.hide());
  }


  /**
   * @HostListener ('mouseleave')
   * @private
   * @description Скрытие подсказки на desktop.
   * */
  @HostListener('mouseleave')
  private hide() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.cdr.detectChanges();
    }
  }

  /**
   * @HostListener ('document:click')
   * @private
   * @description Скрытие подсказки на планшете и мобильном устройстве.
   * */
  @HostListener('document:click')
  private hideByMobile() {
    if (!SbiSwipeComponent.isDesktop(window) && !this.clickDelay()) {
      this.hide();
    }
  }

  /**
   * @private
   * @description Устанавливает положение всплывающей подсказки.
   * */
  private getPositions(): Array<ConnectionPositionPair> {
    switch (this.tooltipPosition) {
      case 'top':
        return [
          new ConnectionPositionPair({ originX: 'center', originY: 'top' }, { overlayX: 'center', overlayY: 'bottom' }),
        ];
      case 'bottom':
        return [
          new ConnectionPositionPair({ originX: 'center', originY: 'bottom' }, { overlayX: 'center', overlayY: 'top' }),
        ];
      case 'left':
        return [
          new ConnectionPositionPair({ originX: 'start', originY: 'center' }, { overlayX: 'end', overlayY: 'center' }),
        ];
      case 'right':
        return [
          new ConnectionPositionPair({ originX: 'end', originY: 'center' }, { overlayX: 'start', overlayY: 'center' }),
        ];
      default:
        return [
          new ConnectionPositionPair({ originX: 'center', originY: 'top' }, { overlayX: 'center', overlayY: 'bottom' }),
        ];
    }
  }

  ngOnDestroy() {
    this.hide();
    window.removeEventListener('hideTooltip', () => this.hide());
  }
}
