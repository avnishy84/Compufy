import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl border border-slate-700/50 bg-surface-glass p-6 backdrop-blur-glass transition-transform duration-200 hover:-translate-y-1">
      @if (icon()) {
        <div class="mb-4 text-brand-primary">
          <span class="text-2xl">{{ icon() }}</span>
        </div>
      }
      <h3 class="mb-2 text-lg font-semibold text-white">{{ title() }}</h3>
      <p class="text-sm text-slate-400">{{ description() }}</p>
    </div>
  `,
})
export class CardComponent {
  title = input.required<string>();
  description = input.required<string>();
  icon = input<string>('');
}
