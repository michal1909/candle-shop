import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[] = [];
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {
    if (this.isBrowser()) {
      this.loadCartFromStorage(); // Wczytanie koszyka tylko w przeglądarce
    }
  }

  // Sprawdzamy, czy kod jest wykonywany po stronie klienta
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  loadCartFromStorage() {
    if (this.isBrowser()) {
      const data = localStorage.getItem('cartItems');
      this.cartItems = data ? JSON.parse(data) : [];
      this.computeCartTotals();
    }
  }

  saveCartToStorage() {
    if (this.isBrowser()) {
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
    if (this.isBrowser()) {
      localStorage.removeItem('cartItems');
    }
  }
}
