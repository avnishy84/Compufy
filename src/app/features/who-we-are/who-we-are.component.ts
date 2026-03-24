import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FOUNDER_DATA } from '../../data/static/founder.data';
import { FounderProfile } from '../../data/models/founder.model';

@Component({
  selector: 'app-who-we-are',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-surface">

      <!-- Background blobs -->
      <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand-primary/10 blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-brand-accent/10 blur-3xl"></div>
        <div class="absolute top-1/2 right-0 h-64 w-64 rounded-full bg-brand-secondary/10 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-6xl px-6 py-20">

        <!-- ── Page Hero ── -->
        <section class="mb-20 text-center">
          <span class="mb-4 inline-block rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-primary">
            Who We Are
          </span>
          <h1 class="mb-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Built by Builders,
            <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent"> For Builders</span>
          </h1>
          <p class="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400">
            Compufy Technology is a tight-knit team of engineers and consultants who care deeply about craft, collaboration, and delivering real value to every client we work with.
          </p>
        </section>

        <!-- ── Founder Card ── -->
        <section class="mb-20">
          <div class="rounded-2xl border border-white/10 bg-surface-card p-8 sm:p-12">
            <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">

              <!-- Avatar -->
              <div class="flex shrink-0 justify-center lg:justify-start">
                <div class="relative">
                  <div class="flex h-28 w-28 items-center justify-center rounded-full border-2 border-brand-primary/40 bg-brand-primary/10 text-4xl font-extrabold text-brand-primary sm:h-36 sm:w-36 sm:text-5xl">
                    {{ founder.name.charAt(0) }}
                  </div>
                  <span class="absolute -bottom-2 -right-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-2.5 py-0.5 text-xs font-semibold text-brand-accent">
                    Founder
                  </span>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 text-center lg:text-left">
                <h2 class="mb-1 text-2xl font-extrabold text-white sm:text-3xl">{{ founder.name }}</h2>
                <p class="mb-4 text-base font-medium text-brand-accent">{{ founder.title }}</p>
                <p class="mb-6 max-w-2xl leading-relaxed text-slate-300">{{ founder.summary }}</p>

                <!-- Expertise badges -->
                <div class="flex flex-wrap justify-center gap-2 lg:justify-start">
                  @for (category of founder.skillCategories; track category.label) {
                    <span class="rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-1 text-sm font-medium text-brand-primary">
                      {{ category.label }}
                    </span>
                  } @empty {
                    <span class="text-sm text-slate-400">No expertise areas listed.</span>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Co-Founder Card ── -->
        <section class="mb-20">
          <div class="rounded-2xl border border-white/10 bg-surface-card p-8 sm:p-12">
            <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">

              <!-- Avatar -->
              <div class="flex shrink-0 justify-center lg:justify-start">
                <div class="relative">
                  <div class="flex h-28 w-28 items-center justify-center rounded-full border-2 border-brand-secondary/40 bg-brand-secondary/10 text-4xl font-extrabold text-brand-secondary sm:h-36 sm:w-36 sm:text-5xl">
                    A
                  </div>
                  <span class="absolute -bottom-2 -right-2 rounded-full border border-brand-secondary/30 bg-brand-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-brand-secondary">
                    Co-Founder
                  </span>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 text-center lg:text-left">
                <h2 class="mb-1 text-2xl font-extrabold text-white sm:text-3xl">Abhishek Yadav</h2>
                <p class="mb-4 text-base font-medium text-brand-secondary">Client Relations & Corporate Strategy</p>
                <p class="mb-6 max-w-2xl leading-relaxed text-slate-300">
                  A visionary with 8+ years in client management and corporate relationship building, Abhishek brings the strategic and interpersonal depth that turns great engineering into lasting partnerships. He bridges the gap between business goals and technical delivery — ensuring every client feels heard, valued, and confident in the work we do together.
                </p>

                <!-- Expertise badges -->
                <div class="flex flex-wrap justify-center gap-2 lg:justify-start">
                  @for (tag of coFounderExpertise; track tag) {
                    <span class="rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-3 py-1 text-sm font-medium text-brand-secondary">
                      {{ tag }}
                    </span>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── How We Work ── -->
        <section class="mb-20">
          <div class="mb-10 text-center">
            <h2 class="text-2xl font-bold sm:text-3xl">
              <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                How We Work
              </span>
            </h2>
            <p class="mt-3 text-slate-400">Collaboration is at the core of everything we do.</p>
          </div>

          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (value of teamValues; track value.title) {
              <div class="rounded-2xl border border-white/10 bg-surface-card p-6">
                <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-xl">
                  {{ value.icon }}
                </div>
                <h3 class="mb-2 text-base font-bold text-white">{{ value.title }}</h3>
                <p class="text-sm leading-relaxed text-slate-400">{{ value.description }}</p>
              </div>
            }
          </div>
        </section>

        <!-- ── CTA ── -->
        <section class="text-center">
          <div class="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 px-8 py-12">
            <h2 class="mb-3 text-2xl font-bold text-white sm:text-3xl">Ready to build something great?</h2>
            <p class="mb-6 text-slate-400">We'd love to hear about your project and explore how we can help.</p>
            <a
              routerLink="/contact"
              class="inline-block rounded-xl bg-brand-primary px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Get in Touch
            </a>
          </div>
        </section>

      </div>
    </main>
  `,
})
export class WhoWeAreComponent {
  readonly founder: FounderProfile = FOUNDER_DATA;

  readonly coFounderExpertise = [
    'Client Management',
    'Corporate Relations',
    'Business Strategy',
    'Stakeholder Engagement',
    'Partnership Development',
  ];

  readonly teamValues = [
    {
      icon: '🤝',
      title: 'Client-First Mindset',
      description: 'We treat every client engagement as a partnership. Your goals drive our decisions from day one.',
    },
    {
      icon: '🔍',
      title: 'Deep Technical Expertise',
      description: 'From architecture to deployment, we bring hands-on experience across the full stack to every project.',
    },
    {
      icon: '🔄',
      title: 'Iterative Delivery',
      description: 'We ship in short cycles, gather feedback early, and adapt quickly — so you always know where things stand.',
    },
    {
      icon: '💬',
      title: 'Transparent Communication',
      description: 'No black boxes. We keep you in the loop with clear updates, honest timelines, and open conversations.',
    },
    {
      icon: '⚡',
      title: 'Speed Without Compromise',
      description: 'We move fast but never cut corners on quality, security, or maintainability.',
    },
    {
      icon: '🌱',
      title: 'Long-Term Thinking',
      description: 'We build solutions that scale with your business, not just ones that solve today\'s problem.',
    },
  ];
}
