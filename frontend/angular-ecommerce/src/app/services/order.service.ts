import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from '../common/order';
import { Observable } from 'rxjs';
import { CartItem } from '../common/cart-item';
import { AuthService } from './auth.service';
import { OrderRequest } from '../common/order-request';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient, private authService: AuthService) { }

  createOrder(order: any): Observable<any> {
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `${token}`
      });

      return this.http.post(this.apiUrl, order, { headers });
  }
}
