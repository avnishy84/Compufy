import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent } from '../../../shared/card/card.component';
import { SERVICES_DATA } from '../../../data/static/services.data';
import { scrollReveal } from '../../../shared/animations/animations';

@Component({
  selector: 'app-what-we-do-section',
  standalone: true,
  imports: [CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scrollReveal],
  template: `
    <section class="bg-surface px-6 py-20" [@scrollReveal]>
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">What We Do</h2>
        <p class="mb-12 text-center text-slate-400">
          From web development to professional IT consulting, we cover the full spectrum of digital needs.
        </p>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (category of categories; track category.id) {
            <app-card
              [title]="category.label"
              [description]="category.services[0].description"
              [icon]="category.services[0].iconName"
            />
          }
        </div>
      </div>
    </section>
  `,
})
export class WhatWeDoSectionComponent {
  readonly categories = SERVICES_DATA;
}
