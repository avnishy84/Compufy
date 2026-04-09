import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CaseStudyDetailComponent } from './case-study-detail.component';
import { CASE_STUDIES_DATA } from '../../../data/static/case-studies.data';

function createActivatedRouteStub(slug: string) {
  return {
    snapshot: {
      paramMap: {
        get: (key: string) => (key === 'slug' ? slug : null),
      },
    },
  };
}

describe('CaseStudyDetailComponent', () => {
  const studyWithDemo = CASE_STUDIES_DATA.find(s => s.liveDemoUrl !== '');
  const studyWithoutDemo = CASE_STUDIES_DATA.find(s => s.liveDemoUrl === '');

  describe('Live Demo Button uses ButtonComponent with primary variant', () => {
    it('should render app-button when liveDemoUrl is non-empty', async () => {
      if (!studyWithDemo) {
        pending('No case study with liveDemoUrl found');
        return;
      }

      await TestBed.configureTestingModule({
        imports: [CaseStudyDetailComponent],
        providers: [
          provideRouter([]),
          { provide: ActivatedRoute, useValue: createActivatedRouteStub(studyWithDemo.slug) },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(CaseStudyDetailComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('app-button');
      expect(button).toBeTruthy();
    });

    it('app-button should have variant="primary" attribute', async () => {
      if (!studyWithDemo) {
        pending('No case study with liveDemoUrl found');
        return;
      }

      await TestBed.configureTestingModule({
        imports: [CaseStudyDetailComponent],
        providers: [
          provideRouter([]),
          { provide: ActivatedRoute, useValue: createActivatedRouteStub(studyWithDemo.slug) },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(CaseStudyDetailComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('app-button');
      expect(button).toBeTruthy();
      // The variant input is reflected via ng-reflect-variant in test environments
      const variantAttr =
        button.getAttribute('ng-reflect-variant') ??
        button.getAttribute('variant');
      expect(variantAttr).toBe('primary');
    });

    it('should NOT render app-button when liveDemoUrl is empty', async () => {
      if (!studyWithoutDemo) {
        pending('No case study without liveDemoUrl found');
        return;
      }

      await TestBed.configureTestingModule({
        imports: [CaseStudyDetailComponent],
        providers: [
          provideRouter([]),
          { provide: ActivatedRoute, useValue: createActivatedRouteStub(studyWithoutDemo.slug) },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(CaseStudyDetailComponent);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('app-button');
      expect(button).toBeNull();
    });
  });
});
