import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  cartItems$: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {
      this.loadCartFromStorage();
  }

  loadCartFromStorage() {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem('cartItems');
        this.cartItems = data ? JSON.parse(data) : [];
        this.computeCartTotals();
        this.cartItems$.next(this.cartItems);
    }
}

saveCartToStorage() {
  if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}

  addToCart(theCartItem: CartItem) {
      let existingCartItem = this.cartItems.find(item => item.id === theCartItem.id);

      if (existingCartItem) {
          existingCartItem.quantity++;
      } else {
          this.cartItems.push(theCartItem);
      }

      this.computeCartTotals();
      this.saveCartToStorage();
      this.cartItems$.next(this.cartItems);
  }

  remove(theCartItem: CartItem) {
    this.cartItems = this.cartItems.filter(item => item.id !== theCartItem.id);
    this.computeCartTotals();
    this.saveCartToStorage();
  }

  decrementQuantity(theCartItem: CartItem) {
    let existingCartItem = this.cartItems.find(item => item.id === theCartItem.id);

    if (existingCartItem) {
      existingCartItem.quantity--;
      if (existingCartItem.quantity === 0) {
        this.remove(theCartItem);
      } else {
        this.computeCartTotals();
        this.saveCartToStorage();
      }
    }
  }

  computeCartTotals() {
    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (let item of this.cartItems) {
        totalPriceValue += item.quantity * item.price;
        totalQuantityValue += item.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
}

clearCart() {
  this.cartItems = [];
  this.computeCartTotals();
  if (typeof window !== 'undefined') {
      localStorage.removeItem('cartItems');
  }
}
}
