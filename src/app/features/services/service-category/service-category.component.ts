import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ServiceCategory } from '../../../data/models/service.model';
import { ServiceCardComponent } from '../service-card/service-card.component';

@Component({
  selector: 'app-service-category',
  standalone: true,
  imports: [ServiceCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-12">
      <h2 class="mb-6 text-2xl font-bold text-white">{{ category().label }}</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
