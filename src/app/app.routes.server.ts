import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products',
    renderMode: RenderMode.Server,
  },
  // {
  //   path: 'product/:slug',
  //   renderMode: RenderMode.Server,
  // },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
  // {
  //   path: '**',
  //   renderMode: RenderMode.Prerender
  // }
];
