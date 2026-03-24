import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Service } from '../../../data/models/service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex h-full' },
  template: `
    <div class="group relative flex h-full w-full flex-col rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/60 hover:bg-slate-800/70 hover:shadow-lg hover:shadow-brand-primary/10">
      <!-- Icon -->
      <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary/20 transition-colors group-hover:bg-brand-primary/20">
        <lucide-icon [name]="service().iconName" [size]="20" />
      </div>
      <!-- Content -->
      <h3 class="mb-2 text-base font-semibold text-white">{{ service().title }}</h3>
      <p class="flex-1 text-sm leading-relaxed text-slate-400">{{ service().description }}</p>
      <!-- Hover accent line -->
      <div class="mt-4 h-px w-0 bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300 group-hover:w-full"></div>
    </div>
  `,
})
export class ServiceCardComponent {
  service = input.required<Service>();
}
