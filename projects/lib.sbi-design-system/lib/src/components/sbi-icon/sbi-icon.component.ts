import { AfterViewInit, Component, ElementRef, input, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'sbi-icon',
  templateUrl: './sbi-icon.component.html',
  standalone: true
})
export class SbiIconComponent implements AfterViewInit {
  @ViewChild('sbiIcon') private _icon?: ElementRef;
  @Input() iconImage: string = '';
  @Input() testId = 'sbi-icon';

  ngAfterViewInit() {
    if (this._icon?.nativeElement && this.iconImage) {
      this._icon.nativeElement.innerHTML = this.iconImage;
    }
  }
}
