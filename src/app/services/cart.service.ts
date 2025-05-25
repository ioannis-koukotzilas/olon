import { inject, Injectable } from '@angular/core';
import { ShopifyService } from './shopify.service';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  take,
  tap,
  throwError,
} from 'rxjs';
import { Cart, CartLine } from '../models/cart/cart';
import { CartLineInput } from '../models/cart/cartLineInput';
import { StorageService } from './storage.service';
import { ProductImage } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private shopifyService = inject(ShopifyService);
  private storageService = inject(StorageService);

  private cartSubject = new BehaviorSubject<Cart>(new Cart());
  public cart$ = this.cartSubject.asObservable();

  initCartFromLocalStorage(): void {
    const cartId = this.storageService.getCartFromLocalStorage();

    if (cartId) {
      this.getCart(cartId);
    }
  }

  getCart(cartId: string): void {
    this.shopifyService
      .cartGet(cartId)
      .pipe(take(1))
      .subscribe({
        next: (res) => this.handleResponse(res.data),
        error: (err) => console.error('Get cart error:', err),
      });
  }

  addItem(line: CartLineInput): Observable<void> {
    const currentCart = this.cartSubject.value;

    const operation$ = currentCart.id
      ? this.shopifyService.cartLinesAdd(currentCart.id, [line])
      : this.shopifyService.createCart({ lines: [line] });

    return operation$.pipe(
      take(1),
      tap((res) => {
        const responseData = currentCart.id
          ? res.data?.cartLinesAdd
          : res.data?.cartCreate;
        this.handleResponse(responseData);
      }),
      // Convert to void observable to prevent exposing internal response
      map(() => undefined),
      catchError((error) => {
        console.error('Cart operation failed:', error);
        return throwError(() => error);
      })
    );
  }

  removeItem(lineId: string): void {
    const cart = this.cartSubject.value;
    if (!cart.id) return;

    this.shopifyService
      .cartLinesRemove(cart.id, [lineId])
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
      .cartLinesUpdate(cart.id, [{ id: lineId, quantity }])
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
    const cartLines: CartLine[] = [];

    const initProductImage = (image: any): ProductImage => {
      return {
          src: image.src,
          altText: image.altText
        };
    };

    shopifyCart.lines.nodes.forEach((node: any) => {
      cartLines.push({
        id: node.id,
        quantity: node.quantity,
        merchandiseId: node.merchandise.id,
        title: node.merchandise.product.title,
        price: node.cost.totalAmount.amount,
        featuredImage: initProductImage(node.merchandise.product.featuredImage),
        handle: node.merchandise.product.handle
      });
    });

    const cart: Cart = {
      id: shopifyCart.id,
      checkoutUrl: shopifyCart.checkoutUrl,
      totalPrice: shopifyCart.cost.totalAmount.amount,
      totalItems: shopifyCart.totalQuantity,
      lines: cartLines,
    };

    this.cartSubject.next(cart);
    this.storageService.setCartToLocalStorage(cart.id!);
  }
}
