import * as fc from 'fast-check';
import { FormControl, Validators } from '@angular/forms';
import { minLengthTrimmed } from './validators';
import { TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('ContactComponent PBT', () => {

  // Task 9.7 — P5: fullName validator
  // Feature: compufy-technology-website, Property 5: Full name validator rejects short inputs
  describe('P5: fullName validator', () => {
    it('strings with fewer than 2 trimmed chars should return an error', () => {
      // Generates strings whose trimmed length is 0 or 1:
      // - empty string, whitespace-only strings, or strings with at most 1 non-whitespace char
      const shortAfterTrim = fc.string().filter(s => s.trim().length < 2);

      fc.assert(
        fc.property(
          shortAfterTrim,
          (str) => {
            const control = new FormControl(str, [minLengthTrimmed(2)]);
            return control.errors !== null && 'minLengthTrimmed' in control.errors;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('strings with 2 or more trimmed chars should return null', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 2 }).filter(s => s.trim().length >= 2),
          (str) => {
            const control = new FormControl(str, [minLengthTrimmed(2)]);
            return control.errors === null;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Task 9.8 — P6: email validator
  // Feature: compufy-technology-website, Property 6: Email validator accepts only valid email formats
  describe('P6: email validator', () => {
    it('invalid email strings should return an error', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => !s.includes('@') || s.trim() === ''),
          (str) => {
            const control = new FormControl(str, [Validators.required, Validators.email]);
            return control.errors !== null;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('valid email addresses should return null', () => {
      fc.assert(
        fc.property(
          fc.emailAddress(),
          (email) => {
            const control = new FormControl(email, [Validators.required, Validators.email]);
            return control.errors === null;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Task 9.9 — P7: subject validator
  // Feature: compufy-technology-website, Property 7: Subject validator rejects empty inputs
  describe('P7: subject validator', () => {
    it('empty string should return a required error', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(''),
          (str) => {
            const control = new FormControl(str, [Validators.required]);
            return control.errors !== null && 'required' in control.errors;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('non-empty strings should return null', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          (str) => {
            const control = new FormControl(str, [Validators.required]);
            return control.errors === null;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Task 9.10 — P8: message validator
  // Feature: compufy-technology-website, Property 8: Message validator enforces minimum length
  describe('P8: message validator', () => {
    it('strings with fewer than 10 chars should return an error', () => {
      fc.assert(
        fc.property(
          fc.string({ maxLength: 9 }),
          (str) => {
            const control = new FormControl(str, [Validators.required, Validators.minLength(10)]);
            return control.errors !== null;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('strings with 10 or more chars should return null', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 10 }),
          (str) => {
            const control = new FormControl(str, [Validators.required, Validators.minLength(10)]);
            return control.errors === null;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Task 9.11 — P10: invalid form submission marks all controls touched
  // Feature: compufy-technology-website, Property 10: Invalid form submission marks all controls as touched
  describe('P10: invalid form submission marks all controls touched', () => {
    let component: ContactComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ContactComponent],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          provideAnimations(),
        ],
      }).compileComponents();
      const fixture = TestBed.createComponent(ContactComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('any invalid form state should mark all controls touched after submit', () => {
      // Feature: compufy-technology-website, Property 10: Invalid form submission marks all controls as touched
      expect(() =>
        fc.assert(
          fc.property(
            fc.record({
              fullName: fc.constantFrom('', 'a'),  // too short — fails minLengthTrimmed(2)
              email: fc.constantFrom('', 'not-an-email'),
              subject: fc.constantFrom(''),
              message: fc.constantFrom('', 'short'),
            }),
            (values) => {
              component.contactForm.reset();
              component.contactForm.patchValue(values);
              component.onSubmit();
              const controls = component.contactForm.controls;
              return (
                controls.fullName.touched &&
                controls.email.touched &&
                controls.subject.touched &&
                controls.message.touched
              );
            }
          ),
          { numRuns: 100 }
        )
      ).not.toThrow();
    });
  });
});
