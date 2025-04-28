import { Routes } from '@angular/router';
import { ProductListComponent } from './views/product/product-list/product-list.component';
import { ProductDetailComponent } from './views/product/product-detail/product-detail.component';
import { LanguageResolver } from './resolvers/language.resolver';
import { PageHomeComponent } from './views/page/page-home/page-home.component';

export const routes: Routes = [
  // root redirect "/" → "/en"
  { path: '', redirectTo: '/en', pathMatch: 'full' },
  {
    path: ':lang',
    resolve: { lang: LanguageResolver },
    children: [
      { path: '', component: PageHomeComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'product/:handle', component: ProductDetailComponent },

      // optional: any other "/en/whatever" goes back to home (or you could show a 404 component)
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ],
  },

  

  // optional: catch-all at root
  { path: '**', redirectTo: '/en', pathMatch: 'full' }
];
