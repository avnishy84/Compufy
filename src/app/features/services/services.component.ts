import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ServiceCategoryComponent } from './service-category/service-category.component';
import { SERVICES_DATA } from '../../data/static/services.data';
import { staggerCards } from '../../shared/animations/animations';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ServiceCategoryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [staggerCards],
  template: `
    <main class="min-h-screen bg-surface px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <h1 class="mb-4 text-4xl font-bold text-white">Our Services</h1>
        <p class="mb-12 text-slate-400">
          Explore the full range of technology solutions we offer to help your business grow.
        </p>
        <div [@staggerCards]="categories.length">
          @for (category of categories; track category.id) {
            <app-service-category [category]="category" />
          }
        </div>
      </div>
    </main>
  `,
})
export class ServicesComponent {
  readonly categories = SERVICES_DATA;
}
