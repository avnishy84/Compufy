import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, signal } from '@angular/core';
import { scrollReveal } from '../../shared/animations/animations';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scrollReveal],
  template: `
    <section
      class="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-surface px-4 py-12 sm:px-6"
      [@scrollReveal]
    >
      <!-- Background gradient blobs -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute left-1/4 top-1/4 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/10 blur-3xl sm:h-96 sm:w-96"></div>
        <div class="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-brand-secondary/10 blur-3xl sm:h-96 sm:w-96"></div>
      </div>

      <div class="relative z-10 flex w-full max-w-lg flex-col items-center gap-6 text-center sm:gap-10">

        <!-- Rotating cube -->
        <div class="tech-cube" aria-hidden="true">
          <div class="face front"></div>
          <div class="face back"></div>
          <div class="face left"></div>
          <div class="face right"></div>
          <div class="face top"></div>
          <div class="face bottom"></div>
        </div>

        <!-- Brand + headline -->
        <div class="space-y-3">
          <p class="text-xs font-semibold uppercase tracking-widest text-brand-accent sm:text-sm">
            Compufy Technology
          </p>
          <h1 class="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Something
            <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              Exciting
            </span>
            <br />is Coming
          </h1>
          <p class="mx-auto max-w-sm text-base text-slate-400 sm:text-lg">
            We're crafting the next generation of smart technology solutions.
            Stay tuned — it'll be worth the wait.
          </p>
        </div>

        <!-- Countdown -->
        <div class="grid w-full grid-cols-4 gap-2 sm:gap-4">
          @for (unit of countdown(); track unit.label) {
            <div class="flex flex-col items-center rounded-xl border border-white/10 bg-surface-glass py-3 backdrop-blur-glass sm:py-4">
              <span class="text-2xl font-bold tabular-nums text-white sm:text-3xl">{{ unit.value }}</span>
              <span class="mt-1 text-[10px] font-medium uppercase tracking-widest text-slate-400 sm:text-xs">{{ unit.label }}</span>
            </div>
          }
        </div>

        <!-- Divider -->
        <div class="h-px w-32 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent sm:w-48"></div>

        <!-- Contact -->
        <p class="text-xs text-slate-500 sm:text-sm">
          Questions? Reach us at
          <a
            href="mailto:compufykanpur&#64;gmail.com"
            class="block text-brand-accent underline-offset-4 hover:underline sm:inline"
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
