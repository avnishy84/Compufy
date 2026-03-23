import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, signal } from '@angular/core';
import { scrollReveal } from '../../shared/animations/animations';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scrollReveal],
  template: `
    <section
      class="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-6"
      [@scrollReveal]
    >
      <!-- Background gradient blobs (same as hero) -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/10 blur-3xl"></div>
        <div class="absolute right-1/4 bottom-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-brand-secondary/10 blur-3xl"></div>
        <div class="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/5 blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col items-center gap-10 text-center">

        <!-- Rotating cube (same as hero) -->
        <div class="tech-cube" aria-hidden="true">
          <div class="face front"></div>
          <div class="face back"></div>
          <div class="face left"></div>
          <div class="face right"></div>
          <div class="face top"></div>
          <div class="face bottom"></div>
        </div>

        <!-- Brand name -->
        <div>
          <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-accent">
            Compufy Technology
          </p>
          <h1 class="text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
            Something
            <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              Exciting
            </span>
            <br />is Coming
          </h1>
          <p class="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            We're crafting the next generation of smart technology solutions.
            Stay tuned — it'll be worth the wait.
          </p>
        </div>

        <!-- Countdown -->
        <div class="flex gap-4 sm:gap-6">
          @for (unit of countdown(); track unit.label) {
            <div class="flex flex-col items-center rounded-xl border border-white/10 bg-surface-glass px-5 py-4 backdrop-blur-glass">
              <span class="text-3xl font-bold text-white sm:text-4xl">{{ unit.value }}</span>
              <span class="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">{{ unit.label }}</span>
            </div>
          }
        </div>

        <!-- Divider -->
        <div class="h-px w-48 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent"></div>

        <!-- Notify CTA -->
        <p class="text-sm text-slate-500">
          Questions? Reach us at
          <a
            href="mailto:compufykanpur&#64;gmail.com"
            class="text-brand-accent underline-offset-4 hover:underline"
          >compufykanpur&#64;gmail.com</a>
        </p>
      </div>
    </section>
  `,
  styles: [`
    .tech-cube {
      width: 80px;
      height: 80px;
      position: relative;
      transform-style: preserve-3d;
      animation: rotateCube 8s linear infinite;
    }
    .face {
      position: absolute;
      width: 80px;
      height: 80px;
      border: 2px solid rgba(99, 102, 241, 0.6);
      background: rgba(99, 102, 241, 0.05);
      backdrop-filter: blur(4px);
    }
    .front  { transform: translateZ(40px); }
    .back   { transform: rotateY(180deg) translateZ(40px); }
    .left   { transform: rotateY(-90deg) translateZ(40px); }
    .right  { transform: rotateY(90deg) translateZ(40px); }
    .top    { transform: rotateX(90deg) translateZ(40px); }
    .bottom { transform: rotateX(-90deg) translateZ(40px); }
    @keyframes rotateCube {
      from { transform: rotateX(0deg) rotateY(0deg); }
      to   { transform: rotateX(360deg) rotateY(360deg); }
    }
  `],
})
export class ComingSoonComponent implements OnInit, OnDestroy {
  private readonly launchDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly countdown = signal(this.getCountdown());

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.countdown.set(this.getCountdown());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private getCountdown(): { label: string; value: string }[] {
    const diff = Math.max(0, this.launchDate.getTime() - Date.now());
    const days    = Math.floor(diff / 86_400_000);
    const hours   = Math.floor((diff % 86_400_000) / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1_000);
    const pad = (n: number) => String(n).padStart(2, '0');
    return [
      { label: 'Days',    value: String(days) },
      { label: 'Hours',   value: pad(hours) },
      { label: 'Minutes', value: pad(minutes) },
      { label: 'Seconds', value: pad(seconds) },
    ];
  }
}
