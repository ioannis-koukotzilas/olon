import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  private readonly CART_KEY = 'cart_key';

  saveCart(cartId: string): void {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cartId));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  loadCart(): string | null {
    try {
      const cartData = localStorage.getItem(this.CART_KEY);
      return cartData ? JSON.parse(cartData) : null;
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return null;
    }
  }

  removeCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }

}