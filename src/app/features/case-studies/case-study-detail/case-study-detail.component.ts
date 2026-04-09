import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { CASE_STUDIES_BY_SLUG } from '../../../data/static/case-studies.data';
import { CaseStudy } from '../../../data/models/case-study.model';
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'app-case-study-detail',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (caseStudy(); as study) {
      <main class="min-h-screen bg-surface px-6 py-20">
        <div class="mx-auto max-w-4xl">

          <!-- Back link -->
          <a
            routerLink="/"
            class="mb-10 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-brand-accent transition-colors duration-200"
          >
            ← Back to home
          </a>

          <!-- Header -->
          <header class="mb-12">
            <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-accent">
              {{ study.clientName }}
            </p>
            <h1 class="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {{ study.projectTitle }}
            </h1>
            <p class="text-lg text-slate-400">{{ study.shortDescription }}</p>

            <!-- Tags -->
            <div class="mt-6 flex flex-wrap gap-2">
              @for (tag of study.tags; track tag) {
                <span class="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-accent">
                  {{ tag }}
                </span>
              }
            </div>
          </header>

          <!-- Content sections -->
          <div class="space-y-10">
            <section class="rounded-2xl border border-white/5 bg-surface-card p-8">
              <h2 class="mb-4 text-xl font-semibold text-white">The Problem</h2>
              <p class="leading-relaxed text-slate-400">{{ study.problemStatement }}</p>
            </section>

            <section class="rounded-2xl border border-white/5 bg-surface-card p-8">
              <h2 class="mb-4 text-xl font-semibold text-white">Our Solution</h2>
              <p class="leading-relaxed text-slate-400">{{ study.solution }}</p>
            </section>

            <section class="rounded-2xl border border-white/5 bg-surface-card p-8">
              <h2 class="mb-4 text-xl font-semibold text-white">Technical Depth</h2>
              <p class="leading-relaxed text-slate-400">{{ study.technicalDepth }}</p>
            </section>
          </div>

          <!-- Live demo button -->
          @if (study.liveDemoUrl) {
            <div class="mt-12">
              <a
                [href]="study.liveDemoUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <app-button variant="primary" size="lg">View Live Demo</app-button>
              </a>
            </div>
          }

        </div>
      </main>
    }
  `,
})
export class CaseStudyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  readonly caseStudy = signal<CaseStudy | null>(null);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const study = CASE_STUDIES_BY_SLUG.get(slug);

    if (!study) {
      void this.router.navigate(['/']);
      return;
    }

    this.caseStudy.set(study);
    this.titleService.setTitle(`${study.projectTitle} | Compufy Technology`);
    this.metaService.updateTag({ name: 'description', content: study.shortDescription });
  }
}
