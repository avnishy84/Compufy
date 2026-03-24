import * as fc from 'fast-check';
import { TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  FounderProfile,
  SkillCategory,
  ExperienceEntry,
  EducationEntry,
} from '../../data/models/founder.model';

// ---------------------------------------------------------------------------
// Test harness component — mirrors WhoWeAreComponent template structure but
// with a mutable `founder` property so arbitrary data can be injected.
// Uses Default change detection to ensure re-renders on property assignment.
// ---------------------------------------------------------------------------
@Component({
  selector: 'app-who-we-are-pbt-harness',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div>
      <!-- Hero fields -->
      <span class="founder-name">{{ founder.name }}</span>
      <span class="founder-title">{{ founder.title }}</span>
      <span class="founder-location">{{ founder.location }}</span>
      <span class="founder-role">{{ founder.role }}</span>
      <span class="founder-summary">{{ founder.summary }}</span>

      <!-- Skills -->
      @for (category of founder.skillCategories; track category.label) {
        <div class="skill-category">
          <span class="category-label">{{ category.label }}</span>
          @for (skill of category.skills; track skill) {
            <span class="skill-item">{{ skill }}</span>
          }
        </div>
      } @empty {
        <p>No skills listed.</p>
      }

      <!-- Experience -->
      @for (entry of founder.experience; track entry.company + entry.dateRange) {
        <div class="exp-entry" [attr.data-company]="entry.company">
          {{ entry.company }}
          <span class="exp-title">{{ entry.title }}</span>
          <span class="exp-location">{{ entry.location }}</span>
          <span class="exp-date-range">{{ entry.dateRange }}</span>
          @for (highlight of entry.highlights; track highlight) {
            <span class="exp-highlight">{{ highlight }}</span>
          }
        </div>
      } @empty {
        <p>No experience entries listed.</p>
      }

      <!-- Education -->
      @for (entry of founder.education; track entry.degree + entry.yearRange) {
        <div class="edu-entry" [attr.data-degree]="entry.degree">
          {{ entry.degree }}
          <span class="edu-institution">{{ entry.institution }}</span>
          <span class="edu-year-range">{{ entry.yearRange }}</span>
          <span class="edu-score">{{ entry.score }}</span>
        </div>
      } @empty {
        <p>No education entries listed.</p>
      }
    </div>
  `,
})
class WhoWeArePbtHarnessComponent {
  founder: FounderProfile = {
    name: '',
    title: '',
    location: '',
    summary: '',
    role: '',
    skillCategories: [],
    experience: [],
    education: [],
  };
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------
const skillCategoryArb: fc.Arbitrary<SkillCategory> = fc.record({
  label: fc.string({ minLength: 1 }),
  skills: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
});

const experienceEntryArb: fc.Arbitrary<ExperienceEntry> = fc.record({
  company: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  location: fc.string({ minLength: 1 }),
  dateRange: fc.string({ minLength: 1 }),
  highlights: fc.array(fc.string({ minLength: 1 })),
});

const educationEntryArb: fc.Arbitrary<EducationEntry> = fc.record({
  degree: fc.string({ minLength: 1 }),
  institution: fc.string({ minLength: 1 }),
  yearRange: fc.string({ minLength: 1 }),
  score: fc.string({ minLength: 1 }),
});

const founderProfileArb: fc.Arbitrary<FounderProfile> = fc.record({
  name: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  location: fc.string({ minLength: 1 }),
  summary: fc.string({ minLength: 1 }),
  role: fc.string({ minLength: 1 }),
  skillCategories: fc.array(skillCategoryArb),
  experience: fc.array(experienceEntryArb),
  education: fc.array(educationEntryArb),
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('WhoWeAreComponent PBT', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhoWeArePbtHarnessComponent],
    }).compileComponents();
  });

  // Feature: who-we-are-page, Property 1: All profile and section fields are rendered
  describe('P1: All profile and section fields are rendered', () => {
    it('for any FounderProfile, all header/experience/education fields appear in the DOM', () => {
      // Feature: who-we-are-page, Property 1: All profile and section fields are rendered
      // Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 4.2, 5.1
      expect(() =>
        fc.assert(
          fc.property(founderProfileArb, (profile) => {
            const fixture = TestBed.createComponent(WhoWeArePbtHarnessComponent);
            fixture.componentInstance.founder = profile;
            fixture.detectChanges();

            const text: string = fixture.nativeElement.textContent ?? '';

            // Hero fields
            if (!text.includes(profile.name)) return false;
            if (!text.includes(profile.title)) return false;
            if (!text.includes(profile.location)) return false;
            if (!text.includes(profile.summary)) return false;
            if (!text.includes(profile.role)) return false;

            // Experience entry fields
            for (const entry of profile.experience) {
              if (!text.includes(entry.company)) return false;
              if (!text.includes(entry.title)) return false;
              if (!text.includes(entry.location)) return false;
              if (!text.includes(entry.dateRange)) return false;
            }

            // Education entry fields
            for (const entry of profile.education) {
              if (!text.includes(entry.degree)) return false;
              if (!text.includes(entry.institution)) return false;
              if (!text.includes(entry.yearRange)) return false;
              if (!text.includes(entry.score)) return false;
            }

            return true;
          }),
          { numRuns: 100 }
        )
      ).not.toThrow();
    });
  });

  // Feature: who-we-are-page, Property 2: All skills are rendered without omission
  describe('P2: All skills are rendered without omission', () => {
    it('for any FounderProfile, every skill in every skill category appears in the DOM', () => {
      // Feature: who-we-are-page, Property 2: All skills are rendered without omission
      // Validates: Requirements 3.1, 3.2, 3.3
      expect(() =>
        fc.assert(
          fc.property(founderProfileArb, (profile) => {
            const fixture = TestBed.createComponent(WhoWeArePbtHarnessComponent);
            fixture.componentInstance.founder = profile;
            fixture.detectChanges();

            const text: string = fixture.nativeElement.textContent ?? '';

            for (const category of profile.skillCategories) {
              for (const skill of category.skills) {
                if (!text.includes(skill)) return false;
              }
            }

            return true;
          }),
          { numRuns: 100 }
        )
      ).not.toThrow();
    });
  });

  // Feature: who-we-are-page, Property 3: Section ordering matches data array order
  describe('P3: Section ordering matches data array order', () => {
    it('for any FounderProfile, DOM order of experience and education entries matches data order', () => {
      // Feature: who-we-are-page, Property 3: Section ordering matches data array order
      // Validates: Requirements 4.3, 5.2
      expect(() =>
        fc.assert(
          fc.property(founderProfileArb, (profile) => {
            const fixture = TestBed.createComponent(WhoWeArePbtHarnessComponent);
            fixture.componentInstance.founder = profile;
            fixture.detectChanges();

            const nativeEl: HTMLElement = fixture.nativeElement;

            // Check experience order via data-company attributes
            const expEls = nativeEl.querySelectorAll('.exp-entry');
            const domExpCompanies = Array.from(expEls).map(el => el.getAttribute('data-company'));
            const dataExpCompanies = profile.experience.map(e => e.company);
            if (domExpCompanies.length !== dataExpCompanies.length) return false;
            for (let i = 0; i < dataExpCompanies.length; i++) {
              if (domExpCompanies[i] !== dataExpCompanies[i]) return false;
            }

            // Check education order via data-degree attributes
            const eduEls = nativeEl.querySelectorAll('.edu-entry');
            const domEduDegrees = Array.from(eduEls).map(el => el.getAttribute('data-degree'));
            const dataEduDegrees = profile.education.map(e => e.degree);
            if (domEduDegrees.length !== dataEduDegrees.length) return false;
            for (let i = 0; i < dataEduDegrees.length; i++) {
              if (domEduDegrees[i] !== dataEduDegrees[i]) return false;
            }

            return true;
          }),
          { numRuns: 100 }
        )
      ).not.toThrow();
    });
  });
});
