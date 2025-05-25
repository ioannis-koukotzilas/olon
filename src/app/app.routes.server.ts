import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: ':lang', renderMode: RenderMode.Server },
  { path: ':lang/products', renderMode: RenderMode.Server },
  { path: ':lang/product/:handle', renderMode: RenderMode.Server },
  { path: ':lang/**', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
