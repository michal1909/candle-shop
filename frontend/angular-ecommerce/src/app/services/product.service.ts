import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { Category } from '../common/category';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/categories';

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    console.log("🔹 Final Token in Header:", JSON.stringify(token)); // ✅ Debug log

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    });
  }

  // ✅ Get a Single Product
  getProduct(theProductId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/${theProductId}`);
  }

  // ✅ Get Paginated Product List
  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {
    return this.httpClient.get<GetResponseProducts>(
      `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`
    );
  }

  // ✅ Get All Products Paginated
  getAllProductListPaginate(page: number, size: number): Observable<GetResponseProducts> {
    return this.httpClient.get<GetResponseProducts>(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  // ✅ Get Products by Category
  getProductList(theCategoryId: number): Observable<Product[]> {
    return this.getProducts(`${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`);
  }

  // ✅ Get All Categories
  getProductCategories(): Observable<Category[]> {
    return this.httpClient.get<GetResponseCategories>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  // ✅ Search Products (Paginated)
  searchProductsPaginate(thePage: number, thePageSize: number, keyword: string): Observable<GetResponseProducts> {
    return this.httpClient.get<GetResponseProducts>(
      `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${thePage}&size=${thePageSize}`
    );
  }

  // ✅ Search Products
  searchProducts(theKeyword: string): Observable<Product[]> {
    return this.getProducts(`${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`);
  }

  // ✅ Helper Function to Fetch Products
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
  }

  addProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.baseUrl, product, { headers: this.getAuthHeaders() });
  }

  updateProduct(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(`${this.baseUrl}/${product.id}`, product, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetResponseCategories {
  _embedded: {
    productCategory: Category[];
  };
}
