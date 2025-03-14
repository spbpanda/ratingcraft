declare var google: any;
import { Injectable } from '@angular/core';
import { User } from '../common/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_EXPIRY_TIME = 30 * 60 * 1000; // 30 минут в миллисекундах

  constructor() { }

  logout() {
    google.accounts.id.disableAutoSelect();
    sessionStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('loginTime');
    sessionStorage.removeItem('token');
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
}