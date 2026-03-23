import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button.component';
import { scrollReveal } from '../../../shared/animations/animations';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scrollReveal],
  template: `
    <section
      class="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-6"
      [@scrollReveal]
    >
      <!-- Background gradient -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/10 blur-3xl"></div>
        <div class="absolute right-1/4 bottom-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-brand-secondary/10 blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left lg:gap-16">
        <!-- Text content -->
        <div class="max-w-2xl">
          <h1 class="mb-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Powering the Future with
            <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              Smart Technology
            </span>
          </h1>
          <p class="mb-8 text-lg text-slate-400 sm:text-xl">
            Compufy Technology delivers cutting-edge web development, digital solutions, and professional IT consulting to help your business thrive in the digital age.
          </p>
          <app-button variant="primary" size="lg" (click)="navigateToServices()">
            Explore Our Services
          </app-button>
        </div>

        <!-- CSS 3D tech element -->
        <div class="relative shrink-0" aria-hidden="true">
          <div class="tech-cube">
            <div class="face front"></div>
            <div class="face back"></div>
            <div class="face left"></div>
            <div class="face right"></div>
            <div class="face top"></div>
            <div class="face bottom"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .tech-cube {
      width: 120px;
      height: 120px;
      position: relative;
      transform-style: preserve-3d;
      animation: rotateCube 8s linear infinite;
    }
    .face {
      position: absolute;
      width: 120px;
      height: 120px;
      border: 2px solid rgba(99, 102, 241, 0.6);
      background: rgba(99, 102, 241, 0.05);
      backdrop-filter: blur(4px);
    }
    .front  { transform: translateZ(60px); }
    .back   { transform: rotateY(180deg) translateZ(60px); }
    .left   { transform: rotateY(-90deg) translateZ(60px); }
    .right  { transform: rotateY(90deg) translateZ(60px); }
    .top    { transform: rotateX(90deg) translateZ(60px); }
    .bottom { transform: rotateX(-90deg) translateZ(60px); }
    @keyframes rotateCube {
      from { transform: rotateX(0deg) rotateY(0deg); }
      to   { transform: rotateX(360deg) rotateY(360deg); }
    }
  `],
})
export class HeroSectionComponent {
  private readonly router = inject(Router);

  navigateToServices(): void {
    this.router.navigate(['/services']);
  }
}
