import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Service } from '../../../data/models/service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex h-full' },
  template: `
    <button
      type="button"
      class="group relative flex h-full w-full cursor-pointer flex-col rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/60 hover:bg-slate-800/70 hover:shadow-lg hover:shadow-brand-primary/10"
      (click)="navigate()"
    >
      <!-- Icon -->
      <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary/20 transition-colors group-hover:bg-brand-primary/20">
        <lucide-icon [name]="service().iconName" [size]="20" />
      </div>
      <!-- Content -->
      <h3 class="mb-2 text-base font-semibold text-white">{{ service().title }}</h3>
      <p class="flex-1 text-sm leading-relaxed text-slate-400">{{ service().description }}</p>
      <!-- Arrow hint -->
      <div class="mt-4 flex items-center justify-between">
        <div class="h-px w-0 bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300 group-hover:w-full"></div>
        <lucide-icon
          name="arrow-right"
          [size]="14"
          class="ml-2 shrink-0 text-slate-600 transition-colors group-hover:text-brand-accent"
        />
      </div>
    </button>
  `,
})
export class ServiceCardComponent {
  service = input.required<Service>();

  private readonly router = inject(Router);

  navigate(): void {
    this.router.navigate(['/services', this.service().slug]);
  }
}
