import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  @Output() loggedIn = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.post('http://localhost:8080/api/auth/login', { email: this.email, password: this.password })
      .subscribe({
        next: (response: any) => {
          // console.log("Odpowiedź z serwera:", response);
          this.isLoading = false;
          this.authService.setToken(response.token, response.user);
          // console.log("Login: Zalogowano, token:", response.token);
          // console.log("Login: Dane użytkownika:", response.user);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Błąd logowania:", error);
          if (error.status === 401) {
            this.errorMessage = 'Nieprawidłowy email lub hasło.';
          } else {
            this.errorMessage = 'Wystąpił błąd podczas logowania. Spróbuj ponownie później.';
          }
        }
      });
  }
}
