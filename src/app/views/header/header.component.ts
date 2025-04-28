import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { CartComponent } from '../cart/cart.component';
import { Mode } from '../../enums/mode';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart/cart';
import { Subscription } from 'rxjs';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { Router, RouterLink } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CommonModule,
    CartComponent,
    LogoComponent,
    LanguageSelectorComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private subscription = new Subscription();

  currentLang!: string;
  cart: Cart | null = null;

  mode = Mode;

  cartActive: boolean = false;
  mainNavigationPanelActive: boolean = false;

  constructor(
    private translate: TranslateService,
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getLang();
    this.getCart();
  }

  getLang(): void {
    this.currentLang = this.translate.currentLang;

    const langSub = this.translate.onLangChange.subscribe(
      (e: LangChangeEvent) => {
        this.currentLang = e.lang.toLowerCase();
      }
    );

    this.subscription.add(langSub);
  }

  getCart(): void {
    const cartSub = this.cartService.cart$.subscribe((cart: Cart) => {
      this.cart = cart;
    });

    this.subscription.add(cartSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onCartToggle(): void {
    this.cartActive = !this.cartActive;
  }

  onMainNavigationPanelToggle(): void {
    this.mainNavigationPanelActive = !this.mainNavigationPanelActive;
  }

  navigateAfterCloseSidebar(route: any[]): void {
    this.onMainNavigationPanelToggle();
    this.router.navigate(route);
  }
}
