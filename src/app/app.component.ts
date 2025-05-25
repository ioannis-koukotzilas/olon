import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './views/header/header.component';
import { FooterComponent } from './views/footer/footer.component';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LoadingService } from './services/loading.service';
import { LoaderComponent } from './views/loader/loader.component';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { PlatformService } from './services/platform.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  loading = false;

  private platformService = inject(PlatformService);
  private translateService = inject(TranslateService);
  private cartService = inject(CartService);
  private loadingService = inject(LoadingService);

  constructor(private cd: ChangeDetectorRef) {
    this.setLanguage();
  }

  ngOnInit(): void {
    this.subscribeToLoadingState();

    if (this.platformService.isBrowser) {
      this.cartService.initCartFromLocalStorage();
    }
  }

  private setLanguage(): void {
    this.translateService.addLangs(['en', 'el']);
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  subscribeToLoadingState(): void {
    const loadingSub = this.loadingService.loading$.subscribe(
      (loading: boolean) => {
        this.loading = loading;
        this.cd.detectChanges();
      }
    );

    this.subscription.add(loadingSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
