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
    path: 'ai-approach',
    loadComponent: () =>
      import('./features/ai-approach/ai-approach.component').then(m => m.AiApproachComponent),
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
    path: 'case-studies/:slug',
    loadComponent: () =>
      import('./features/case-studies/case-study-detail/case-study-detail.component').then(
        m => m.CaseStudyDetailComponent
      ),
  },
  {
    path: 'clients/:slug',
    loadComponent: () =>
      import('./features/clients/client-project-detail/client-project-detail.component').then(m => m.ClientProjectDetailComponent),
  },
  {
    path: 'demo-unavailable',
    loadComponent: () =>
      import('./features/demo-unavailable/demo-unavailable.component').then(m => m.DemoUnavailableComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
