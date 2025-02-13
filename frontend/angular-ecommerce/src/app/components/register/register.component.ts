import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const registrationData = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:8080/api/auth/register', registrationData)
      .subscribe(
        () => {
          alert('Rejestracja udana! Możesz się teraz zalogować.');
          this.router.navigate(['/login']);
        },
        () => {
          alert('Błąd rejestracji!');
        }
      );
  }
}
