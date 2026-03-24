import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { WhatWeDoSectionComponent } from './what-we-do/what-we-do-section.component';
import { StatsSectionComponent } from './stats-section/stats-section.component';
import { HowWeWorkSectionComponent } from './how-we-work-section/how-we-work-section.component';
import { CtaSectionComponent } from './cta-section/cta-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    WhatWeDoSectionComponent,
    StatsSectionComponent,
    HowWeWorkSectionComponent,
    CtaSectionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <app-hero-section />
      <app-what-we-do-section />
      <app-stats-section />
      <app-how-we-work-section />
      <app-cta-section />
    </main>
  `,
})
export class HomeComponent {}
