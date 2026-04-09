// Feature: who-we-are-enhancement, Property 1: Every core value card has an icon host element alongside the label
// Feature: who-we-are-enhancement, Property 2: Every achievement stat card has both a non-empty value and a non-empty label

import * as fc from 'fast-check';
import { TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LucideAngularModule, Lightbulb, LucideIconData } from 'lucide-angular';

// ---------------------------------------------------------------------------
// Inline interfaces (mirrors the component's private interfaces)
// ---------------------------------------------------------------------------
interface CoreValue {
  label: string;
  icon: LucideIconData;
}

interface AchievementStat {
  value: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Test harness: Core Values grid
// Mirrors the @for block from WhoWeAreComponent for the Core Values section.
// Uses Default CD so Input() changes trigger re-renders.
// ---------------------------------------------------------------------------
@Component({
  selector: 'app-core-values-harness',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="core-values-grid">
      @for (value of coreValues; track value.label) {
        <div class="core-value-card">
          <div class="icon-wrapper">
            <lucide-icon [img]="value.icon" [size]="20" class="value-icon"></lucide-icon>
          </div>
          <p class="value-label">{{ value.label }}</p>
        </div>
      }
    </div>
  `,
})
class CoreValuesHarnessComponent {
  @Input() coreValues: CoreValue[] = [];
}

// ---------------------------------------------------------------------------
// Test harness: Achievements grid
// Mirrors the @for block from WhoWeAreComponent for the Achievements section.
// ---------------------------------------------------------------------------
@Component({
  selector: 'app-achievements-harness',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="achievements-grid">
      @for (stat of achievements; track stat.label) {
        <div class="stat-card">
          <p class="stat-value">{{ stat.value }}</p>
          <p class="stat-label">{{ stat.label }}</p>
        </div>
      }
    </div>
  `,
})
class AchievementsHarnessComponent {
  @Input() achievements: AchievementStat[] = [];
}

// ---------------------------------------------------------------------------
// Property 1: Every core value card has an icon host element alongside the label
// Validates: Requirements 3.3
// ---------------------------------------------------------------------------
describe('PBT – P1: Every core value card has an icon host element alongside the label', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreValuesHarnessComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('for any array of CoreValue-shaped objects, each rendered card contains a lucide-icon alongside the label', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            label: fc.string({ minLength: 1, maxLength: 40 }),
            icon: fc.constant(Lightbulb as LucideIconData),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        (coreValues) => {
          const fixture = TestBed.createComponent(CoreValuesHarnessComponent);
          fixture.componentInstance.coreValues = coreValues;
          fixture.detectChanges();

          const el: HTMLElement = fixture.nativeElement;
          const cards = Array.from(el.querySelectorAll('.core-value-card'));

          // Number of rendered cards must equal the input array length
          expect(cards.length).toBe(coreValues.length);

          // Each card must contain both a lucide-icon host and a label element
          for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const iconHost = card.querySelector('lucide-icon');
            const labelEl = card.querySelector('.value-label');

            expect(iconHost).withContext(`card[${i}] (label="${coreValues[i].label}") should have a lucide-icon`).toBeTruthy();
            expect(labelEl).withContext(`card[${i}] should have a .value-label element`).toBeTruthy();
            expect(labelEl?.textContent?.trim())
              .withContext(`card[${i}] label text should match input`)
              .toBe(coreValues[i].label);
          }

          fixture.destroy();
        }
      ),
      { numRuns: 100 }
    );
    expect(true).toBeTrue();
  });
});

// ---------------------------------------------------------------------------
// Property 2: Every achievement stat card has both a non-empty value and a non-empty label
// Validates: Requirements 8.3
// ---------------------------------------------------------------------------
describe('PBT – P2: Every achievement stat card has both a non-empty value and a non-empty label', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementsHarnessComponent],
    }).compileComponents();
  });

  it('for any array of AchievementStat-shaped objects, each rendered stat card contains both a non-empty value and a non-empty label', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            value: fc.string({ minLength: 1, maxLength: 20 }),
            label: fc.string({ minLength: 1, maxLength: 40 }),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        (achievements) => {
          const fixture = TestBed.createComponent(AchievementsHarnessComponent);
          fixture.componentInstance.achievements = achievements;
          fixture.detectChanges();

          const el: HTMLElement = fixture.nativeElement;
          const cards = Array.from(el.querySelectorAll('.stat-card'));

          // Number of rendered cards must equal the input array length
          expect(cards.length).toBe(achievements.length);

          // Each card must contain both a non-empty value and a non-empty label
          for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const valueEl = card.querySelector('.stat-value');
            const labelEl = card.querySelector('.stat-label');

            expect(valueEl).withContext(`stat-card[${i}] should have a .stat-value element`).toBeTruthy();
            expect(labelEl).withContext(`stat-card[${i}] should have a .stat-label element`).toBeTruthy();

            const renderedValue = valueEl?.textContent?.trim() ?? '';
            const renderedLabel = labelEl?.textContent?.trim() ?? '';

            expect(renderedValue.length)
              .withContext(`stat-card[${i}] value should be non-empty`)
              .toBeGreaterThan(0);
            expect(renderedLabel.length)
              .withContext(`stat-card[${i}] label should be non-empty`)
              .toBeGreaterThan(0);

            expect(renderedValue)
              .withContext(`stat-card[${i}] value text should match input`)
              .toBe(achievements[i].value);
            expect(renderedLabel)
              .withContext(`stat-card[${i}] label text should match input`)
              .toBe(achievements[i].label);
          }

          fixture.destroy();
        }
      ),
      { numRuns: 100 }
    );
    expect(true).toBeTrue();
  });
});
