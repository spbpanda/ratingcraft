import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  TemplateRef
} from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SbiTooltipComponent } from './sbi-tooltip.component';

@Directive({
  selector: '[sbiTooltip]',
  standalone: true,
})
export class SbiTooltipDirective {
  @Input('sbiTooltip') content: string | TemplateRef<any> | null = null;
  @Input('tooltipPosition') tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  private overlayRef!: OverlayRef;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mouseenter', ['$event'])
  show(event: UIEvent) {
    if (this.content == null) {
      return;
    }
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

    setTimeout(() => {
      this.positionArrow(tooltipRef, event);
    }, 0);
  }

  private positionArrow(tooltipRef: ComponentRef<SbiTooltipComponent>, event: UIEvent) {
    const tooltipElement = this.overlayRef.overlayElement?.querySelector('.tooltip-container') as HTMLElement;
    const arrowElement = tooltipElement?.querySelector('.tooltip-arrow') as HTMLElement;
    const parentElement = this.elementRef.nativeElement;
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

  @HostListener('tap')
  @HostListener('mouseleave')
  hide() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.cdr.detectChanges();
    }
  }

  private getPositions(): ConnectionPositionPair[] {
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
}
