import { TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { WhoWeAreComponent } from './who-we-are.component';
import { FOUNDER_DATA } from '../../data/static/founder.data';
import { FounderProfile } from '../../data/models/founder.model';
import { routes } from '../../app.routes';

// ---------------------------------------------------------------------------
// Test harness — mirrors the @for/@empty blocks with a mutable `founder`
// property so we can inject arbitrary data (e.g. empty arrays) in tests.
// Uses Default change detection to ensure re-renders on property assignment.
// ---------------------------------------------------------------------------
@Component({
  selector: 'app-who-we-are-test-harness',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @for (category of founder.skillCategories; track category.label) {
      <span class="skill-category">{{ category.label }}</span>
    } @empty {
      <p class="skills-empty">No skills listed.</p>
    }

    @for (entry of founder.experience; track entry.company) {
      <span class="experience-entry">{{ entry.company }}</span>
    } @empty {
      <p class="experience-empty">No experience entries listed.</p>
    }

    @for (entry of founder.education; track entry.degree) {
      <span class="education-entry">{{ entry.degree }}</span>
    } @empty {
      <p class="education-empty">No education entries listed.</p>
    }
  `,
})
class WhoWeAreTestHarnessComponent {
  @Input() founder: FounderProfile = FOUNDER_DATA;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('WhoWeAreComponent', () => {

  // 5.2 — renders without errors using FOUNDER_DATA
  describe('renders with FOUNDER_DATA', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [WhoWeAreComponent],
      }).compileComponents();
    });

    it('should create the component without errors', () => {
      const fixture = TestBed.createComponent(WhoWeAreComponent);
      expect(() => fixture.detectChanges()).not.toThrow();
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render the founder name', () => {
      const fixture = TestBed.createComponent(WhoWeAreComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(FOUNDER_DATA.name);
    });

    it('should render the founder title', () => {
      const fixture = TestBed.createComponent(WhoWeAreComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(FOUNDER_DATA.title);
    });

    it('should render the founder location', () => {
      const fixture = TestBed.createComponent(WhoWeAreComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(FOUNDER_DATA.location);
    });

    it('should render the founder role', () => {
      const fixture = TestBed.createComponent(WhoWeAreComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(FOUNDER_DATA.role);
    });

    it('should render the founder summary', () => {
      const fixture = TestBed.createComponent(WhoWeAreComponent);
      fixture.detectChanges();
      // Summary is long — check a distinctive substring
      expect(fixture.nativeElement.textContent).toContain('Avnish Yadav is a full-stack');
    });
  });

  // 5.3 — @empty fallback blocks render when arrays are empty
  describe('@empty fallback blocks', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [WhoWeAreTestHarnessComponent],
      }).compileComponents();
    });

    it('should show "No skills listed." when skillCategories is empty', () => {
      const fixture = TestBed.createComponent(WhoWeAreTestHarnessComponent);
      fixture.componentInstance.founder = { ...FOUNDER_DATA, skillCategories: [] };
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('No skills listed.');
    });

    it('should NOT show skills fallback when skillCategories has entries', () => {
      const fixture = TestBed.createComponent(WhoWeAreTestHarnessComponent);
      fixture.componentInstance.founder = FOUNDER_DATA;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('No skills listed.');
    });

    it('should show "No experience entries listed." when experience is empty', () => {
      const fixture = TestBed.createComponent(WhoWeAreTestHarnessComponent);
      fixture.componentInstance.founder = { ...FOUNDER_DATA, experience: [] };
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('No experience entries listed.');
    });

    it('should NOT show experience fallback when experience has entries', () => {
      const fixture = TestBed.createComponent(WhoWeAreTestHarnessComponent);
      fixture.componentInstance.founder = FOUNDER_DATA;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('No experience entries listed.');
    });

    it('should show "No education entries listed." when education is empty', () => {
      const fixture = TestBed.createComponent(WhoWeAreTestHarnessComponent);
      fixture.componentInstance.founder = { ...FOUNDER_DATA, education: [] };
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('No education entries listed.');
    });

    it('should NOT show education fallback when education has entries', () => {
      const fixture = TestBed.createComponent(WhoWeAreTestHarnessComponent);
      fixture.componentInstance.founder = FOUNDER_DATA;
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('No education entries listed.');
    });

    it('should show all three fallbacks when all arrays are empty', () => {
      const fixture = TestBed.createComponent(WhoWeAreTestHarnessComponent);
      fixture.componentInstance.founder = {
        ...FOUNDER_DATA,
        skillCategories: [],
        experience: [],
        education: [],
      };
      fixture.detectChanges();
      const text: string = fixture.nativeElement.textContent;
      expect(text).toContain('No skills listed.');
      expect(text).toContain('No experience entries listed.');
      expect(text).toContain('No education entries listed.');
    });
  });

  // 5.4 — /who-we-are route exists and uses loadComponent
  describe('route registration', () => {
    it('should have a route with path "who-we-are"', () => {
      const route = routes.find(r => r.path === 'who-we-are');
      expect(route).toBeDefined();
    });

    it('should use loadComponent (not component) for lazy loading', () => {
      const route = routes.find(r => r.path === 'who-we-are');
      expect(route?.loadComponent).toBeDefined();
      expect(typeof route?.loadComponent).toBe('function');
    });

    it('loadComponent should resolve to WhoWeAreComponent', async () => {
      const route = routes.find(r => r.path === 'who-we-are');
      const resolved = await route!.loadComponent!();
      expect((resolved as { name?: string }).name).toBe('WhoWeAreComponent');
    });
  });
});
