import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../../shared/button/button.component';
import { SERVICES_BY_SLUG } from '../../../data/static/services.data';
import { scrollReveal } from '../../../shared/animations/animations';

const WHY_COMPUFY = [
  {
    icon: 'zap',
    title: 'Modern Technology Expertise',
    description: 'We stay current with the latest frameworks, cloud platforms, and engineering practices so your product is built on solid, future-proof foundations.',
  },
  {
    icon: 'trending-up',
    title: 'Scalable by Design',
    description: 'Every solution is architected to grow with your business — from MVP to enterprise scale without costly rewrites.',
  },
  {
    icon: 'shield-check',
    title: 'Strong Support & Maintenance',
    description: 'We don\'t disappear after launch. Ongoing support, monitoring, and iterative improvements are part of how we work.',
  },
  {
    icon: 'users',
    title: 'Client-Focused Approach',
    description: 'Your goals drive every decision. We communicate clearly, deliver on time, and treat your success as our own.',
  },
];

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [LucideAngularModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scrollReveal],
  template: `
    @if (service()) {
      <main class="min-h-screen bg-surface">

        <!-- Hero -->
        <section class="relative overflow-hidden px-6 pb-16 pt-28" [@scrollReveal]>
          <div class="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand-primary/10 blur-3xl"></div>
          <div class="pointer-events-none absolute right-1/4 top-0 h-64 w-64 rounded-full bg-brand-accent/10 blur-3xl"></div>

          <div class="relative mx-auto max-w-4xl">
            <!-- Back link -->
            <button
              class="mb-8 flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
              (click)="goBack()"
            >
              <lucide-icon name="arrow-left" [size]="16" />
              Back to Services
            </button>

            <!-- Category badge -->
            <span class="mb-4 inline-block rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-primary">
              {{ categoryLabel() }}
            </span>

            <div class="flex items-start gap-6">
              <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-primary/10 ring-1 ring-brand-primary/20">
                <lucide-icon [name]="service()!.iconName" [size]="28" class="text-brand-primary" />
              </div>
              <div>
                <h1 class="mb-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                  {{ service()!.title }}
                </h1>
                <p class="max-w-2xl text-lg leading-relaxed text-slate-400">
                  {{ service()!.overview ?? service()!.description }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div class="mx-auto max-w-4xl space-y-16 px-6 pb-24">

          <!-- Features -->
          @if (service()!.features?.length) {
            <section [@scrollReveal]>
              <h2 class="mb-8 text-2xl font-bold text-white">Key Features & Capabilities</h2>
              <ul class="grid gap-4 sm:grid-cols-2">
                @for (feature of service()!.features; track feature) {
                  <li class="flex items-start gap-3 rounded-xl border border-white/5 bg-slate-800/50 p-4">
                    <lucide-icon name="check-circle-2" [size]="18" class="mt-0.5 shrink-0 text-brand-accent" />
                    <span class="text-sm leading-relaxed text-slate-300">{{ feature }}</span>
                  </li>
                }
              </ul>
            </section>
          }

          <!-- Why Compufy -->
          <section [@scrollReveal]>
            <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-accent">Why Compufy</p>
            <h2 class="mb-8 text-2xl font-bold text-white">
              What Sets Us
              <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent"> Apart</span>
            </h2>
            <div class="grid gap-5 sm:grid-cols-2">
              @for (item of whyCompufy; track item.title) {
                <div class="flex gap-4 rounded-2xl border border-white/5 bg-slate-800/40 p-5">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-secondary/10 ring-1 ring-brand-secondary/20">
                    <lucide-icon [name]="item.icon" [size]="18" class="text-brand-secondary" />
                  </div>
                  <div>
                    <h3 class="mb-1 text-sm font-semibold text-white">{{ item.title }}</h3>
                    <p class="text-sm leading-relaxed text-slate-400">{{ item.description }}</p>
                  </div>
                </div>
              }
            </div>
          </section>

          <!-- Benefits -->
          @if (service()!.benefits?.length) {
            <section [@scrollReveal]>
              <h2 class="mb-8 text-2xl font-bold text-white">Business Benefits</h2>
              <div class="grid gap-4 sm:grid-cols-2">
                @for (benefit of service()!.benefits; track benefit; let i = $index) {
                  <div class="flex items-start gap-4 rounded-xl border border-white/5 bg-slate-800/50 p-5">
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-xs font-bold text-white">
                      {{ i + 1 }}
                    </span>
                    <p class="text-sm leading-relaxed text-slate-300">{{ benefit }}</p>
                  </div>
                }
              </div>
            </section>
          }

          <!-- CTA -->
          <section class="rounded-2xl border border-brand-primary/20 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 p-10 text-center" [@scrollReveal]>
            <h2 class="mb-3 text-2xl font-bold text-white">Ready to get started?</h2>
            <p class="mx-auto mb-8 max-w-md text-slate-400">
              Tell us about your project and we'll get back to you within one business day.
            </p>
            <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <app-button variant="primary" size="lg" (click)="navigateToContact()">
                Get a Quote
              </app-button>
              <app-button variant="secondary" size="lg" (click)="goBack()">
                View All Services
              </app-button>
            </div>
          </section>

        </div>
      </main>
    } @else {
      <!-- 404 state -->
      <main class="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface px-6 text-center">
        <lucide-icon name="search-x" [size]="48" class="text-slate-600" />
        <h1 class="text-2xl font-bold text-white">Service not found</h1>
        <p class="text-slate-400">The service you're looking for doesn't exist or may have moved.</p>
        <app-button variant="primary" (click)="goBack()">Back to Services</app-button>
      </main>
    }
  `,
})
export class ServiceDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly whyCompufy = WHY_COMPUFY;

  // Read synchronously from snapshot so OnPush sees the value immediately
  private readonly slug = signal(this.route.snapshot.paramMap.get('id') ?? '');

  readonly service = signal(SERVICES_BY_SLUG.get(this.slug()) ?? null);

  readonly categoryLabel = signal(
    (this.service()?.category ?? '').replace(/-/g, ' ')
  );

  goBack(): void {
    this.router.navigate(['/services']);
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }
}
