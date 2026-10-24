import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { CLIENT_PROJECTS_BY_SLUG } from '../../../data/static/client-projects.data';
import { ClientProject } from '../../../data/models/client-project.model';

@Component({
  selector: 'app-client-project-detail',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (project(); as p) {
      <main class="min-h-screen bg-surface px-6 py-20">
        <div class="mx-auto max-w-4xl">

          <!-- Back -->
          <a routerLink="/" class="mb-10 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-brand-accent transition-colors duration-200">
            ← Back to home
          </a>

          <!-- Header -->
          <header class="mb-12">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary/30 to-brand-accent/20 text-base font-bold text-brand-accent overflow-hidden" style="background: white;">
              @if (p.logoUrl) {
                <img [src]="p.logoUrl" [alt]="p.name + ' logo'" class="h-full w-full object-contain p-2" />
              } @else {
                {{ p.initials }}
              }
            </div>
            <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-accent">{{ p.industry }}</p>
            <h1 class="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{{ p.name }}</h1>
            <p class="text-lg text-slate-400">{{ p.tagline }}</p>

            <!-- Tech tags -->
            <div class="mt-6 flex flex-wrap gap-2">
              @for (tag of p.techTags; track tag) {
                <span class="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-accent">{{ tag }}</span>
              }
            </div>
          </header>

          <div class="space-y-8">

            <!-- Overview -->
            <section class="rounded-2xl border border-white/5 bg-surface-card p-8">
              <h2 class="mb-4 text-xl font-semibold text-white">Overview</h2>
              <p class="leading-relaxed text-slate-400">{{ p.overview }}</p>
              @if (p.quote) {
                <blockquote class="mt-6 rounded-xl border-l-4 border-brand-primary/50 bg-brand-primary/5 px-6 py-4 text-sm italic text-slate-300">
                  {{ p.quote }}
                </blockquote>
              }
            </section>

            <!-- Features -->
            <section class="rounded-2xl border border-white/5 bg-surface-card p-8">
              <h2 class="mb-6 text-xl font-semibold text-white">Key Features</h2>
              <div class="grid gap-8 sm:grid-cols-2">
                @for (group of p.featureGroups; track group.heading) {
                  <div>
                    <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-accent">{{ group.heading }}</h3>
                    <ul class="space-y-3">
                      @for (item of group.items; track item.name) {
                        <li class="text-sm text-slate-400">
                          <span class="font-medium text-white">{{ item.name }}</span> — {{ item.description }}
                        </li>
                      }
                    </ul>
                  </div>
                }
              </div>
            </section>

            <!-- Tech Stack -->
            <section class="rounded-2xl border border-white/5 bg-surface-card p-8">
              <h2 class="mb-6 text-xl font-semibold text-white">Tech Stack</h2>
              <div class="grid gap-8 sm:grid-cols-2">
                @for (group of p.techStackGroups; track group.heading) {
                  <div>
                    <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-accent">{{ group.heading }}</h3>
                    <ul class="space-y-3">
                      @for (item of group.items; track item.name) {
                        <li class="text-sm text-slate-400">
                          <span class="font-medium text-white">{{ item.name }}</span> — {{ item.description }}
                        </li>
                      }
                    </ul>
                  </div>
                }
              </div>
            </section>

            <!-- Architecture -->
            @if (p.architecture) {
              <section class="rounded-2xl border border-white/5 bg-surface-card p-8">
                <h2 class="mb-4 text-xl font-semibold text-white">Architecture</h2>
                <pre class="overflow-x-auto rounded-xl bg-slate-900/60 px-5 py-4 text-xs leading-relaxed text-slate-400">{{ p.architecture }}</pre>
                @if (p.architectureNotes?.length) {
                  <ul class="mt-6 space-y-3">
                    @for (note of p.architectureNotes!; track note.heading) {
                      <li class="text-sm text-slate-400">
                        <span class="font-medium text-white">{{ note.heading }}</span> — {{ note.body }}
                      </li>
                    }
                  </ul>
                }
              </section>
            }

            <!-- Differentiators -->
            @if (p.differentiators?.length) {
              <section class="rounded-2xl border border-white/5 bg-surface-card p-8">
                <h2 class="mb-6 text-xl font-semibold text-white">What Makes It Different</h2>
                <div class="grid gap-6 sm:grid-cols-2">
                  @for (d of p.differentiators!; track d.heading) {
                    <div>
                      <h3 class="mb-2 text-sm font-semibold text-white">{{ d.heading }}</h3>
                      <p class="text-sm leading-relaxed text-slate-400">{{ d.body }}</p>
                    </div>
                  }
                </div>
              </section>
            }

            <!-- Live Demo -->
            <section class="rounded-2xl border border-white/5 bg-surface-card p-8">
              <h2 class="mb-2 text-xl font-semibold text-white">Live Demo</h2>
              @if (p.liveDemoAvailable) {
                <p class="mb-4 text-sm text-slate-400">Try the live version of this project.</p>
                <a
                  [href]="p.liveDemoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Open Live Demo →
                </a>
              } @else {
                <p class="text-sm text-slate-400">
                  The live demo for this project is not publicly accessible in accordance with the client's privacy policy.
                </p>
              }
            </section>

          </div>
        </div>
      </main>
    }
  `,
})
export class ClientProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  readonly project = signal<ClientProject | null>(null);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const found = CLIENT_PROJECTS_BY_SLUG.get(slug);

    if (!found) {
      void this.router.navigate(['/']);
      return;
    }

    this.project.set(found);
    this.titleService.setTitle(`${found.name} | Compufy Technology`);
    this.metaService.updateTag({ name: 'description', content: found.tagline });
  }
}
