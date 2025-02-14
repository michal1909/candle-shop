import { Component, Inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';

@Component({
  selector: 'app-admin-product-management',
  standalone: false,
  templateUrl: './admin-product-management.component.html',
  styleUrls: ['./admin-product-management.component.css']
})
export class AdminProductManagementComponent {
  products: Product[] = [];
  currentPage = 0;
  pageSize = 5;
  totalProducts = 0;
  selectedProduct: Product | null = null;

  productForm: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    stock: 0
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProductListPaginate(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.products = response._embedded.products;
        this.totalProducts = response.page.totalElements;
      });
  }

  changePage(page: number): void {
    this.currentPage = page - 1;
    this.loadProducts();
  }

  editProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.productForm = { ...product };
  }

  resetForm(): void {
    this.productForm = { id: 0, name: '', description: '', price: 0, imageUrl: '', stock: 0 };
    this.selectedProduct = null;
  }

  saveProduct(): void {
    if (this.selectedProduct) {
      // Edycja produktu
      this.productService.updateProduct(this.productForm).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    } else {
      // Dodawanie nowego produktu
      this.productService.addProduct(this.productForm).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    }
  }

  deleteProduct(productId: number): void {
    if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
      this.productService.deleteProduct(productId).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
