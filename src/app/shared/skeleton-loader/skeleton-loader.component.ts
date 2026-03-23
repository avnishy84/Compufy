import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-3" aria-busy="true" aria-label="Loading...">
      @for (row of rowsArray(); track $index) {
        <div
          class="animate-pulse rounded-md bg-slate-700/50"
          [style.height]="height()"
        ></div>
      }
    </div>
  `,
})
export class SkeletonLoaderComponent {
  rows = input<number>(3);
  height = input<string>('1.25rem');

  rowsArray = computed(() => Array.from({ length: this.rows() }));
}
