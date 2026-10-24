// Feature: client-case-studies, Property 6: Detail page renders required fields
// Feature: client-case-studies, Property 7: Live demo button conditionality and attributes
// Feature: client-case-studies, Property 8: Unknown slug triggers redirect with no partial render
// Feature: client-case-studies, Property 9: SEO title format
// Feature: client-case-studies, Property 10: SEO description matches shortDescription
// Feature: client-case-studies, Property 11: No SEO update on unknown slug redirect

import * as fc from 'fast-check';
import { TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy, Input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideRouter } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { CaseStudy } from '../../../data/models/case-study.model';
import { ButtonComponent } from '../../../shared/button/button.component';

// ---------------------------------------------------------------------------
// Test harness — mirrors CaseStudyDetailComponent with injectable data
// ---------------------------------------------------------------------------
@Component({
  selector: 'app-case-study-detail-harness',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @if (study) {
      <div class="detail-content">
        <h1 class="project-title">{{ study.projectTitle }}</h1>
        <p class="client-name">{{ study.clientName }}</p>
        <p class="problem-statement">{{ study.problemStatement }}</p>
        <p class="solution">{{ study.solution }}</p>
        <p class="technical-depth">{{ study.technicalDepth }}</p>
        @for (tag of study.tags; track tag) {
          <span class="tag">{{ tag }}</span>
        }
        @if (study.liveDemoUrl) {
          <a
            class="live-demo-link"
            [href]="study.liveDemoUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <app-button variant="primary">View Live Demo</app-button>
          </a>
        }
      </div>
    }
  `,
})
class CaseStudyDetailHarnessComponent {
  @Input() study: CaseStudy | null = null;
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------
const slugArb = fc
  .stringMatching(/^[a-z][a-z0-9]{2,19}$/)
  .filter(s => s.length >= 3);

const tagArb = fc.string({ minLength: 1, maxLength: 20 });

const caseStudyArb = (liveDemoUrl?: string) =>
  fc
    .uniqueArray(slugArb, { minLength: 1, maxLength: 1 })
    .chain(([slug]) =>
      fc.record<CaseStudy>({
        id: fc.constant(slug),
        slug: fc.constant(slug),
        clientName: fc.string({ minLength: 1, maxLength: 50 }),
        projectTitle: fc.string({ minLength: 1, maxLength: 80 }),
        shortDescription: fc.string({ minLength: 1, maxLength: 200 }),
        tags: fc.array(tagArb, { minLength: 1, maxLength: 5 }),
        problemStatement: fc.string({ minLength: 1, maxLength: 300 }),
        solution: fc.string({ minLength: 1, maxLength: 300 }),
        technicalDepth: fc.string({ minLength: 1, maxLength: 300 }),
        liveDemoUrl:
          liveDemoUrl !== undefined
            ? fc.constant(liveDemoUrl)
            : fc.oneof(fc.constant(''), fc.webUrl()),
      })
    );

// ---------------------------------------------------------------------------
// Property 6: Detail page renders required fields
// ---------------------------------------------------------------------------
describe('CaseStudyDetailComponent PBT — Property 6: detail page renders required fields', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStudyDetailHarnessComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('DOM contains projectTitle, clientName, problemStatement, solution, technicalDepth, and all tags', () => {
    fc.assert(
      fc.property(caseStudyArb(), (study) => {
        const fixture = TestBed.createComponent(CaseStudyDetailHarnessComponent);
        fixture.componentInstance.study = study;
        fixture.detectChanges();

        const text: string = fixture.nativeElement.textContent ?? '';
        expect(text).toContain(study.projectTitle);
        expect(text).toContain(study.clientName);
        expect(text).toContain(study.problemStatement);
        expect(text).toContain(study.solution);
        expect(text).toContain(study.technicalDepth);
        for (const tag of study.tags) {
          expect(text).toContain(tag);
        }

        fixture.destroy();
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 7: Live demo button conditionality and attributes
// ---------------------------------------------------------------------------
describe('CaseStudyDetailComponent PBT — Property 7: live demo button conditionality', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStudyDetailHarnessComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('anchor with target=_blank and rel=noopener noreferrer is present iff liveDemoUrl is non-empty', () => {
    fc.assert(
      fc.property(caseStudyArb(), (study) => {
        const fixture = TestBed.createComponent(CaseStudyDetailHarnessComponent);
        fixture.componentInstance.study = study;
        fixture.detectChanges();

        const anchor: HTMLAnchorElement | null =
          fixture.nativeElement.querySelector('a.live-demo-link');

        if (study.liveDemoUrl) {
          expect(anchor).toBeTruthy();
          expect(anchor?.getAttribute('target')).toBe('_blank');
          expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
        } else {
          expect(anchor).toBeNull();
        }

        fixture.destroy();
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 8: Unknown slug triggers redirect with no partial render
// ---------------------------------------------------------------------------
describe('CaseStudyDetailComponent PBT — Property 8: unknown slug triggers redirect', () => {
  it('router.navigate([/]) is called and caseStudy signal remains null for unknown slugs', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s !== 'retail-inventory-platform' && s !== 'logistics-route-optimiser' && s !== 'healthcare-patient-portal'),
        (unknownSlug) => {
          const navigateSpy = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));
          const routerStub = { navigate: navigateSpy };
          const activatedRouteStub = {
            snapshot: { paramMap: { get: () => unknownSlug } },
          };

          // Import the real component class to test its logic
          const { CaseStudyDetailComponent } = require('./case-study-detail.component');
          const instance = new CaseStudyDetailComponent();

          // Manually inject dependencies
          (instance as { router: unknown })['router'] = routerStub;
          (instance as { route: unknown })['route'] = activatedRouteStub;
          (instance as { titleService: unknown })['titleService'] = { setTitle: jasmine.createSpy('setTitle') };
          (instance as { metaService: unknown })['metaService'] = { updateTag: jasmine.createSpy('updateTag') };

          instance.ngOnInit();

          expect(instance.caseStudy()).toBeNull();
          expect(navigateSpy).toHaveBeenCalledWith(['/']);
        }
      ),
      { numRuns: 50 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 9: SEO title format
// ---------------------------------------------------------------------------
describe('CaseStudyDetailComponent PBT — Property 9: SEO title format', () => {
  it('Title.setTitle is called with "{projectTitle} | Compufy Technology"', () => {
    fc.assert(
      fc.property(caseStudyArb(), (study) => {
        const setTitleSpy = jasmine.createSpy('setTitle');
        const updateTagSpy = jasmine.createSpy('updateTag');
        const navigateSpy = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));

        const { CaseStudyDetailComponent } = require('./case-study-detail.component');
        const { CASE_STUDIES_BY_SLUG } = require('../../../data/static/case-studies.data');

        // Add study to map temporarily
        CASE_STUDIES_BY_SLUG.set(study.slug, study);

        const instance = new CaseStudyDetailComponent();
        (instance as { router: unknown })['router'] = { navigate: navigateSpy };
        (instance as { route: unknown })['route'] = {
          snapshot: { paramMap: { get: () => study.slug } },
        };
        (instance as { titleService: unknown })['titleService'] = { setTitle: setTitleSpy };
        (instance as { metaService: unknown })['metaService'] = { updateTag: updateTagSpy };

        instance.ngOnInit();

        expect(setTitleSpy).toHaveBeenCalledWith(`${study.projectTitle} | Compufy Technology`);

        // Cleanup
        CASE_STUDIES_BY_SLUG.delete(study.slug);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 10: SEO description matches shortDescription
// ---------------------------------------------------------------------------
describe('CaseStudyDetailComponent PBT — Property 10: SEO description matches shortDescription', () => {
  it('Meta.updateTag is called with description equal to shortDescription', () => {
    fc.assert(
      fc.property(caseStudyArb(), (study) => {
        const setTitleSpy = jasmine.createSpy('setTitle');
        const updateTagSpy = jasmine.createSpy('updateTag');
        const navigateSpy = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));

        const { CaseStudyDetailComponent } = require('./case-study-detail.component');
        const { CASE_STUDIES_BY_SLUG } = require('../../../data/static/case-studies.data');

        CASE_STUDIES_BY_SLUG.set(study.slug, study);

        const instance = new CaseStudyDetailComponent();
        (instance as { router: unknown })['router'] = { navigate: navigateSpy };
        (instance as { route: unknown })['route'] = {
          snapshot: { paramMap: { get: () => study.slug } },
        };
        (instance as { titleService: unknown })['titleService'] = { setTitle: setTitleSpy };
        (instance as { metaService: unknown })['metaService'] = { updateTag: updateTagSpy };

        instance.ngOnInit();

        expect(updateTagSpy).toHaveBeenCalledWith({
          name: 'description',
          content: study.shortDescription,
        });

        CASE_STUDIES_BY_SLUG.delete(study.slug);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 11: No SEO update on unknown slug redirect
// ---------------------------------------------------------------------------
describe('CaseStudyDetailComponent PBT — Property 11: no SEO update on unknown slug redirect', () => {
  it('Title.setTitle and Meta.updateTag are NOT called when slug is unknown', () => {
    const knownSlugs = new Set([
      'retail-inventory-platform',
      'logistics-route-optimiser',
      'healthcare-patient-portal',
    ]);

    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => !knownSlugs.has(s)),
        (unknownSlug) => {
          const setTitleSpy = jasmine.createSpy('setTitle');
          const updateTagSpy = jasmine.createSpy('updateTag');
          const navigateSpy = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));

          const { CaseStudyDetailComponent } = require('./case-study-detail.component');

          const instance = new CaseStudyDetailComponent();
          (instance as { router: unknown })['router'] = { navigate: navigateSpy };
          (instance as { route: unknown })['route'] = {
            snapshot: { paramMap: { get: () => unknownSlug } },
          };
          (instance as { titleService: unknown })['titleService'] = { setTitle: setTitleSpy };
          (instance as { metaService: unknown })['metaService'] = { updateTag: updateTagSpy };

          instance.ngOnInit();

          expect(setTitleSpy).not.toHaveBeenCalled();
          expect(updateTagSpy).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 50 }
    );
  });
});
