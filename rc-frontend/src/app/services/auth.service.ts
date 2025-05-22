declare var google: any;
import { Injectable } from '@angular/core';
import { User } from '../common/interfaces/user';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = environment.api;
  isAdmin$ = new BehaviorSubject<boolean>(false);

  private readonly TOKEN_EXPIRY_TIME = 30 * 60 * 1000; // 30 минут в миллисекундах

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  logout() {
    google.accounts.id.disableAutoSelect();
    sessionStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('loginTime');
    sessionStorage.removeItem('authRcToken');
  }

  isUserLoggedIn(): boolean {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const loginTime = sessionStorage.getItem('loginTime');

    if (!loggedInUser || !loginTime) {
      return false;
    }

    const currentTime = new Date().getTime();
    const timeElapsed = currentTime - Number(loginTime);

    if (timeElapsed > this.TOKEN_EXPIRY_TIME) {
      this.logout();
      this.router.navigate(['']);
      return false;
    }

    return true;
  }

  getLoggedInUser(): User | null {
    if (!this.isUserLoggedIn()) {
      return null;
    }

    const { name, given_name, email, picture } = JSON.parse(sessionStorage.getItem('loggedInUser') ?? '');
    return { name, given_name, email, picture };
  }

  setLoggedInUser(user: User): void {
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    sessionStorage.setItem('loginTime', new Date().getTime().toString());
  }

  adminLogin(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post(`${this.api}/admin/login`, credentials, { withCredentials: true }).pipe(tap((res: any) => res.token && this.isAdmin$.next(true)))
  }

  isAdmin(): Observable<any> {
    return this.http.get(`${this.api}/admin`, { withCredentials: true }).pipe(tap((res: any) => this.isAdmin$.next(res)))
  }
}