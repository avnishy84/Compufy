import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group rounded-xl border border-slate-700/50 bg-surface-glass p-6 backdrop-blur-glass transition-all duration-200 hover:-translate-y-1 hover:border-brand-primary/40">
      @if (icon()) {
        <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
          <lucide-icon [name]="icon()" [size]="20" />
        </div>
      }
      @if (subtitle()) {
        <p class="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-accent">{{ subtitle() }}</p>
      }
      <h3 class="mb-2 text-lg font-semibold text-white">{{ title() }}</h3>
      <p class="text-sm leading-relaxed text-slate-400">{{ description() }}</p>
      @if (cta()) {
        <div class="mt-4 flex items-center gap-1 text-sm font-medium text-brand-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span>{{ cta() }}</span>
          <lucide-icon name="arrow-right" [size]="14" />
        </div>
      }
    </div>
  `,
})
export class CardComponent {
  title = input.required<string>();
  description = input.required<string>();
  icon = input<string>('');
  subtitle = input<string>('');
  cta = input<string>('');
}
