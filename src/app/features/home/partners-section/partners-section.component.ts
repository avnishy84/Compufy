import { Component, ChangeDetectionStrategy } from '@angular/core';

interface Partner {
  name: string;
  description: string;
  logoUrl: string;
  bgClass: string;
}

const PARTNERS: Partner[] = [
  {
    name: 'Google Cloud',
    description: 'Global Google Cloud Managed Services Provider',
    logoUrl: '/google-cloud-logo.svg',
    bgClass: 'from-blue-500/10 to-cyan-500/5',
  },
  {
    name: 'AWS Partner Network',
    description: 'Advanced Consulting Partner for AWS',
    logoUrl: '/aws.png',
    bgClass: 'from-orange-500/10 to-yellow-500/5',
  },
  {
    name: 'Firebase',
    description: 'Certified Firebase & Google Cloud integration partner',
    logoUrl: '/firebase.png',
    bgClass: 'from-yellow-500/10 to-orange-500/5',
  },
  {
    name: 'Databricks',
    description: 'Consulting & SI Partner. On track to Select Tier partnership 2025.',
    logoUrl: '/databricks-logo.webp',
    bgClass: 'from-red-500/10 to-pink-500/5',
  },
];

@Component({
  selector: 'app-partners-section',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-surface px-6 py-20">
      <div class="mx-auto max-w-6xl">

        <!-- Header -->
        <div class="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-accent">
              Ecosystem
            </p>
            <h2 class="text-3xl font-bold text-white sm:text-4xl">
              Our
              <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                Partners
              </span>
            </h2>
            <p class="mt-3 max-w-md text-slate-400">
              We build on the world's leading cloud and developer platforms — certified and trusted.
            </p>
          </div>

          <a
            href="/contact"
            class="inline-flex items-center gap-2 self-start rounded-xl border border-brand-primary/30 bg-brand-primary/10 px-5 py-2.5 text-sm font-medium text-brand-accent transition-all hover:bg-brand-primary/20 sm:self-auto"
          >
            Partner with us
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <!-- Partner cards -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (partner of partners; track partner.name) {
            <div class="group relative overflow-hidden rounded-2xl border border-white/5 bg-surface-card p-6 transition-all duration-300 hover:border-white/10 hover:shadow-lg">

              <!-- Gradient glow -->
              <div class="absolute inset-0 bg-gradient-to-br {{ partner.bgClass }} opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              <div class="relative">
                <!-- Logo area -->
                <div class="mb-5 flex h-12 items-center">
                  <img
                    [src]="partner.logoUrl"
                    [alt]="partner.name + ' logo'"
                    class="h-24 max-w-[140px] object-contain"
                  />
                </div>

                <!-- Divider -->
                <div class="mb-4 h-px bg-white/5"></div>

                <!-- Description -->
                <p class="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
                  {{ partner.description }}
                </p>
              </div>
            </div>
          }
        </div>

      </div>
    </section>
  `,
})
export class PartnersSectionComponent {
  readonly partners = PARTNERS;
}
