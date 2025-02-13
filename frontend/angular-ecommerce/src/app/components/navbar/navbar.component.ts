import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Category } from '../../common/category';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: false,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  isLoggedIn: boolean = false;
  userName: string | null = null;
  private isLoggedInSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef // Dodajemy ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productService.getProductCategories().subscribe(
      data => {
        this.categories = data;
      }
    );

    this.checkLoginStatus(); // Sprawdzamy status logowania przy inicjalizacji

    this.isLoggedInSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      console.log("Navbar: Otrzymałem z AuthService, czy zalogowany?", isLoggedIn);
      this.isLoggedIn = isLoggedIn;
      this.userName = this.authService.getUserName();
      console.log("Navbar: Imię użytkownika:", this.userName);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.isLoggedInSubscription) {
      this.isLoggedInSubscription.unsubscribe();
    }
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userName = this.authService.getUserName();
    console.log("Navbar: Początkowy status logowania:", this.isLoggedIn); // Logujemy status logowania
    console.log("Navbar: Początkowe imię użytkownika:", this.userName); // Logujemy imię użytkownika
    this.cdr.detectChanges(); // Wymuszamy aktualizację widoku
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => { // Dodajemy then()
      this.cdr.detectChanges(); // Ręcznie wymuszamy detekcję zmian
    });
  }

  doSearch(value: string) {
    this.router.navigateByUrl(`/search/${value}`);
  }
}
