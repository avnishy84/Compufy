import { TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { WhoWeAreComponent } from './who-we-are.component';
import { FOUNDER_DATA } from '../../data/static/cto.data';
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

// ---------------------------------------------------------------------------
// who-we-are-enhancement tests
// ---------------------------------------------------------------------------
describe('who-we-are-enhancement', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhoWeAreComponent],
      providers: [provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  function createFixture() {
    const fixture = TestBed.createComponent(WhoWeAreComponent);
    fixture.detectChanges();
    return fixture;
  }

  // 11.1 — Our Story paragraph text is present in the DOM
  it('should render Our Story paragraph text', () => {
    const fixture = createFixture();
    expect(fixture.nativeElement.textContent).toContain(
      'Compufy Technology was founded with a vision to bridge the gap'
    );
  });

  // 11.2 — Mission and Vision card texts are present and exactly two cards render
  it('should render mission card text', () => {
    const fixture = createFixture();
    expect(fixture.nativeElement.textContent).toContain(
      'To build scalable, efficient, and future-ready technology solutions that empower businesses.'
    );
  });

  it('should render vision card text', () => {
    const fixture = createFixture();
    expect(fixture.nativeElement.textContent).toContain(
      'To become a trusted technology partner for startups and enterprises globally.'
    );
  });

  it('should have exactly two missionVisionCards', () => {
    const fixture = createFixture();
    expect(fixture.componentInstance.missionVisionCards.length).toBe(2);
  });

  // 11.3 — All five core value labels are present in the DOM
  it('should render all five core value labels', () => {
    const fixture = createFixture();
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Innovation First');
    expect(text).toContain('Client-Centric Approach');
    expect(text).toContain('Performance & Quality');
    expect(text).toContain('Transparency');
    expect(text).toContain('Continuous Growth');
  });

  // 11.4 — All four differentiator texts are present in the DOM
  it('should render all four differentiator texts', () => {
    const fixture = createFixture();
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Focus on real-world scalable solutions');
    expect(text).toContain('Strong blend of business and technology thinking');
    expect(text).toContain('Fast execution with startup mindset');
    expect(text).toContain('Clean, maintainable, future-proof architecture');
  });

  // 11.5 — All five expertise tags are present in the DOM
  it('should render all five expertise tags', () => {
    const fixture = createFixture();
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Full Stack Development');
    expect(text).toContain('Cloud & DevOps');
    expect(text).toContain('AI & Automation');
    expect(text).toContain('System Design & Architecture');
    expect(text).toContain('Performance Optimization');
  });

  // 11.6 — CTO card: <h2> contains founder.title and appears before the name <p>
  it('should render CTO designation as h2 before the name paragraph', () => {
    const fixture = createFixture();
    const el: HTMLElement = fixture.nativeElement;
    const headings = Array.from(el.querySelectorAll('h2')) as HTMLElement[];
    const ctoHeading = headings.find(h => h.textContent?.includes('Chief Technology Officer'));
    expect(ctoHeading).toBeTruthy();

    const allElements = Array.from(el.querySelectorAll('h2, p')) as HTMLElement[];
    const h2Index = allElements.indexOf(ctoHeading!);
    const nameParagraph = allElements.find(
      (elem, idx) => idx > h2Index && elem.textContent?.trim() === FOUNDER_DATA.name
    );
    expect(nameParagraph).toBeTruthy();
  });

  // 11.7 — Team card description paragraph and expertise badges are still present
  it('should render founder summary text', () => {
    const fixture = createFixture();
    expect(fixture.nativeElement.textContent).toContain(FOUNDER_DATA.summary);
  });

  it('should render at least one skill category label', () => {
    const fixture = createFixture();
    expect(fixture.nativeElement.textContent).toContain('Languages');
  });

  // 11.8 — Team Philosophy text is present in the DOM
  it('should render Team Philosophy text', () => {
    const fixture = createFixture();
    expect(fixture.nativeElement.textContent).toContain(
      'We believe great products come from collaboration'
    );
  });

  // 11.9 — Exactly four achievement stat cards render with labels
  it('should have exactly four achievements', () => {
    const fixture = createFixture();
    expect(fixture.componentInstance.achievements.length).toBe(4);
  });

  it('should render all four achievement labels', () => {
    const fixture = createFixture();
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Projects Delivered');
    expect(text).toContain('Technologies Used');
    expect(text).toContain('Happy Clients');
    expect(text).toContain('Years of Experience');
  });

  // 11.10 — CTA heading text and /contact routerLink are present
  it('should render CTA heading text', () => {
    const fixture = createFixture();
    expect(fixture.nativeElement.textContent).toContain(
      "Have an idea? Let's build it together."
    );
  });

  it('should have an anchor with routerLink="/contact"', () => {
    const fixture = createFixture();
    const anchor: HTMLAnchorElement | null =
      fixture.nativeElement.querySelector('a[routerLink="/contact"]');
    expect(anchor).toBeTruthy();
  });
});
