import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./features/services/services.component').then(m => m.ServicesComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'who-we-are',
    loadComponent: () =>
      import('./features/who-we-are/who-we-are.component').then(m => m.WhoWeAreComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
