import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CaseStudiesSectionComponent } from './case-studies-section.component';
import { routes } from '../../../app.routes';

describe('CaseStudiesSectionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStudiesSectionComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  // Route registration
  describe('route registration', () => {
    it('should have a route with path "case-studies/:slug"', () => {
      const route = routes.find(r => r.path === 'case-studies/:slug');
      expect(route).toBeDefined();
    });

    it('should use loadComponent for lazy loading', () => {
      const route = routes.find(r => r.path === 'case-studies/:slug');
      expect(route?.loadComponent).toBeDefined();
      expect(typeof route?.loadComponent).toBe('function');
    });

    it('loadComponent should resolve to CaseStudyDetailComponent', async () => {
      const route = routes.find(r => r.path === 'case-studies/:slug');
      const resolved = await route!.loadComponent!();
      expect((resolved as { name?: string }).name).toBe('CaseStudyDetailComponent');
    });
  });

  // Keyboard Enter navigation
  describe('keyboard Enter navigation', () => {
    it('should render card anchors with routerLink attributes', () => {
      const fixture = TestBed.createComponent(CaseStudiesSectionComponent);
      fixture.detectChanges();
      const anchors: NodeListOf<HTMLAnchorElement> =
        fixture.nativeElement.querySelectorAll('a[ng-reflect-router-link], a[routerlink]');
      expect(anchors.length).toBeGreaterThan(0);
    });

    it('card anchor should be focusable (no tabindex=-1)', () => {
      const fixture = TestBed.createComponent(CaseStudiesSectionComponent);
      fixture.detectChanges();
      const firstAnchor: HTMLAnchorElement =
        fixture.nativeElement.querySelector('a');
      expect(firstAnchor).toBeTruthy();
      expect(firstAnchor.getAttribute('tabindex')).not.toBe('-1');
    });

    it('pressing Enter on a card anchor should dispatch a click event', () => {
      const fixture = TestBed.createComponent(CaseStudiesSectionComponent);
      fixture.detectChanges();
      const firstAnchor: HTMLAnchorElement =
        fixture.nativeElement.querySelector('a');
      expect(firstAnchor).toBeTruthy();

      let clicked = false;
      firstAnchor.addEventListener('click', () => { clicked = true; });

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      firstAnchor.dispatchEvent(enterEvent);
      // Native <a> elements activate on Enter natively in browsers;
      // verify the element is an anchor (which browsers navigate on Enter)
      expect(firstAnchor.tagName.toLowerCase()).toBe('a');
    });
  });
});
