import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { WhatWeDoSectionComponent } from './what-we-do/what-we-do-section.component';

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
export class HomeComponent {}
