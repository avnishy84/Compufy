import { routes } from './app.routes';

describe('app.routes', () => {
  it('should have a route for /', () => {
    const homeRoute = routes.find(r => r.path === '');
    expect(homeRoute).toBeDefined();
    expect(homeRoute!.loadComponent).toBeDefined();
  });

  it('should have a route for /services', () => {
    const servicesRoute = routes.find(r => r.path === 'services');
    expect(servicesRoute).toBeDefined();
    expect(servicesRoute!.loadComponent).toBeDefined();
  });

  it('should have a route for /contact', () => {
    const contactRoute = routes.find(r => r.path === 'contact');
    expect(contactRoute).toBeDefined();
    expect(contactRoute!.loadComponent).toBeDefined();
  });

  it('wildcard route should redirect to /', () => {
    const wildcardRoute = routes.find(r => r.path === '**');
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute!.redirectTo).toBe('');
  });

  it('all feature routes should use loadComponent (lazy loading)', () => {
    const featureRoutes = routes.filter(r => r.path !== '**');
    featureRoutes.forEach(route => {
      expect(route.loadComponent).toBeDefined();
    });
  });
});
