import { Component, OnInit } from "@angular/core";
import { Order } from "../../common/order";
import { CartItem } from "../../common/cart-item";
import { OrderService } from "../../services/order.service";
import { CartService } from "../../services/cart.service";
import { Address } from "../../common/address";
import { Router } from "@angular/router";

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  order: Order = new Order();
  cartItems: CartItem[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private orderService: OrderService, private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  copyAddress() {
    if (this.order.sameAsDelivery) {
        this.order.invoiceAddress = { ...this.order.address };
    } else {
        this.order.invoiceAddress = new Address();
    }
}

onSubmit() {
  this.isLoading = true;
  this.errorMessage = '';

  const orderItems = this.cartItems.map(cartItem => ({
    productId: cartItem.product.id,
    quantity: cartItem.quantity,
    price: cartItem.price
  }));


  const orderRequest = {
    order: this.order,
    orderItems: orderItems,
    sameAsDelivery: this.order.sameAsDelivery
  };

  console.log('Wysyłany JSON:', JSON.stringify(orderRequest, null, 2)); // Debug

  this.orderService.createOrder(orderRequest).subscribe({
      next: (response: any) => {
          console.log('Zamówienie złożone:', response);
          this.isLoading = false;
          this.cartService.clearCart();
          this.router.navigate(['/order-success']);
      },
      error: (error) => {
          console.error('Błąd podczas składania zamówienia:', error);
          this.isLoading = false;
          this.errorMessage = 'Wystąpił błąd. Spróbuj ponownie później.';
      }
  });
}
}
