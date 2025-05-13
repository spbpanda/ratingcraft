import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';
import { SbiBreadcrumbItem } from "./sbi-breadcrumb.models";

@Component({
  selector: 'sbi-breadcrumb',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatMenuModule,
    SbiIconComponent,
  ],
  templateUrl: './sbi-breadcrumb.component.html',
  styleUrl: './sbi-breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbiBreadcrumbComponent implements OnInit, OnDestroy {
  @Input() maxVisibleItems: number = 5;

  @Input() set breadcrumbs(value: Array<SbiBreadcrumbItem>) {
    if (value && value.length > 0) {
      this._breadcrumbs = value;
      this.updateVisibleItems();
      this.cdr.markForCheck();
    }
  }

  get breadcrumbs(): Array<SbiBreadcrumbItem> {
    return this._breadcrumbs;
  }

  private _breadcrumbs: Array<SbiBreadcrumbItem> = [];
  public visibleItems: Array<SbiBreadcrumbItem> = [];
  public hiddenItems: Array<SbiBreadcrumbItem> = [];
  public showDots: boolean = false;
  public dotsIndex: number = -1;

  private destroy$ = new Subject<void>();
  private breadcrumbsCache: Map<string, Array<SbiBreadcrumbItem>> = new Map();
  private currentUrl: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    if (this._breadcrumbs.length === 0) {
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.currentUrl = this.router.url;

          // Проверяем наличие кэшированных хлебных крошек для текущего URL
          if (this.breadcrumbsCache.has(this.currentUrl)) {
            this._breadcrumbs = this.breadcrumbsCache.get(this.currentUrl)!;
          } else {
            // Если кэша нет, создаем новые хлебные крошки и кэшируем их
            this._breadcrumbs = this.createBreadcrumbs(
              this.activatedRoute.root
            );
            this.breadcrumbsCache.set(this.currentUrl, [...this._breadcrumbs]);
          }

          this.updateVisibleItems();
          this.cdr.markForCheck();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.breadcrumbsCache.clear();
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: SbiBreadcrumbItem[] = []
  ): SbiBreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label =
        child.snapshot.data['breadcrumb'] || this.getRouteLabel(routeURL);
      if (label) {
        breadcrumbs.push({
          label: label,
          link: url,
          isActive: this.router.url === url,
        });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private getRouteLabel(path: string): string {
    if (!path) return '';
    return path
      .split('-')
      .map((part) => {
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(' ');
  }

  public updateVisibleItems(): void {
    const totalItems = this._breadcrumbs.length;

    if (totalItems <= this.maxVisibleItems) {
      // Если страниц мало (не больше maxVisibleItems), показываем все
      this.visibleItems = [...this._breadcrumbs];
      this.hiddenItems = [];
      this.showDots = false;
      return;
    }

    // Если страниц больше maxVisibleItems, применяем стратегию усечения:
    // Показываем первые 3, троеточие, последние 2

    // Отображаем первые 3 элемента
    const firstItems = this._breadcrumbs.slice(0, 3);

    // Отображаем последние 2 элемента
    const lastItems = this._breadcrumbs.slice(-2);

    // Скрываем элементы в середине (от 4 до предпоследнего)
    this.hiddenItems = this._breadcrumbs.slice(3, -2);

    // Флаг для показа троеточия (показываем если есть скрытые элементы)
    this.showDots = this.hiddenItems.length > 0;

    // Индекс, после которого будут отображаться три точки
    this.dotsIndex = 2; // После третьего элемента (индекс 2)

    // Объединяем видимые элементы
    this.visibleItems = [...firstItems, ...lastItems];
  }

  public getItemClass(item: SbiBreadcrumbItem): string {
    return item.isActive ? 'active' : 'default';
  }

  // Метод для очистки кэша (может использоваться, если нужно принудительно обновить хлебные крошки)
  public clearCache(): void {
    this.breadcrumbsCache.clear();
  }
}
