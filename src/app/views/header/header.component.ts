import { Component, inject, OnInit } from '@angular/core';
import { Cart } from '../../models/cart/cart';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private cartService = inject(CartService);

  cart$ = this.cartService.cart$;

  constructor() {}

  ngOnInit(): void {}

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
