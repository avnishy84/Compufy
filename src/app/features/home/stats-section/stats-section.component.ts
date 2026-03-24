import { Component, ChangeDetectionStrategy } from '@angular/core';
import { scrollReveal } from '../../../shared/animations/animations';

const STATS = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '30+', label: 'Happy Clients' },
  { value: '5+', label: 'Years of Experience' },
  { value: '3', label: 'Countries Served' },
];

@Component({
  selector: 'app-stats-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scrollReveal],
  template: `
    <section class="bg-surface-card px-6 py-16" [@scrollReveal]>
      <div class="mx-auto max-w-6xl">
        <div class="grid grid-cols-2 gap-8 sm:grid-cols-4">
          @for (stat of stats; track stat.label) {
            <div class="flex flex-col items-center gap-2 text-center">
              <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
                {{ stat.value }}
              </span>
              <span class="text-sm font-medium text-slate-400">{{ stat.label }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class StatsSectionComponent {
  readonly stats = STATS;
}
