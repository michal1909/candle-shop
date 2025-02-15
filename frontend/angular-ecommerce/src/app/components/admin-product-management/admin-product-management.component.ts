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
  thePageNumber: number = 1;
  thePageSize: number = 12;
  theTotalElements: number = 0;
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
    this.productService.getAllProductListPaginate(this.thePageNumber - 1, this.thePageSize).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
  }

   updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
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
