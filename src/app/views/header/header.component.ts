import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { CartComponent } from '../cart/cart.component';
import { Mode } from '../../enums/mode';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart/cart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, CartComponent, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private sub = new Subscription();

  private cartService = inject(CartService);

  cart: Cart | null = null;
  
  mode = Mode;
  
  cartActive: boolean = false;
  mainNavigationPanelActive: boolean = false;

  ngOnInit() {
    this.sub = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onCartToggle(): void {
    this.cartActive = !this.cartActive;
  }

  onMainNavigationPanelToggle(): void {
    this.mainNavigationPanelActive = !this.mainNavigationPanelActive;
  }
}
