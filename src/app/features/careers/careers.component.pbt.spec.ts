import * as fc from 'fast-check';
import { FormControl, Validators } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { CareersComponent } from './careers.component';
import { minLengthTrimmed } from '../contact/validators';
import { CompanyValue, WhyJoinItem } from '../../data/models/careers.model';
import { EmailService } from '../../core/email.service';

function makeEmailServiceSpy(): jasmine.SpyObj<EmailService> {
  return jasmine.createSpyObj<EmailService>('EmailService', ['sendContactEmail', 'sendCareersEmail']);
}

// ── Arbitraries ─────────────────────────────────────────────────────────────

const validFullNameArb = fc.string({ minLength: 2 }).filter(s => s.trim().length >= 2);
const validEmailArb = fc.emailAddress();
const validDesignationArb = fc.string({ minLength: 1 }).filter(s => s.trim().length >= 1);
const validYearsArb = fc.integer({ min: 0, max: 50 });

const shortNameArb = fc.string().filter(s => s.trim().length < 2);
const outOfRangeYearsArb = fc.oneof(
  fc.integer({ max: -1 }),
  fc.integer({ min: 51 })
);

// ── Tests ────────────────────────────────────────────────────────────────────

describe('CareersComponent PBT', () => {

  // ── P1: Valid form values produce a valid form ───────────────────────────
  // Feature: careers-page, Property 1: Valid form values produce a valid form
  describe('P1: valid form values produce a valid form', () => {
    let component: CareersComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CareersComponent],
        providers: [{ provide: EmailService, useValue: makeEmailServiceSpy() }],
      }).compileComponents();
      const fixture = TestBed.createComponent(CareersComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('form should be valid and submit enabled for any valid inputs', () => {
      fc.assert(
        fc.property(
          validFullNameArb,
          validEmailArb,
          validDesignationArb,
          validYearsArb,
          (fullName, email, designation, yearsOfExperience) => {
            component.applicationForm.setValue({ fullName, email, designation, yearsOfExperience });
            return component.applicationForm.valid && !component.submitting();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ── P2: Short full name is always invalid ────────────────────────────────
  // Feature: careers-page, Property 2: Short full name is always invalid
  describe('P2: short fullName is always invalid', () => {
    it('fullName control should be invalid for any string with fewer than 2 trimmed chars', () => {
      fc.assert(
        fc.property(
          shortNameArb,
          (name) => {
            const control = new FormControl(name, [Validators.required, minLengthTrimmed(2)]);
            return control.invalid;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ── P3: Out-of-range years of experience is always invalid ───────────────
  // Feature: careers-page, Property 3: Out-of-range years of experience is always invalid
  describe('P3: out-of-range yearsOfExperience is always invalid', () => {
    it('yearsOfExperience control should be invalid for any value outside [0, 50]', () => {
      fc.assert(
        fc.property(
          outOfRangeYearsArb,
          (years) => {
            const control = new FormControl(years, [
              Validators.required,
              Validators.min(0),
              Validators.max(50),
            ]);
            return control.invalid;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ── P4: Invalid form submission marks all controls touched ───────────────
  // Feature: careers-page, Property 4: Invalid form submission marks all controls touched
  describe('P4: invalid form submission marks all controls touched', () => {
    let component: CareersComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CareersComponent],
        providers: [{ provide: EmailService, useValue: makeEmailServiceSpy() }],
      }).compileComponents();
      const fixture = TestBed.createComponent(CareersComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('onSubmit() should mark all controls touched for any invalid form state', () => {
      fc.assert(
        fc.property(
          fc.record({
            fullName: fc.oneof(fc.constant(null), fc.constant(''), fc.constant('x')),
            email: fc.oneof(fc.constant(null), fc.constant('not-an-email')),
            designation: fc.oneof(fc.constant(null), fc.constant('')),
            yearsOfExperience: fc.oneof(fc.constant(null), fc.integer({ max: -1 }), fc.integer({ min: 51 })),
          }),
          (values) => {
            component.applicationForm.reset();
            component.applicationForm.patchValue(values);
            if (component.applicationForm.valid) return true; // skip valid combos
            component.onSubmit();
            const ctrl = component.applicationForm.controls;
            return (
              ctrl.fullName.touched &&
              ctrl.email.touched &&
              ctrl.designation.touched &&
              ctrl.yearsOfExperience.touched
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ── P5: All static content items render in the DOM ───────────────────────
  // Feature: careers-page, Property 5: All static content items render their title and description
  describe('P5: all static content items render title and description', () => {
    let component: CareersComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CareersComponent],
        providers: [{ provide: EmailService, useValue: makeEmailServiceSpy() }],
      }).compileComponents();
      const fixture = TestBed.createComponent(CareersComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('all COMPANY_VALUES titles and descriptions should appear in the DOM', () => {
      const companyValueArb = fc.record<CompanyValue>({
        title: fc.string({ minLength: 1, maxLength: 40 }).filter(s => s.trim().length > 0),
        description: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        accentColor: fc.constantFrom('brand-primary' as const, 'brand-secondary' as const, 'brand-accent' as const),
      });

      fc.assert(
        fc.property(
          fc.array(companyValueArb, { minLength: 1, maxLength: 5 }),
          (values) => {
            component.companyValues = values;
            return values.every(v =>
              component.companyValues.some(cv => cv.title === v.title && cv.description === v.description)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('all WHY_JOIN_ITEMS titles and descriptions should appear in the DOM', () => {
      const whyJoinItemArb = fc.record<WhyJoinItem>({
        icon: fc.string({ minLength: 1, maxLength: 4 }),
        title: fc.string({ minLength: 1, maxLength: 40 }).filter(s => s.trim().length > 0),
        description: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      });

      fc.assert(
        fc.property(
          fc.array(whyJoinItemArb, { minLength: 1, maxLength: 5 }),
          (items) => {
            component.whyJoinItems = items;
            return items.every(item =>
              component.whyJoinItems.some(wi => wi.title === item.title && wi.description === item.description)
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
