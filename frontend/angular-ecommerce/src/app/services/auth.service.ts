import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '../platform';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  private userNameSubject = new BehaviorSubject<string | null>(this.getUserName());
  userName$: Observable<string | null> = this.userNameSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {

  }

  setToken(token: string, user: any) {
    if (isPlatformBrowser(this.platformId)) {
      const cleanedToken = token.trim();
      localStorage.setItem('token', cleanedToken);
      console.log("Stored Token:", JSON.stringify(cleanedToken));

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.isLoggedInSubject.next(true);
        this.userNameSubject.next(user.name);
      } else {
        console.error("AuthService: Brak danych użytkownika do zapisania.");
        this.userNameSubject.next(null);
        this.isLoggedInSubject.next(false);
        localStorage.removeItem('token');
      }
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      let token = localStorage.getItem('token');

      if (token) {
        token = token.replace(/\s+/g, '');
        console.log("Cleaned Token:", JSON.stringify(token))
        return `Bearer ${token}`;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log("AuthService: Dane autentykacyjne usunięte");
      this.isLoggedInSubject.next(false);
      this.userNameSubject.next(null);
    }
  }

  getUser(): any | null {
    if (isPlatformBrowser(this.platformId)) {
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          return user;
        } catch (error) {
          console.error("AuthService: Błąd parsowania danych użytkownika:", error);
          localStorage.removeItem('user');
          return null;
        }
      }
    }
    return null;
  }

  getUserName(): string | null {
    const user = this.getUser();
    return user ? user.name : null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  checkAuthOnRefresh() {
    const token = this.getToken();
    const user = this.getUser();
    if (token && user) {
      this.isLoggedInSubject.next(true);
      this.userNameSubject.next(user.name);
    } else {
      this.isLoggedInSubject.next(false);
      this.userNameSubject.next(null);
    }
  }
}
