import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  QueryList,
  Renderer2,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SbiTabComponent } from '../sbi-tab/sbi-tab.component';
import { NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'sbi-tab-group',
  standalone: true,
  imports: [
    MatTabsModule,
    SbiTabComponent,
    NgTemplateOutlet,
    NgClass,
    NgStyle,
    NgForOf,
    NgIf,
  ],
  templateUrl: './sbi-tab-group.component.html',
  styleUrl: './sbi-tab-group.component.scss',
})
export class SbiTabGroupComponent implements AfterViewInit, AfterContentInit {
  @Input() alignTabs: 'start' | 'center' | 'end' | 'stretch' = 'stretch';
  @ContentChildren(SbiTabComponent, { descendants: true })
  public tabs!: QueryList<SbiTabComponent>;

  public tabsArray: SbiTabComponent[] = [];

  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2, private el: ElementRef) {}

  ngAfterContentInit(): void {
    Promise.resolve().then(() => {
      this.tabsArray = this.tabs.toArray();
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    const element = this.el.nativeElement.querySelector('.mat-mdc-tab-labels');
    const alignStyles: Record<string, string> = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      stretch: 'space-between',
    };
    const justifyContent = alignStyles[this.alignTabs];
    if (justifyContent) {
      this.renderer.setStyle(element, 'justify-content', justifyContent);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
