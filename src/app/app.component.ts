import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  loading = false;

  constructor(
    private loadingService: LoadingService,
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) {
    this.setLanguage();
  }

  ngOnInit(): void {
    this.subscribeToLoadingState();
  }

  private setLanguage(): void {
    this.translate.addLangs(['en', 'el']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
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
