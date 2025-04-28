import { RenderMode, ServerRoute } from '@angular/ssr';

// export const serverRoutes: ServerRoute[] = [
//   {
//     path: 'products',
//     renderMode: RenderMode.Server,
//   },
//   {
//     path: 'product/:slug',
//     renderMode: RenderMode.Prerender,
//   },
//   {
//     path: '**',
//     renderMode: RenderMode.Prerender
//   }
//   // {
//   //   path: '**',
//   //   renderMode: RenderMode.Prerender
//   // }
// ];


export const serverRoutes: ServerRoute[] = [
  // 1) Root path (“/” → redirects to “/en” via your client redirect)
  { path: '',              renderMode: RenderMode.Server    },

  // 2) Language prefix itself (/:lang) → PageHomeComponent
  { path: ':lang',         renderMode: RenderMode.Server    },

  // 3) Localized children
  { path: ':lang/products',        renderMode: RenderMode.Server    },
  { path: ':lang/product/:handle', renderMode: RenderMode.Prerender },

  // 4) Any other route under /:lang (your '**' child → redirectTo home)
  { path: ':lang/**',       renderMode: RenderMode.Prerender },

  // 5) Global catch-all at root (root '**' → redirectTo '/en')
  { path: '**',             renderMode: RenderMode.Prerender }
];