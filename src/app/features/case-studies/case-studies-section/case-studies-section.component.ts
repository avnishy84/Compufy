import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CASE_STUDIES_DATA } from '../../../data/static/case-studies.data';
import { CaseStudy } from '../../../data/models/case-study.model';

@Component({
  selector: 'app-case-studies-section',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (caseStudies().length) {
      <section class="bg-surface px-6 py-20">
        <div class="mx-auto max-w-6xl">
          <p class="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-brand-accent">
            Client Work
          </p>
          <h2 class="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
            Case
            <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              Studies
            </span>
          </h2>
          <p class="mx-auto mb-14 max-w-xl text-center text-slate-400">
            Real problems, real solutions — a look at the work we've delivered for our clients.
          </p>

          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            @for (study of caseStudies(); track study.id) {
              <a
                [routerLink]="['/case-studies', study.slug]"
                class="group flex flex-col gap-4 rounded-2xl border border-white/5 bg-surface-card p-6 backdrop-blur-glass transition-all duration-200 hover:border-brand-primary/40 hover:shadow-lg hover:shadow-brand-primary/10 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-surface"
              >
                <div class="flex flex-wrap gap-2">
                  @for (tag of study.tags; track tag) {
                    <span class="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-accent">
                      {{ tag }}
                    </span>
                  }
                </div>

                <div class="flex-1">
                  <p class="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                    {{ study.clientName }}
                  </p>
                  <h3 class="mb-2 text-lg font-semibold text-white group-hover:text-brand-accent transition-colors duration-200">
                    {{ study.projectTitle }}
                  </h3>
                  <p class="text-sm leading-relaxed text-slate-400">
                    {{ study.shortDescription }}
                  </p>
                </div>

                <span class="text-sm font-medium text-brand-primary group-hover:text-brand-accent transition-colors duration-200">
                  Read case study →
                </span>
              </a>
            }
          </div>
        </div>
      </section>
    }
  `,
})
export class CaseStudiesSectionComponent {
  readonly caseStudies = signal<CaseStudy[]>(CASE_STUDIES_DATA);
}
