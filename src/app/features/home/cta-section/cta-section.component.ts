import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button.component';
import { scrollReveal } from '../../../shared/animations/animations';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scrollReveal],
  template: `
    <section class="relative overflow-hidden bg-surface px-6 py-24" [@scrollReveal]>
      <!-- Background glow -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/10 blur-3xl"></div>
      </div>

      <div class="relative z-10 mx-auto max-w-3xl text-center">
        <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-accent">Ready to Start?</p>
        <h2 class="mb-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Let's build something
          <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
            great together
          </span>
        </h2>
        <p class="mx-auto mb-10 max-w-lg text-slate-400">
          Whether you have a clear vision or just a rough idea, we're here to help you shape it into a product that works.
        </p>
        <app-button variant="primary" size="lg" (click)="navigateToContact()">
          Get in Touch
        </app-button>
      </div>
    </section>
  `,
})
export class CtaSectionComponent {
  private readonly router = inject(Router);

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }
}
