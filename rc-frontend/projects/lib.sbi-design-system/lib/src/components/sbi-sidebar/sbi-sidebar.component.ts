import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'sbi-sidebar',
  templateUrl: 'sbi-sidebar.component.html',
  styleUrls: ['sbi-sidebar.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class SbiSidebarComponent {
  @Input() priceLabel = 'Укажите первичные данные, чтобы узнать стоимость полиса';
  @Input() showMainInfo = false;
  @Input() promoLabel = 'У меня есть промокод';
  @Input() docsLabel = 'Документы';
  @Input() showPromo = true;
  @Input() showDocs = true;
  @Input() showAfterPriceInfo = false;
  @Input() showBeforeMainInfo = false;
  @Input() showAfterMainInfo = false;
  @Input() showAfterDocsAndPromoInfo = false;

  @Output() promoClickEvent = new EventEmitter<Event>();
  @Output() docsClickEvent = new EventEmitter<Event>();

  public onPromoClick(event: Event) {
    this.promoClickEvent.emit(event);
  }

  public onDocsClick(event: Event) {
    this.docsClickEvent.emit(event);
  }
}
