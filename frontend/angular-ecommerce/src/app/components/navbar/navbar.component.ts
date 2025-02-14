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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productService.getProductCategories().subscribe(
      data => {
        this.categories = data;
      }
    );

    this.checkLoginStatus();

    this.isLoggedInSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.userName = this.authService.getUserName();
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
    this.cdr.detectChanges();
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
