import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CLEAR_ICON } from './sbi-sberid-banner.const';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiSwipeComponent } from '../../classes/sbi-swipe-component';

@Component({
  selector: 'sbi-sberid-banner',
  templateUrl: './sbi-sberid-banner.component.html',
  styleUrl: './sbi-sberid-banner.component.scss',
  standalone: true,
  imports: [SbiIconComponent],
})
export class SbiSberidBannerComponent {
  @Input() rightIcon = '';
  @Input() clearIcon = CLEAR_ICON;
  @Input() label = 'Сделаем все за вас!';
  @Input() note = 'Войдите по Сбер ID, и мы заполним информацию за вас';

  @Output() clearBannerEvent = new EventEmitter();
  @Output() sberidAuthEvent = new EventEmitter();

  public get isMobile() {
    return SbiSwipeComponent.isMobile(window);
  }

  public onClearBanner() {
    this.clearBannerEvent.emit();
  }

  public onSberidAuth() {
    this.sberidAuthEvent.emit();
  }
}
