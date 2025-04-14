import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './views/header/header.component';
import { CartService } from './services/cart.service';
import { FooterComponent } from './views/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private cartService = inject(CartService);

  ngOnInit(): void {
    // this.cartService.initCartFromStorage();
  }
}
