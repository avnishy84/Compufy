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
    path: 'services/:id',
    loadComponent: () =>
      import('./features/services/service-details/service-details.component').then(m => m.ServiceDetailsComponent),
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
    path: 'careers',
    loadComponent: () =>
      import('./features/careers/careers.component').then(m => m.CareersComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./features/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
  },
  {
    path: 'terms-of-service',
    loadComponent: () =>
      import('./features/terms-of-service/terms-of-service.component').then(m => m.TermsOfServiceComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
