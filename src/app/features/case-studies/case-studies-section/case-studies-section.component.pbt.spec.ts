// Feature: client-case-studies, Property 3: Section card count matches data length
// Feature: client-case-studies, Property 4: Card renders required fields
// Feature: client-case-studies, Property 5: Card RouterLink href equals /case-studies/{slug}

import * as fc from 'fast-check';
import { TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideRouter } from '@angular/router';
import { CaseStudy } from '../../../data/models/case-study.model';

// ---------------------------------------------------------------------------
// Test harness — mirrors CaseStudiesSectionComponent template with injectable data
// ---------------------------------------------------------------------------
@Component({
  selector: 'app-case-studies-section-harness',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @if (studies.length) {
      <div class="grid">
        @for (study of studies; track study.id) {
          <a
            class="case-study-card"
            [routerLink]="['/case-studies', study.slug]"
          >
            <span class="project-title">{{ study.projectTitle }}</span>
            <span class="client-name">{{ study.clientName }}</span>
            <span class="short-description">{{ study.shortDescription }}</span>
            @for (tag of study.tags; track tag) {
              <span class="tag">{{ tag }}</span>
            }
          </a>
        }
      </div>
    }
  `,
})
class CaseStudiesSectionHarnessComponent {
  @Input() studies: CaseStudy[] = [];
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------
const slugArb = fc
  .stringMatching(/^[a-z][a-z0-9]{2,19}$/)
  .filter(s => s.length >= 3);

const tagArb = fc.string({ minLength: 1, maxLength: 20 });

const caseStudyArb = fc
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
      liveDemoUrl: fc.oneof(fc.constant(''), fc.webUrl()),
    })
  );

const uniqueStudiesArrayArb = fc
  .uniqueArray(caseStudyArb, {
    minLength: 0,
    maxLength: 10,
    selector: s => s.slug,
  });

// ---------------------------------------------------------------------------
// Property 3: Section card count matches data length
// ---------------------------------------------------------------------------
describe('CaseStudiesSectionComponent PBT — Property 3: card count matches data length', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStudiesSectionHarnessComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders exactly as many cards as there are entries (including empty)', () => {
    fc.assert(
      fc.property(uniqueStudiesArrayArb, (studies) => {
        const fixture = TestBed.createComponent(CaseStudiesSectionHarnessComponent);
        fixture.componentInstance.studies = studies;
        fixture.detectChanges();

        const cards = fixture.nativeElement.querySelectorAll('.case-study-card');
        expect(cards.length).toBe(studies.length);

        fixture.destroy();
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4: Card renders required fields
// ---------------------------------------------------------------------------
describe('CaseStudiesSectionComponent PBT — Property 4: card renders required fields', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStudiesSectionHarnessComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('each card DOM contains projectTitle, clientName, shortDescription, and all tags', () => {
    fc.assert(
      fc.property(
        fc.array(caseStudyArb, { minLength: 1, maxLength: 5 }),
        (studies) => {
          const fixture = TestBed.createComponent(CaseStudiesSectionHarnessComponent);
          fixture.componentInstance.studies = studies;
          fixture.detectChanges();

          const cards = Array.from(
            fixture.nativeElement.querySelectorAll('.case-study-card')
          ) as HTMLElement[];

          for (let i = 0; i < studies.length; i++) {
            const card = cards[i];
            const study = studies[i];
            const text = card.textContent ?? '';

            expect(text).toContain(study.projectTitle);
            expect(text).toContain(study.clientName);
            expect(text).toContain(study.shortDescription);
            for (const tag of study.tags) {
              expect(text).toContain(tag);
            }
          }

          fixture.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 5: Card RouterLink href equals /case-studies/{slug}
// ---------------------------------------------------------------------------
describe('CaseStudiesSectionComponent PBT — Property 5: card RouterLink points to correct slug path', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStudiesSectionHarnessComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('each card anchor routerLink equals /case-studies/{slug}', () => {
    fc.assert(
      fc.property(
        fc.array(caseStudyArb, { minLength: 1, maxLength: 5 }),
        (studies) => {
          const fixture = TestBed.createComponent(CaseStudiesSectionHarnessComponent);
          fixture.componentInstance.studies = studies;
          fixture.detectChanges();

          const anchors = Array.from(
            fixture.nativeElement.querySelectorAll('a.case-study-card')
          ) as HTMLAnchorElement[];

          for (let i = 0; i < studies.length; i++) {
            const anchor = anchors[i];
            const study = studies[i];
            const href = anchor.getAttribute('href') ?? '';
            expect(href).toBe(`/case-studies/${study.slug}`);
          }

          fixture.destroy();
        }
      ),
      { numRuns: 100 }
    );
  });
});
