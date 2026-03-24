import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ServiceCategory } from '../../../data/models/service.model';
import { ServiceCardComponent } from '../service-card/service-card.component';

@Component({
  selector: 'app-service-category',
  standalone: true,
  imports: [ServiceCardComponent, UpperCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-16">
      <!-- Category header -->
      <div class="mb-8 flex items-center gap-4">
        <div class="flex flex-col">
          <span class="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-accent">{{ category().id | uppercase }}</span>
          <h2 class="text-2xl font-bold text-white">{{ category().label }}</h2>
        </div>
        <div class="ml-4 flex-1 h-px bg-gradient-to-r from-brand-primary/40 to-transparent"></div>
        <span class="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-400">
          {{ category().services.length }} services
        </span>
      </div>
      <!-- Cards grid -->
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        @for (service of category().services; track service.id) {
          <app-service-card [service]="service" />
        }
      </div>
    </div>
  `,
})
export class ServiceCategoryComponent {
  category = input.required<ServiceCategory>();
}
