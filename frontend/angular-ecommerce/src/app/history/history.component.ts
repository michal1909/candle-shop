import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../common/order';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  orders: Order[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getOrderHistory().subscribe(orders => {
      this.orders = orders.map(order => {
          if (order.dateCreated) {
              order.dateCreated = new Date(order.dateCreated);
          }
          return order;
      });
      console.log("Pobrane zamówienia:", this.orders);
  }, error => {
      console.error("Błąd pobierania historii zamówień:", error);
  });
  }
}
