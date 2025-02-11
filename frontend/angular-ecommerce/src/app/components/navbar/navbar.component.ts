import { Component, OnInit } from '@angular/core';
import { Category } from '../../common/category';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  categories: Category[] = [];

  constructor(private productService: ProductService,
              private router: Router) {}

  ngOnInit(): void {
    this.productService.getProductCategories().subscribe(
      data => {
        this.categories = data;
      }
    );
  }

  doSearch(value: string) {
    this.router.navigateByUrl(`/search/${value}`);
  }
}
