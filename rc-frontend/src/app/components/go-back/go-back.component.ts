import { Location, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'rc-go-back',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './go-back.component.html',
  styleUrl: './go-back.component.scss'
})
export class GoBackComponent {
  isHomePage: boolean = false;

  constructor(private location: Location, private router: Router) {
    // Подписываемся на изменения маршрута
    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/'; // Проверяем, является ли текущий маршрут главной страницей
    });
  }

  goBack(): void {
    this.location.back();
  }

}
