import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ServiceCategoryComponent } from './service-category/service-category.component';
import { SERVICES_DATA } from '../../data/static/services.data';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ServiceCategoryComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-surface">

      <!-- Hero -->
      <section class="relative overflow-hidden px-6 pb-20 pt-28">
        <!-- Background blobs -->
        <div class="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand-primary/10 blur-3xl"></div>
        <div class="pointer-events-none absolute -top-16 right-1/4 h-64 w-64 rounded-full bg-brand-accent/10 blur-3xl"></div>

        <div class="relative mx-auto max-w-6xl text-center">
          <span class="mb-4 inline-block rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-primary">
            What We Offer
          </span>
          <h1 class="mb-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Services Built for
            <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent"> Scale</span>
          </h1>
          <p class="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400">
            From cloud-native SaaS engineering to strategic IT consulting — every service is designed to move fast, stay secure, and deliver measurable value.
          </p>
        </div>
      </section>

      <!-- Categories -->
      <section class="px-6 pb-24">
        <div class="mx-auto max-w-6xl">
          @for (category of categories; track category.id) {
            <app-service-category [category]="category" />
          }
        </div>
      </section>

    </main>
  `,
})
export class ServicesComponent {
  readonly categories = SERVICES_DATA;
}
