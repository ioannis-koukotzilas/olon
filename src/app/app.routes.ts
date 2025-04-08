import { Routes } from '@angular/router';
import { ProductListComponent } from './views/product/product-list/product-list.component';
import { ProductDetailComponent } from './views/product/product-detail/product-detail.component';

export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'product/:handle', component: ProductDetailComponent },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
];
