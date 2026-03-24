import { Component, ChangeDetectionStrategy } from '@angular/core';
import { scrollReveal } from '../../../shared/animations/animations';

const STEPS = [
  {
    step: '01',
    title: 'Discover',
    description: 'We start by understanding your goals, constraints, and users through focused discovery sessions.',
  },
  {
    step: '02',
    title: 'Design',
    description: 'Architecture, UX flows, and technical blueprints are crafted before a single line of code is written.',
  },
  {
    step: '03',
    title: 'Build',
    description: 'Iterative development with continuous feedback loops keeps quality high and surprises low.',
  },
  {
    step: '04',
    title: 'Deploy',
    description: 'CI/CD pipelines, monitoring, and post-launch support ensure a smooth and lasting rollout.',
  },
];

@Component({
  selector: 'app-how-we-work-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scrollReveal],
  template: `
    <section class="bg-surface px-6 py-20" [@scrollReveal]>
      <div class="mx-auto max-w-6xl">
        <p class="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-brand-accent">Our Process</p>
        <h2 class="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
          How We
          <span class="bg-gradient-to-r from-brand-secondary to-brand-accent bg-clip-text text-transparent">
            Work
          </span>
        </h2>
        <p class="mx-auto mb-14 max-w-xl text-center text-slate-400">
          A clear, repeatable process that turns complex ideas into reliable software.
        </p>

        <div class="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Connector line (desktop only) -->
          <div class="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-brand-primary/20 via-brand-accent/40 to-brand-secondary/20 lg:block"></div>

          @for (item of steps; track item.step) {
            <div class="relative flex flex-col gap-4 rounded-2xl border border-white/5 bg-surface-card p-6 backdrop-blur-glass">
              <span class="text-4xl font-extrabold text-white/5 select-none">{{ item.step }}</span>
              <div class="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-sm font-bold text-white shadow-lg">
                {{ item.step }}
              </div>
              <div class="mt-6">
                <h3 class="mb-2 text-lg font-semibold text-white">{{ item.title }}</h3>
                <p class="text-sm leading-relaxed text-slate-400">{{ item.description }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class HowWeWorkSectionComponent {
  readonly steps = STEPS;
}
