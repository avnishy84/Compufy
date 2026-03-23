import * as fc from 'fast-check';
import { TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ServiceCategoryComponent } from './service-category/service-category.component';
import { Service, ServiceCategory } from '../../data/models/service.model';
import { staggerCards } from '../../shared/animations/animations';

// Feature: compufy-technology-website, Property 3: Service cards are grouped by category

// ---------------------------------------------------------------------------
// Test harness component — mirrors ServicesComponent but with a mutable
// `categories` property so we can inject arbitrary data in tests.
// Uses Default change detection to ensure re-renders on property assignment.
// ---------------------------------------------------------------------------
@Component({
  selector: 'app-services-test-harness',
  standalone: true,
  imports: [ServiceCategoryComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [staggerCards],
  template: `
    <div [@staggerCards]="categories.length">
      @for (category of categories; track category.id) {
        <app-service-category [category]="category" />
      }
    </div>
  `,
})
class ServicesTestHarnessComponent {
  categories: ServiceCategory[] = [];
}

// ---------------------------------------------------------------------------
// Arbitrary definitions
// ---------------------------------------------------------------------------
const serviceArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1 }),
  description: fc.string({ minLength: 1 }),
  iconName: fc.string({ minLength: 1 }),
  category: fc.constantFrom(
    'web-development' as const,
    'digital-solutions' as const,
    'pitc' as const
  ),
});

const categoryMeta: Record<string, string> = {
  'web-development': 'Web Development',
  'digital-solutions': 'Digital Solutions',
  pitc: 'P.I.T.C.',
};

/** Group a flat list of services into ServiceCategory objects, preserving insertion order. */
function groupByCategory(services: Service[]): ServiceCategory[] {
  const map = new Map<string, Service[]>();
  for (const svc of services) {
    if (!map.has(svc.category)) map.set(svc.category, []);
    map.get(svc.category)!.push(svc);
  }
  return Array.from(map.entries()).map(([id, svcs]) => ({
    id,
    label: categoryMeta[id] ?? id,
    services: svcs,
  }));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ServicesComponent PBT', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesTestHarnessComponent],
      providers: [provideAnimations()],
    }).compileComponents();
  });

  // Feature: compufy-technology-website, Property 3: Service cards are grouped by category
  describe('P3: Service cards are grouped by category', () => {
    it('each service should appear under its declared category group', () => {
      expect(() =>
        fc.assert(
          fc.property(
            fc.array(serviceArb, { minLength: 1 }),
            (services) => {
              const fixture = TestBed.createComponent(ServicesTestHarnessComponent);
              const categories = groupByCategory(services);
              fixture.componentInstance.categories = categories;
              fixture.detectChanges();

              const nativeEl: HTMLElement = fixture.nativeElement;
              const categoryGroupEls = nativeEl.querySelectorAll('app-service-category');

              // Verify each category group renders exactly the services assigned to it.
              for (const category of categories) {
                const expectedLabel = category.label;

                // Find the DOM group whose heading matches this category
                const matchingGroup = Array.from(categoryGroupEls).find(group => {
                  const heading = group.querySelector('h2');
                  return heading?.textContent?.trim() === expectedLabel;
                });

                if (!matchingGroup) return false;

                // The number of rendered cards must equal the number of services in this category
                const renderedCards = matchingGroup.querySelectorAll('[data-title]');
                if (renderedCards.length !== category.services.length) return false;

                // Each service in this category must have a card in this group (by position)
                for (let i = 0; i < category.services.length; i++) {
                  const svc = category.services[i];
                  const card = renderedCards[i];
                  if (card.getAttribute('data-title') !== svc.title) return false;
                  if (card.getAttribute('data-description') !== svc.description) return false;
                }
              }

              return true;
            }
          ),
          { numRuns: 100 }
        )
      ).not.toThrow();
    });

    it('no service should appear under a category other than its own', () => {
      expect(() =>
        fc.assert(
          fc.property(
            fc.array(serviceArb, { minLength: 1 }),
            (services) => {
              const fixture = TestBed.createComponent(ServicesTestHarnessComponent);
              const categories = groupByCategory(services);
              fixture.componentInstance.categories = categories;
              fixture.detectChanges();

              const nativeEl: HTMLElement = fixture.nativeElement;
              const categoryGroupEls = nativeEl.querySelectorAll('app-service-category');

              // For each rendered group, verify every card belongs to that group's category
              for (const group of Array.from(categoryGroupEls)) {
                const heading = group.querySelector('h2');
                if (!heading) continue;

                const groupLabel = heading.textContent?.trim() ?? '';
                const matchingCategory = categories.find(c => c.label === groupLabel);
                if (!matchingCategory) continue;

                const cards = group.querySelectorAll('[data-title]');

                // Card count must match
                if (cards.length !== matchingCategory.services.length) return false;

                // Each card (by position) must match the service at the same position
                for (let i = 0; i < matchingCategory.services.length; i++) {
                  const svc = matchingCategory.services[i];
                  const card = cards[i];
                  if (card.getAttribute('data-title') !== svc.title) return false;
                  if (card.getAttribute('data-description') !== svc.description) return false;
                }
              }

              return true;
            }
          ),
          { numRuns: 100 }
        )
      ).not.toThrow();
    });
  });
});
