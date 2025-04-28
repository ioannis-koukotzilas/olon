import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, RouteReuseStrategy, withEnabledBlockingInitialNavigation } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import {
  HttpClient,
  HttpHeaders,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideNamedApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppReuseStrategy } from './strategy/app-reuse.strategy';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient
) => new TranslateHttpLoader(http, 'assets/i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    { provide: RouteReuseStrategy, useClass: AppReuseStrategy },
    provideClientHydration(withIncrementalHydration()),
    provideHttpClient(withFetch()),

    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    provideNamedApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        default: {
          link: httpLink.create({
            uri: '/graphql',
          }),
          cache: new InMemoryCache(),
        },
        shopify: {
          link: httpLink.create({
            uri: 'https://secure.monoscopic.net/api/2025-04/graphql.json',
            headers: new HttpHeaders({
              'X-Shopify-Storefront-Access-Token':
                '64a24b0dfdc1535ad2d31d436d10fb4d',
              'Content-Type': 'application/json',
            }),
          }),
          cache: new InMemoryCache(),
        },
      };
    }),
  ],
};
