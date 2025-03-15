import { NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'rc-go-back',
  standalone: true,
  imports: [NgIf],
  templateUrl: './go-back.component.html',
  styleUrl: './go-back.component.scss'
})
export class GoBackComponent implements OnInit, OnDestroy {
  isHomePage: boolean = false;
  private navigationHistory: string[] = [];
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.isHomePage = event.url === '/';
          this.navigationHistory.push(event.url); // Сохраняем URL в истории
        }
      });
  }

  goBack(): void {
    // if (this.navigationHistory.length > 1) {
    //   this.navigationHistory.pop(); // Удаляем текущий URL
    //   const previousUrl = this.navigationHistory[this.navigationHistory.length - 1];
    //   this.router.navigateByUrl(previousUrl); // Переходим на предыдущий URL
    // } else {
    //   this.router.navigateByUrl('/'); // Если история пуста, переходим на главную
    // }
    this.router.navigateByUrl('/'); // Если история пуста, переходим на главную
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}