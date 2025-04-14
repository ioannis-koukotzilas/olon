import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from '../logo/logo.component';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, CartComponent, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  cartActive: boolean = false;

  onCartToggle(): void {
    this.cartActive = !this.cartActive;
  }
}
