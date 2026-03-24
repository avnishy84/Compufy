import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { WhatWeDoSectionComponent } from './what-we-do/what-we-do-section.component';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSectionComponent, WhatWeDoSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <app-hero-section />
      <app-what-we-do-section />
    </main>
  `,
})
export class HomeComponent {
  constructor() {
    inject(SeoService).update({
      title: 'SaaS Engineering & IT Consulting',
      description: 'Compufy Technology builds secure, scalable SaaS platforms and provides expert IT consulting to help your business thrive in the digital age.',
      url: 'https://compufytech.web.app/home',
    });
  }
}
