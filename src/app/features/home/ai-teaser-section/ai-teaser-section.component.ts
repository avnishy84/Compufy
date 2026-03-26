import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ai-teaser-section',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative overflow-hidden bg-surface py-24 px-6">

      <!-- Section background blobs -->
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-brand-accent/5 blur-3xl"></div>
        <div class="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-brand-primary/8 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-6xl">

        <!-- Two-column layout: text left, canvas right -->
        <div class="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">

          <!-- ── Left: copy ── -->
          <div class="flex-1 text-center lg:text-left">
            <span class="mb-4 inline-block rounded-full border border-brand-accent/30 bg-brand-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-accent">
              AI-Powered Engineering
            </span>
            <h2 class="mb-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              We Build with
              <span class="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent"> Neural Intelligence</span>
            </h2>
            <p class="mb-8 max-w-xl text-base leading-relaxed text-slate-400">
              AI agents and neural networks are woven into every phase of our workflow — from requirements analysis and code generation to automated testing and production monitoring. The result: faster delivery, fewer bugs, and software that scales.
            </p>

            <!-- Feature pills -->
            <div class="mb-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              @for (pill of pills; track pill) {
                <span class="rounded-full border border-brand-accent/20 bg-brand-accent/5 px-3 py-1 text-xs font-medium text-brand-accent">
                  {{ pill }}
                </span>
              }
            </div>

            <a routerLink="/ai-approach"
               class="inline-flex items-center gap-2 rounded-xl border border-brand-accent/30 bg-brand-accent/10 px-6 py-3 text-sm font-semibold text-brand-accent transition-all hover:bg-brand-accent/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              Explore Our AI Approach
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>

          <!-- ── Right: live neural canvas ── -->
          <div class="relative w-full max-w-md shrink-0 lg:w-[420px]">
            <!-- Glow ring behind canvas -->
            <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-accent/10 to-brand-primary/10 blur-2xl" aria-hidden="true"></div>

            <div class="relative rounded-3xl border border-white/10 bg-surface-card overflow-hidden" style="height:360px;">
              <canvas #aiCanvas style="position:absolute;top:0;left:0;width:100%;height:100%;" aria-hidden="true"></canvas>

              <!-- Overlay label -->
              <div class="absolute bottom-4 left-0 right-0 flex justify-center">
                <span class="rounded-full border border-brand-accent/20 bg-surface/80 px-3 py-1 text-xs text-brand-accent backdrop-blur-sm">
                  Live neural network simulation
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class AiTeaserSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('aiCanvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private animId = 0;
  private frame = 0;
  private nodes: Array<{ x: number; y: number; vx: number; vy: number; r: number; p: number; ps: number }> = [];

  readonly pills = ['LLM Code Agents', 'Auto Test Gen', 'CI Neural Review', 'Anomaly Detection', 'Sprint AI'];

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement!;

    const sync = () => {
      canvas.width  = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    sync();

    this.nodes = Array.from({ length: 32 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r:  1.8 + Math.random() * 2,
      p:  Math.random() * Math.PI * 2,
      ps: 0.02 + Math.random() * 0.025,
    }));

    window.addEventListener('resize', sync);
    this.loop(canvas.getContext('2d')!, canvas);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
  }

  private loop(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const MAX = 130;
    const tick = () => {
      this.animId = requestAnimationFrame(tick);
      const { width: W, height: H } = canvas;
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);
      this.frame++;

      for (const n of this.nodes) {
        n.x += n.vx; n.y += n.vy; n.p += n.ps;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      // Edges
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const a = this.nodes[i], b = this.nodes[j];
          const d = Math.hypot(b.x - a.x, b.y - a.y);
          if (d < MAX) {
            const alpha = (1 - d / MAX) * 0.3;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const n of this.nodes) {
        const glow = 0.55 + 0.45 * Math.sin(n.p);
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5 * glow);
        g.addColorStop(0, `rgba(34,211,238,${0.55 * glow})`);
        g.addColorStop(1, 'rgba(34,211,238,0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5 * glow, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * glow, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${0.9 * glow})`;
        ctx.fill();
      }

      // Signal pulse every 55 frames
      if (this.frame % 55 === 0) {
        const pairs: Array<[typeof this.nodes[0], typeof this.nodes[0]]> = [];
        for (let i = 0; i < this.nodes.length; i++) {
          for (let j = i + 1; j < this.nodes.length; j++) {
            if (Math.hypot(this.nodes[j].x - this.nodes[i].x, this.nodes[j].y - this.nodes[i].y) < MAX) {
              pairs.push([this.nodes[i], this.nodes[j]]);
            }
          }
        }
        if (pairs.length) {
          const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
          let t = 0;
          const pulse = () => {
            t += 0.045;
            if (t > 1) return;
            requestAnimationFrame(pulse);
            ctx.beginPath();
            ctx.arc(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(99,102,241,0.95)';
            ctx.fill();
          };
          pulse();
        }
      }
    };
    tick();
  }
}
