import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Service } from '../../../data/models/service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rounded-xl border border-slate-700/50 bg-surface-glass p-6 backdrop-blur-glass transition-all duration-200 hover:-translate-y-1 hover:border-brand-primary/50"
      [attr.data-icon]="service().iconName"
      [attr.data-title]="service().title"
      [attr.data-description]="service().description"
    >
      <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
        <span class="text-sm font-mono">{{ service().iconName }}</span>
      </div>
      <h3 class="mb-2 text-base font-semibold text-white">{{ service().title }}</h3>
      <p class="text-sm leading-relaxed text-slate-400">{{ service().description }}</p>
    </div>
  `,
})
export class ServiceCardComponent {
  service = input.required<Service>();
}
