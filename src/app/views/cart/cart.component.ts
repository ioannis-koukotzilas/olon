import { Component, ElementRef, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart/cart';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private cartService = inject(CartService);

  cartVisible = false;
  cartContent$ = this.cartService.cart$;
  
  @Input() currentLang!: string;

  onOverlayClick(): void {
    this.cartVisible = false;
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
