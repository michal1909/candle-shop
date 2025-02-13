import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '../platform';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  setToken(token: string) {
    localStorage.setItem('token', token);
    console.log("AuthService: Token zapisany:", token);
    this.isLoggedInSubject.next(true);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    const isLoggedIn = !!this.getToken();
    console.log("AuthService: Czy zalogowany?", isLoggedIn);
    return isLoggedIn;
  }

  logout() {
    localStorage.removeItem('token');
    console.log("AuthService: Token usunięty");
    this.isLoggedInSubject.next(false);
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const name = payload.name;
        console.log("AuthService: Imię użytkownika:", name);
        return name;
      } catch (error) {
        console.error("AuthService: Błąd dekodowania tokenu:", error);
        return null;
      }
    }
    return null;
  }
}
