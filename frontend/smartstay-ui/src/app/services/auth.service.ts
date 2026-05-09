import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedIn.asObservable();

  // save token
  setToken(token: string) {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);   // notify UI
  }
  // get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // check login
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // logout
  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);  // notify UI
  }
  // decode JWT
  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  // get user role
  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role || decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  }
}

