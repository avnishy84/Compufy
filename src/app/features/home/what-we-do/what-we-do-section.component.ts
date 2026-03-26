import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponent } from '../../../shared/card/card.component';
import { scrollReveal } from '../../../shared/animations/animations';

const WHAT_WE_DO = [
  {
    id: 'saas-engineering',
    slug: 'cloud-infrastructure-devops',
    icon: 'cloud',
    subtitle: 'Cloud-Native Development',
    title: 'SaaS Engineering',
    description: 'Architecting secure, multi-tenant platforms designed for high availability and global scale.',
    cta: 'Learn More',
  },
  {
    id: 'growth-engines',
    slug: 'analytics-business-intelligence',
    icon: 'trending-up',
    subtitle: 'Data & Performance',
    title: 'Growth Engines',
    description: 'Leveraging advanced analytics and SEO automation to turn your platform into a self-sustaining lead machine.',
    cta: 'Learn More',
  },
  {
    id: 'strategic-advisory',
    slug: 'it-strategy-consulting',
    icon: 'lightbulb',
    subtitle: 'P.I.T.C. — Product IT Consulting',
    title: 'Strategic Advisory',
    description: 'Aligning your technical roadmap with subscription-based business models for long-term recurring revenue.',
    cta: 'Learn More',
  },
];

@Component({
  selector: 'app-what-we-do-section',
  standalone: true,
  imports: [CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scrollReveal],
  template: `
    <section class="bg-surface px-6 py-20" [@scrollReveal]>
      <div class="mx-auto max-w-6xl">
        <p class="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-brand-accent">What We Do</p>
        <h2 class="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
          Built for the
          <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
            SaaS Era
          </span>
        </h2>
        <p class="mx-auto mb-12 max-w-xl text-center text-slate-400">
          We help ambitious teams build scalable software, automate growth, and navigate the shift to subscription-based models.
        </p>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (item of items; track item.id) {
            <button
              type="button"
              class="cursor-pointer text-left"
              (click)="navigate(item.slug)"
            >
              <app-card
                [title]="item.title"
                [description]="item.description"
                [icon]="item.icon"
                [subtitle]="item.subtitle"
                [cta]="item.cta"
              />
            </button>
          }
        </div>
      </div>
    </section>
  `,
})
export class WhatWeDoSectionComponent {
  readonly items = WHAT_WE_DO;
  private readonly router = inject(Router);

  navigate(slug: string): void {
    this.router.navigate(['/services', slug]);
  }
}
