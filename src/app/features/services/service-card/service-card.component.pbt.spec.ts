import * as fc from 'fast-check';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { ServiceCardComponent } from './service-card.component';
import { Service } from '../../../data/models/service.model';

// Feature: compufy-technology-website, Property 4: Service card renders all required fields

/**
 * Validates: Requirements 7.2
 */
describe('ServiceCardComponent PBT', () => {
  let fixture: ComponentFixture<ServiceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCardComponent],
    }).compileComponents();
  });

  // Task 9.13 — P4: Service card renders all required fields
  // Feature: compufy-technology-website, Property 4: Service card renders all required fields
  describe('P4: service card renders all required fields', () => {
    it('any Service object should render a card containing title, description, and iconName', () => {
      expect(() =>
        fc.assert(
          fc.property(
            fc.record<Service>({
              id: fc.string(),
              title: fc.string({ minLength: 1 }),
              description: fc.string({ minLength: 1 }),
              iconName: fc.string({ minLength: 1 }),
              category: fc.constantFrom('web-development', 'digital-solutions', 'pitc'),
            }),
            (service) => {
              fixture = TestBed.createComponent(ServiceCardComponent);
              fixture.componentRef.setInput('service', service);
              fixture.detectChanges();

              const el: HTMLElement = fixture.nativeElement;
              const text = el.textContent ?? '';

              return (
                text.includes(service.title) &&
                text.includes(service.description) &&
                text.includes(service.iconName)
              );
            }
          ),
          { numRuns: 100 }
        )
      ).not.toThrow();
    });
  });
});
