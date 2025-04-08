import { inject, Injectable } from '@angular/core';
import { ShopifyService } from './shopify.service';
import { BehaviorSubject, take } from 'rxjs';
import { Cart } from '../models/cart/cart';
import { CartLineInput } from '../models/cart/cartLineInput';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private shopifyService = inject(ShopifyService);
  private storageService = inject(StorageService);

  private cartSubject = new BehaviorSubject<Cart>(new Cart());
  public cart$ = this.cartSubject.asObservable();

  initCartFromStorage(): void {
    const cartId = this.storageService.loadCart();
    if (cartId) {
      this.getCart(cartId);
    }
  }

  getCart(cartId: string): void {
    this.shopifyService
      .getCart(cartId)
      .pipe(take(1))
      .subscribe({
        next: (res) => this.handleResponse(res.data),
        error: (err) => console.error('Get cart error:', err),
      });
  }

  addItem(line: CartLineInput): void {
    const currentCart = this.cartSubject.value;

    if (currentCart.id) {
      this.shopifyService
        .addToCart(currentCart.id, [line])
        .pipe(take(1))
        .subscribe({
          next: (res) => this.handleResponse(res.data?.cartLinesAdd),
          error: (err) => console.error('Add to cart error:', err),
        });
    } else {
      this.shopifyService
        .createCart({ lines: [line] })
        .pipe(take(1))
        .subscribe({
          next: (res) => this.handleResponse(res.data?.cartCreate),
          error: (err) => console.error('Create cart error:', err),
        });
    }
  }

  removeItem(lineId: string): void {
    const cart = this.cartSubject.value;
    if (!cart.id) return;

    this.shopifyService
      .removeCartLines(cart.id, [lineId])
      .pipe(take(1))
      .subscribe({
        next: (res) => this.handleResponse(res.data?.cartLinesRemove),
        error: (err) => console.error('Remove from cart error:', err),
      });
  }

  updateQuantity(lineId: string, quantity: number): void {
    const cart = this.cartSubject.value;
    if (!cart.id) return;

    this.shopifyService
      .updateCartLines(cart.id, [{ id: lineId, quantity }])
      .pipe(take(1))
      .subscribe({
        next: (res) => this.handleResponse(res.data?.cartLinesUpdate),
        error: (err) => console.error('Update cart error:', err),
      });
  }

  private handleResponse(response: any): void {
    if (!response?.cart || response.userErrors?.length > 0) {
      console.error('Cart operation failed:', response?.userErrors);
      return;
    }

    const shopifyCart = response.cart;
    const cart = new Cart();

    cart.id = shopifyCart.id;
    cart.checkoutUrl = shopifyCart.checkoutUrl;
    cart.totalPrice = shopifyCart.cost.totalAmount.amount;
    cart.totalItems = shopifyCart.totalQuantity;
    cart.lines = shopifyCart.lines.edges.map((edge: any) => ({
      id: edge.node.id,
      quantity: edge.node.quantity,
      merchandiseId: edge.node.merchandise.id,
      title: edge.node.merchandise.product.title,
      price: edge.node.cost.totalAmount.amount,
    }));

    this.cartSubject.next(cart);
    this.storageService.saveCart(cart.id!);
  }
}
