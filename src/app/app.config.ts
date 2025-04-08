import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { provideNamedApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),

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
