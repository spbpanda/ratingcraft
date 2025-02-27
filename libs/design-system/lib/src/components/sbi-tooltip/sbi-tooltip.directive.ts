import { ComponentRef, Directive, ElementRef, HostListener, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayPositionBuilder, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SbiTooltipComponent } from './sbi-tooltip.component';

type Position = {
    originX: 'center' | 'start' | 'end';
    originY: 'center' | 'top' | 'bottom';
    overlayX: 'center' | 'start' | 'end';
    overlayY: 'center' | 'top' | 'bottom';
    offsetX?: number;
    offsetY?: number;
};

@Directive({
    selector: '[sbiTooltip]',
    standalone: true
})
export class SbiTooltipDirective {

    @Input('sbiTooltip') content: string | TemplateRef<any> | null = null;
    @Input('tooltipPosition') tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
    private overlayRef!: OverlayRef;
  
    constructor(
      private overlay: Overlay,
      private overlayPositionBuilder: OverlayPositionBuilder,
      private elementRef: ElementRef,
      private viewContainerRef: ViewContainerRef
    ) {}
  
    @HostListener('mouseenter')
    show() {
      const positions = this.getPositions();
  
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions(positions);
  
      this.overlayRef = this.overlay.create({ positionStrategy });
  
      const tooltipRef: ComponentRef<SbiTooltipComponent> = this.overlayRef.attach(new ComponentPortal(SbiTooltipComponent));
      // Передаю в компонент Тултипа контент
      if (typeof this.content === 'string') {
        tooltipRef.instance.contentText = this.content;
      } else if (this.content instanceof TemplateRef) {
        tooltipRef.instance.content = this.content;
      }
      tooltipRef.instance.context = { $implicit: this.elementRef.nativeElement };
      tooltipRef.instance.tooltipPosition = this.tooltipPosition;
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
      if (this.overlayRef && this.overlayRef.hasAttached()) {
        const tooltipElement = this.overlayRef.overlayElement.querySelector('.tooltip-container') as HTMLElement;
        const arrowElement = tooltipElement.querySelector('.tooltip-arrow') as HTMLElement;
    
        if (tooltipElement && arrowElement) {
          const tooltipRect = tooltipElement.getBoundingClientRect();
          const cursorX = event.clientX;
          const cursorY = event.clientY;
          // Логика для позиционирования стрелки в зависимости от позиции тултипа
          switch (this.tooltipPosition) {
            case 'top':
            case 'bottom':
              const minX = 16;
              const maxX = tooltipRect.width - 16;
              let arrowX = cursorX - tooltipRect.left;
              arrowX = Math.max(minX, Math.min(arrowX, maxX));
              arrowElement.style.left = `${arrowX}px`;
              break;

            case 'left':
            case 'right':
              const minY = 16;
              const maxY = tooltipRect.height - 16;
              let arrowY = cursorY - tooltipRect.top;
              arrowY = Math.max(minY, Math.min(arrowY, maxY));
              arrowElement.style.top = `${arrowY - 4}px`;
              break;
          }
        }
      }
    }
  
    @HostListener('mouseleave')
    hide() {
      if (this.overlayRef) {
        this.overlayRef.detach();
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

