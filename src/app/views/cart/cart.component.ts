import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart/cart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  @ViewChild('cartRef') cartRef!: ElementRef;

  private document = inject(DOCUMENT);
  private cartService = inject(CartService);

  private _cartActive = false;

  cartContent$ = this.cartService.cart$;

  @Input()
  get cartActive(): boolean {
    return this._cartActive;
  }
  set cartActive(value: boolean) {
    this._cartActive = value;
    this.updateDocumentBody(value);
  }

  updateDocumentBody(value: boolean): void {
    if (value) {
      this.document.body.style.paddingTop =
        this.cartRef.nativeElement.scrollHeight + 'px';
    } else {
      this.document.body.style.paddingTop = '0';
    }

    this.document.body.style.transition = 'padding-top 0.4s ease-in-out';
  }

  updateQuantity(lineId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(lineId);
      return;
    }
    this.cartService.updateQuantity(lineId, quantity);
  }

  removeItem(lineId: string): void {
    this.cartService.removeItem(lineId);
  }

  checkout(cart: Cart): void {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  }
}
