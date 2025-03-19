import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('отработал guard')
    if (this.authService.isUserLoggedIn()) {
      return true; // Разрешить доступ, если пользователь авторизован
    } else {
      this.router.navigate(['']); // Перенаправить на главную страницу, если пользователь не авторизован
      return false; // Запретить доступ
    }
  }
}