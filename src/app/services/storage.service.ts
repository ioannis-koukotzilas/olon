import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly CART_KEY = 'cart_key';

  setCartToLocalStorage(cartId: string): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cartId));
  }

  getCartFromLocalStorage(): string | null {
    const cartData = localStorage.getItem(this.CART_KEY);
    return cartData ? JSON.parse(cartData) : null;
  }

  removeCartFromLocalStorage(): void {
    localStorage.removeItem(this.CART_KEY);
  }
}
