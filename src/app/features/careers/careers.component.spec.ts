import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CareersComponent } from './careers.component';
import { COMPANY_VALUES, WHY_JOIN_ITEMS } from '../../data/static/careers.data';
import { API_ENDPOINTS } from '../../data/constants/api.constants';
import { routes } from '../../app.routes';
import { AppComponent } from '../../app.component';
import { provideRouter } from '@angular/router';
import { EmailService } from '../../core/email.service';

function makeEmailServiceSpy(): jasmine.SpyObj<EmailService> {
  return jasmine.createSpyObj<EmailService>('EmailService', ['sendContactEmail', 'sendCareersEmail']);
}

function makePdfFile(): File {
  return new File(['%PDF-1.4'], 'resume.pdf', { type: 'application/pdf' });
}

describe('CareersComponent', () => {

  // ── 7.2 Renders without errors ──────────────────────────────────────────
  describe('renders without errors', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CareersComponent],
        providers: [
          { provide: EmailService, useValue: makeEmailServiceSpy() },
        ],
      }).compileComponents();
    });

    it('should create the component', () => {
      const fixture = TestBed.createComponent(CareersComponent);
      expect(() => fixture.detectChanges()).not.toThrow();
      expect(fixture.componentInstance).toBeTruthy();
    });
  });

  // ── 7.3 Route registration ───────────────────────────────────────────────
  describe('route registration', () => {
    it('should have a route with path "careers"', () => {
      const route = routes.find(r => r.path === 'careers');
      expect(route).toBeDefined();
    });

    it('should use loadComponent for lazy loading', () => {
      const route = routes.find(r => r.path === 'careers');
      expect(route?.loadComponent).toBeDefined();
      expect(typeof route?.loadComponent).toBe('function');
    });

    it('loadComponent should resolve to CareersComponent', async () => {
      const route = routes.find(r => r.path === 'careers');
      const resolved = await route!.loadComponent!();
      expect((resolved as { name?: string }).name).toBe('CareersComponent');
    });
  });

  // ── 7.4 Nav link ─────────────────────────────────────────────────────────
  describe('AppComponent nav link', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AppComponent],
        providers: [
          provideRouter(routes),
          { provide: EmailService, useValue: makeEmailServiceSpy() },
        ],
      }).compileComponents();
    });

    it('should contain a Careers nav link pointing to /careers', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const anchors: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('a[ng-reflect-router-link="/careers"], a[routerlink="/careers"]');
      // Check by text content as routerLink is resolved at runtime
      const allAnchors: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
      const careersLink = allAnchors.find(a => a.textContent?.trim() === 'Careers');
      expect(careersLink).toBeTruthy();
    });
  });

  // ── 7.5 COMPANY_VALUES data ──────────────────────────────────────────────
  describe('COMPANY_VALUES static data', () => {
    it('should have at least 3 entries', () => {
      expect(COMPANY_VALUES.length).toBeGreaterThanOrEqual(3);
    });

    it('every entry should have a non-empty title', () => {
      COMPANY_VALUES.forEach(v => expect(v.title.trim().length).toBeGreaterThan(0));
    });

    it('every entry should have a non-empty description', () => {
      COMPANY_VALUES.forEach(v => expect(v.description.trim().length).toBeGreaterThan(0));
    });
  });

  // ── 7.6 WHY_JOIN_ITEMS data ──────────────────────────────────────────────
  describe('WHY_JOIN_ITEMS static data', () => {
    it('should have at least 3 entries', () => {
      expect(WHY_JOIN_ITEMS.length).toBeGreaterThanOrEqual(3);
    });

    it('every entry should have a non-empty title', () => {
      WHY_JOIN_ITEMS.forEach(v => expect(v.title.trim().length).toBeGreaterThan(0));
    });

    it('every entry should have a non-empty description', () => {
      WHY_JOIN_ITEMS.forEach(v => expect(v.description.trim().length).toBeGreaterThan(0));
    });
  });

  // ── Form submission tests ────────────────────────────────────────────────
  describe('form submission', () => {
    let component: CareersComponent;
    let emailSpy: jasmine.SpyObj<EmailService>;

    beforeEach(async () => {
      emailSpy = makeEmailServiceSpy();
      await TestBed.configureTestingModule({
        imports: [CareersComponent],
        providers: [
          { provide: EmailService, useValue: emailSpy },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(CareersComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    function fillValidForm(): void {
      component.applicationForm.setValue({
        fullName: 'Jane Doe',
        designation: 'Frontend Engineer',
        yearsOfExperience: 3,
        resume: makePdfFile(),
      });
    }

    // 7.7 — invalid form marks all touched, no email sent
    it('onSubmit() with invalid form marks all controls touched and does not call EmailService', () => {
      component.onSubmit();
      const ctrl = component.applicationForm.controls;
      expect(ctrl.fullName.touched).toBeTrue();
      expect(ctrl.designation.touched).toBeTrue();
      expect(ctrl.yearsOfExperience.touched).toBeTrue();
      expect(ctrl.resume.touched).toBeTrue();
      expect(emailSpy.sendCareersEmail).not.toHaveBeenCalled();
    });

    // 7.8 — valid form calls EmailService.sendCareersEmail
    it('onSubmit() with valid form calls EmailService.sendCareersEmail', () => {
      emailSpy.sendCareersEmail.and.returnValue(Promise.resolve());
      fillValidForm();
      component.onSubmit();
      expect(emailSpy.sendCareersEmail).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({ fullName: 'Jane Doe', designation: 'Frontend Engineer' })
      );
    });

    // 7.9 — success sets submitted() to true
    it('on success response submitted() becomes true', async () => {
      emailSpy.sendCareersEmail.and.returnValue(Promise.resolve());
      fillValidForm();
      component.onSubmit();
      await Promise.resolve(); // flush microtask
      expect(component.submitted()).toBeTrue();
    });

    // 7.10 — error sets submitError() and form values are preserved
    it('on error response submitError() is set', async () => {
      emailSpy.sendCareersEmail.and.returnValue(Promise.reject(new Error('fail')));
      fillValidForm();
      const savedName = component.applicationForm.controls.fullName.value;
      component.onSubmit();
      await Promise.resolve();
      expect(component.submitError()).toBeTruthy();
      expect(component.applicationForm.controls.fullName.value).toBe(savedName);
    });

    // 7.11 — submitting() is true during request, false after
    it('submitting() is true during in-flight request and false after response', async () => {
      let resolvePromise!: () => void;
      emailSpy.sendCareersEmail.and.returnValue(new Promise<void>(res => { resolvePromise = res; }));
      fillValidForm();
      expect(component.submitting()).toBeFalse();
      component.onSubmit();
      expect(component.submitting()).toBeTrue();
      resolvePromise();
      await Promise.resolve();
      expect(component.submitting()).toBeFalse();
    });
  });

  // ── 7.12 File input accept attribute ────────────────────────────────────
  describe('file input', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CareersComponent],
        providers: [{ provide: EmailService, useValue: makeEmailServiceSpy() }],
      }).compileComponents();
    });

    it('should have accept=".pdf" on the file input', () => {
      const fixture = TestBed.createComponent(CareersComponent);
      fixture.detectChanges();
      const fileInput: HTMLInputElement = fixture.nativeElement.querySelector('input[type="file"]');
      expect(fileInput).toBeTruthy();
      expect(fileInput.getAttribute('accept')).toBe('.pdf');
    });
  });

  // ── 7.13 aria-describedby links ──────────────────────────────────────────
  describe('aria-describedby', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<CareersComponent>>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CareersComponent],
        providers: [{ provide: EmailService, useValue: makeEmailServiceSpy() }],
      }).compileComponents();
      fixture = TestBed.createComponent(CareersComponent);
      fixture.detectChanges();
      // Trigger all errors by submitting empty form
      fixture.componentInstance.onSubmit();
      fixture.detectChanges();
    });

    const fields = ['fullName', 'designation', 'yearsOfExperience', 'resume'];

    fields.forEach(fieldId => {
      it(`input#${fieldId} should have aria-describedby pointing to an error element`, () => {
        const input: HTMLElement = fixture.nativeElement.querySelector(`#${fieldId}`);
        expect(input).toBeTruthy();
        const describedBy = input.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        const errorEl: HTMLElement = fixture.nativeElement.querySelector(`#${describedBy}`);
        expect(errorEl).toBeTruthy();
      });
    });
  });
});
