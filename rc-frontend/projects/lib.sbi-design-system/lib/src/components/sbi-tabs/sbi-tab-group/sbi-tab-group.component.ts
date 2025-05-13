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
import { NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { SbiTabGroupAlignTabs, SbiTabGroupSize } from './sbi-tab-group.models';

/**
 * Компонент для группировки и отображения вкладок SbiTabComponent.
 *
 * Предоставляет контейнер для вкладок с возможностью настройки их выравнивания.
 * Автоматически собирает и отображает вложенные вкладки SbiTabComponent.
 *
 * @Component
 * @selector: 'sbi-tab-group'
 * @standalone: true
 * @imports: [MatTabsModule, SbiTabComponent, NgTemplateOutlet, NgClass, NgStyle, NgForOf, NgIf]
 * @templateUrl: './sbi-tab-group.component.html'
 * @styleUrl: './sbi-tab-group.component.scss'
 */
@Component({
  selector: 'sbi-tab-group',
  standalone: true,
  imports: [
    MatTabsModule,
    NgTemplateOutlet,
    NgClass,
    NgForOf,
    NgIf,
  ],
  templateUrl: './sbi-tab-group.component.html',
  styleUrl: './sbi-tab-group.component.scss',
})
export class SbiTabGroupComponent implements AfterViewInit, AfterContentInit {
  /**
   * @public
   * @description Выравнивание вкладок в группе.
   * - 'start': выравнивание по левому краю;
   * - 'center': выравнивание по центру;
   * - 'end': выравнивание по правому краю;
   * - 'stretch': равномерное распределение.
   * @type {'start' | 'center' | 'end' | 'stretch'}
   * @defaultValue 'stretch'
   */
  @Input() public alignTabs: SbiTabGroupAlignTabs = 'stretch';

  /**
   * @public
   * @description Размер вкладок в группе:
   * - 'small': маленькие;
   * - 'large': большие (по умолчанию);
   * @type {'large' | 'small'}
   * @defaultValue 'large'
   */
  @Input() public size: SbiTabGroupSize = 'large';

  /**
   * @public
   * @description Коллекция дочерних компонентов вкладок.
   * @type {QueryList<SbiTabComponent>}
   */
  @ContentChildren(SbiTabComponent, { descendants: true })
  public tabs!: QueryList<SbiTabComponent>;

  /**
   * @description Массив дочерних компонентов вкладок для отображения.
   * @type {Array<SbiTabComponent>}
   */
  public tabsArray: Array<SbiTabComponent> = [];

  /**
   * @param {ChangeDetectorRef} cdr - Ссылка на детектор изменений Angular.
   * @param {Renderer2} renderer - Renderer2 для манипуляций с DOM.
   * @param {ElementRef} el - Ссылка на элемент компонента.
   */
  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2, private el: ElementRef) {
  }

  /**
   * @description Инициализирует массив вкладок после инициализации содержимого.
   */
  ngAfterContentInit(): void {
    Promise.resolve().then(() => {
      this.tabsArray = this.tabs.toArray();
      this.cdr.detectChanges();
    });
  }

  /**
   * @description Настраивает стили выравнивания вкладок после инициализации представления.
   */
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

  /**
   * @public
   * @description Функция для отслеживания индекса элемента в цикле NgFor.
   * @param {number} index - Индекс элемента.
   * @returns {number} Тот же индекс, для оптимизации рендеринга.
   */
  public trackByIndex(index: number): number {
    return index;
  }
}
