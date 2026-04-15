import {
  Component, ChangeDetectionStrategy, OnDestroy,
  AfterViewInit, ElementRef, ViewChild, inject, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-16 overflow-hidden">

      <!-- 404 heading -->
      <p class="mb-1 text-sm font-semibold uppercase tracking-widest text-brand-accent">Page not found</p>
      <h1 class="mb-2 text-8xl font-black text-white sm:text-9xl">404</h1>
      <p class="mb-8 text-slate-400 text-center max-w-sm">
        Looks like this page wandered off. Play a game while you're here, then head back home.
      </p>

      <!-- Game canvas -->
      <div class="relative mb-8">
        <canvas
          #gameCanvas
          width="600"
          height="200"
          class="rounded-xl border border-white/10 bg-slate-900 block max-w-full"
          style="image-rendering: pixelated;"
        ></canvas>
        <p class="mt-2 text-center text-xs text-slate-500">
          Press <kbd class="rounded bg-slate-700 px-1.5 py-0.5 text-slate-300">Space</kbd> or
          <kbd class="rounded bg-slate-700 px-1.5 py-0.5 text-slate-300">↑</kbd> to jump
          &nbsp;·&nbsp; tap canvas on mobile
        </p>
      </div>

      <a
        routerLink="/"
        class="inline-flex items-center gap-2 rounded-xl bg-brand-primary/10 px-6 py-3 text-sm font-medium text-brand-accent transition-colors hover:bg-brand-primary/20"
      >
        ← Back to Home
      </a>
    </main>
  `,
})
export class NotFoundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private raf = 0;
  private keys = new Set<string>();

  // ── Game state ──────────────────────────────────────────────────────────────
  private player = { x: 60, y: 140, vy: 0, onGround: false, frame: 0, frameTimer: 0 };
  private obstacles: { x: number; w: number; h: number }[] = [];
  private coins: { x: number; y: number; collected: boolean }[] = [];
  private score = 0;
  private speed = 3;
  private spawnTimer = 0;
  private coinTimer = 0;
  private gameOver = false;
  private started = false;
  private lastTime = 0;

  private readonly GROUND = 160;
  private readonly GRAVITY = 0.6;
  private readonly JUMP = -12;
  private readonly PW = 28;
  private readonly PH = 32;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const canvas = this.canvasRef.nativeElement;

    window.addEventListener('keydown', this.onKey);
    canvas.addEventListener('click', this.onTap);
    canvas.addEventListener('touchstart', this.onTap, { passive: true });

    this.reset();
    this.raf = requestAnimationFrame(this.loop);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('keydown', this.onKey);
    const canvas = this.canvasRef?.nativeElement;
    if (canvas) {
      canvas.removeEventListener('click', this.onTap);
      canvas.removeEventListener('touchstart', this.onTap);
    }
  }

  private onKey = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      this.tryJump();
    }
  };

  private onTap = () => this.tryJump();

  private tryJump(): void {
    if (this.gameOver) { this.reset(); return; }
    if (!this.started) { this.started = true; return; }
    if (this.player.onGround) {
      this.player.vy = this.JUMP;
      this.player.onGround = false;
    }
  }

  private reset(): void {
    this.player = { x: 60, y: this.GROUND - this.PH, vy: 0, onGround: true, frame: 0, frameTimer: 0 };
    this.obstacles = [];
    this.coins = [];
    this.score = 0;
    this.speed = 3;
    this.spawnTimer = 0;
    this.coinTimer = 0;
    this.gameOver = false;
    this.started = false;
  }

  private loop = (ts: number) => {
    const dt = Math.min((ts - this.lastTime) / 16.67, 3);
    this.lastTime = ts;
    this.update(dt);
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    if (!this.started || this.gameOver) return;

    const p = this.player;

    // Physics
    p.vy += this.GRAVITY * dt;
    p.y += p.vy * dt;
    if (p.y >= this.GROUND - this.PH) {
      p.y = this.GROUND - this.PH;
      p.vy = 0;
      p.onGround = true;
    } else {
      p.onGround = false;
    }

    // Walk animation
    if (p.onGround) {
      p.frameTimer += dt;
      if (p.frameTimer > 6) { p.frame = (p.frame + 1) % 2; p.frameTimer = 0; }
    }

    // Speed ramp
    this.speed = 3 + this.score * 0.003;

    // Spawn obstacles
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      const h = 24 + Math.random() * 24;
      this.obstacles.push({ x: 620, w: 20, h });
      this.spawnTimer = 60 + Math.random() * 80;
    }

    // Spawn coins
    this.coinTimer -= dt;
    if (this.coinTimer <= 0) {
      this.coins.push({ x: 620, y: this.GROUND - 60 - Math.random() * 40, collected: false });
      this.coinTimer = 40 + Math.random() * 60;
    }

    // Move obstacles
    for (const obs of this.obstacles) obs.x -= this.speed * dt;
    this.obstacles = this.obstacles.filter(o => o.x > -40);

    // Move coins
    for (const c of this.coins) c.x -= this.speed * dt;
    this.coins = this.coins.filter(c => c.x > -20 && !c.collected);

    // Collision — obstacles
    for (const obs of this.obstacles) {
      const obsY = this.GROUND - obs.h;
      if (
        p.x + this.PW - 4 > obs.x + 2 &&
        p.x + 4 < obs.x + obs.w - 2 &&
        p.y + this.PH > obsY + 4 &&
        p.y < this.GROUND
      ) {
        this.gameOver = true;
        return;
      }
    }

    // Collision — coins
    for (const c of this.coins) {
      if (
        p.x + this.PW > c.x - 8 &&
        p.x < c.x + 8 &&
        p.y < c.y + 8 &&
        p.y + this.PH > c.y - 8
      ) {
        c.collected = true;
        this.score += 10;
      }
    }

    this.score++;
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;

    // Sky
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for (let i = 0; i < 30; i++) {
      const sx = (i * 73 + this.score * 0.2) % W;
      const sy = (i * 37) % (this.GROUND - 20);
      ctx.fillRect(sx, sy, 1, 1);
    }

    // Ground
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, this.GROUND, W, H - this.GROUND);
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, this.GROUND, W, 4);

    // Ground tiles
    ctx.fillStyle = '#475569';
    for (let tx = (-this.score * this.speed * 0.5) % 40; tx < W; tx += 40) {
      ctx.fillRect(tx, this.GROUND + 4, 38, 2);
    }

    // Obstacles (pipes)
    for (const obs of this.obstacles) {
      const obsY = this.GROUND - obs.h;
      // Pipe body
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(obs.x, obsY, obs.w, obs.h);
      // Pipe highlight
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(obs.x + 2, obsY, 4, obs.h);
      // Pipe cap
      ctx.fillStyle = '#15803d';
      ctx.fillRect(obs.x - 3, obsY, obs.w + 6, 10);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(obs.x - 1, obsY, 4, 10);
    }

    // Coins
    for (const c of this.coins) {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(c.x - 2, c.y - 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Player (pixel art character)
    this.drawPlayer(ctx, this.player.x, this.player.y, this.player.frame, this.player.onGround);

    // Score
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText(`Score: ${this.score}`, 10, 20);

    // Speed indicator
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(W - 60, 10, Math.min((this.speed - 3) * 20, 50), 4);
    ctx.strokeStyle = '#4338ca';
    ctx.strokeRect(W - 60, 10, 50, 4);

    if (!this.started && !this.gameOver) {
      ctx.fillStyle = 'rgba(15,23,42,0.7)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Press Space or tap to start', W / 2, H / 2);
      ctx.textAlign = 'left';
    }

    if (this.gameOver) {
      ctx.fillStyle = 'rgba(15,23,42,0.75)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', W / 2, H / 2 - 16);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.fillText(`Score: ${this.score}  ·  Tap or Space to retry`, W / 2, H / 2 + 12);
      ctx.textAlign = 'left';
    }
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, onGround: boolean): void {
    const px = Math.round(x);
    const py = Math.round(y);

    // Body
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(px + 4, py + 12, 20, 16);

    // Head
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(px + 6, py + 2, 16, 12);

    // Hat
    ctx.fillStyle = '#4338ca';
    ctx.fillRect(px + 4, py, 20, 6);
    ctx.fillRect(px + 2, py + 4, 24, 4);

    // Eyes
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 10, py + 5, 3, 3);
    ctx.fillRect(px + 17, py + 5, 3, 3);

    // Mustache
    ctx.fillStyle = '#92400e';
    ctx.fillRect(px + 8, py + 10, 12, 3);

    // Legs (animated)
    ctx.fillStyle = '#1e40af';
    if (!onGround) {
      // Jump pose
      ctx.fillRect(px + 4, py + 28, 8, 4);
      ctx.fillRect(px + 16, py + 24, 8, 8);
    } else if (frame === 0) {
      ctx.fillRect(px + 4, py + 28, 8, 6);
      ctx.fillRect(px + 16, py + 28, 8, 6);
    } else {
      ctx.fillRect(px + 4, py + 26, 8, 8);
      ctx.fillRect(px + 16, py + 30, 8, 4);
    }

    // Shoes
    ctx.fillStyle = '#7c2d12';
    if (!onGround) {
      ctx.fillRect(px + 2, py + 30, 10, 4);
      ctx.fillRect(px + 16, py + 30, 10, 4);
    } else if (frame === 0) {
      ctx.fillRect(px + 2, py + 32, 10, 4);
      ctx.fillRect(px + 16, py + 32, 10, 4);
    } else {
      ctx.fillRect(px + 2, py + 32, 10, 4);
      ctx.fillRect(px + 16, py + 32, 10, 4);
    }

    // Arms
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(px, py + 14, 6, 8);
    ctx.fillRect(px + 22, py + 14, 6, 8);
  }
}
