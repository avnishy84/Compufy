import {
  Component, ChangeDetectionStrategy, OnDestroy,
  AfterViewInit, ElementRef, ViewChild, inject, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

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

  private readonly isBrowser: boolean;
  private raf = 0;

  // ── Game state ──────────────────────────────────────────────────────────────
  private player = { x: 60, y: 140, vy: 0, onGround: false, frame: 0, frameTimer: 0, scaleY: 1 };
  private obstacles: { x: number; w: number; h: number }[] = [];
  private coins: { x: number; y: number; collected: boolean, anim: number }[] = [];
  private mountains: { x: number; y: number; w: number; h: number }[] = [];
  private particles: Particle[] = [];
  private scorePopups: { x: number; y: number; text: string; life: number }[] = [];

  private score = 0;
  private highScore = 0;
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

  constructor() {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const canvas = this.canvasRef.nativeElement;
    this.highScore = parseInt(localStorage.getItem('dino-hs') ?? '0', 10);

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
      this.player.scaleY = 1.2;
      this.spawnParticles(this.player.x + this.PW / 2, this.GROUND, 5, '#cbd5e1', -Math.PI / 2, Math.PI / 4);
    }
  }

  private reset(): void {
    if (this.isBrowser && this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('dino-hs', String(this.highScore));
    }
    this.player = { x: 60, y: this.GROUND - this.PH, vy: 0, onGround: true, frame: 0, frameTimer: 0, scaleY: 1 };
    this.obstacles = [];
    this.coins = [];
    this.particles = [];
    this.scorePopups = [];
    this.score = 0;
    this.speed = 3;
    this.spawnTimer = 0;
    this.coinTimer = 0;
    this.gameOver = false;
    this.started = false;

    // Init mountains
    this.mountains = [];
    for (let i = 0; i < 10; i++) {
      const w = 100 + Math.random() * 150;
      const h = 40 + Math.random() * 50;
      this.mountains.push({ x: i * 250, y: this.GROUND - h, w, h });
    }
  }

  private loop = (ts: number) => {
    if (!this.isBrowser) return;
    const dt = Math.min((ts - this.lastTime) / 16.67, 3);
    this.lastTime = ts;
    this.update(dt);
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  private spawnParticles(x: number, y: number, count: number, color: string, angle: number, spread: number) {
    for (let i = 0; i < count; i++) {
      const a = angle + (Math.random() - 0.5) * spread;
      const v = 2 + Math.random() * 2;
      this.particles.push({
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        life: 20 + Math.random() * 20,
        color,
      });
    }
  }

  private update(dt: number): void {
    if (!this.started || this.gameOver) return;

    const p = this.player;

    // Squash & stretch
    p.scaleY += (1 - p.scaleY) * 0.2 * dt;

    // Physics
    p.vy += this.GRAVITY * dt;
    p.y += p.vy * dt;
    if (p.y >= this.GROUND - this.PH) {
      p.y = this.GROUND - this.PH;
      p.vy = 0;
      if (!p.onGround) { // Just landed
        this.spawnParticles(p.x + this.PW / 2, this.GROUND, 8, '#cbd5e1', -Math.PI / 2, Math.PI / 3);
        p.scaleY = 0.8;
      }
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
      this.coins.push({ x: 620, y: this.GROUND - 60 - Math.random() * 40, collected: false, anim: 0 });
      this.coinTimer = 40 + Math.random() * 60;
    }

    // Move mountains (parallax)
    for (const m of this.mountains) m.x -= this.speed * 0.2 * dt;
    if (this.mountains.length > 0 && this.mountains[0].x < -this.mountains[0].w) {
      const last = this.mountains[this.mountains.length - 1];
      this.mountains.shift();
      const w = 100 + Math.random() * 150;
      const h = 40 + Math.random() * 50;
      this.mountains.push({ x: last.x + 250, y: this.GROUND - h, w, h });
    }

    // Move obstacles
    for (const obs of this.obstacles) obs.x -= this.speed * dt;
    this.obstacles = this.obstacles.filter(o => o.x > -40);

    // Move coins
    for (const c of this.coins) {
      c.x -= this.speed * dt;
      if (c.collected) c.anim += dt;
    }
    this.coins = this.coins.filter(c => c.x > -20 && c.anim < 20);

    // Update particles
    for (const part of this.particles) {
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.life -= dt;
    }
    this.particles = this.particles.filter(p => p.life > 0);

    // Update score popups
    for (const pop of this.scorePopups) {
      pop.y -= 0.5 * dt;
      pop.life -= dt;
    }
    this.scorePopups = this.scorePopups.filter(p => p.life > 0);

    // Collision — obstacles
    for (const obs of this.obstacles) {
      const obsY = this.GROUND - obs.h;
      if (
        p.x + this.PW - 8 > obs.x &&
        p.x + 8 < obs.x + obs.w &&
        p.y + this.PH > obsY &&
        p.y < this.GROUND
      ) {
        this.gameOver = true;
        this.spawnParticles(p.x + this.PW / 2, p.y + this.PH / 2, 20, '#f87171', 0, Math.PI * 2);
        return;
      }
    }

    // Collision — coins
    for (const c of this.coins) {
      if (!c.collected) {
        const dist = Math.hypot(p.x + this.PW / 2 - c.x, p.y + this.PH / 2 - c.y);
        if (dist < 20) {
          c.collected = true;
          this.score += 10;
          this.scorePopups.push({ x: c.x, y: c.y, text: '+10', life: 30 });
          this.spawnParticles(c.x, c.y, 10, '#fbbf24', 0, Math.PI * 2);
        }
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

    // Mountains
    ctx.fillStyle = '#1e293b';
    for (const m of this.mountains) {
      ctx.beginPath();
      ctx.moveTo(m.x, this.GROUND);
      ctx.lineTo(m.x + m.w / 2, m.y);
      ctx.lineTo(m.x + m.w, this.GROUND);
      ctx.fill();
    }

    // Ground
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, this.GROUND, W, H - this.GROUND);
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, this.GROUND, W, 4);

    // Ground tiles
    ctx.fillStyle = '#64748b';
    for (let tx = (-this.score * this.speed * 0.5) % 40; tx < W; tx += 40) {
      ctx.fillRect(tx, this.GROUND + 4, 38, 2);
    }

    // Obstacles (pipes)
    for (const obs of this.obstacles) {
      const obsY = this.GROUND - obs.h;
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(obs.x, obsY, obs.w, obs.h);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(obs.x + 2, obsY, 4, obs.h);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(obs.x - 3, obsY, obs.w + 6, 10);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(obs.x - 1, obsY, 4, 10);
    }

    // Coins
    for (const c of this.coins) {
      if (c.collected) {
        ctx.globalAlpha = Math.max(0, 1 - c.anim / 20);
      }
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(c.x, c.y + Math.sin(c.x / 20) * 3, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(c.x - 2, c.y - 2 + Math.sin(c.x / 20) * 3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Particles
    for (const p of this.particles) {
      ctx.globalAlpha = p.life / 40;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      ctx.globalAlpha = 1;
    }

    // Player (pixel art character)
    this.drawPlayer(ctx, this.player.x, this.player.y, this.player.frame, this.player.onGround, this.player.scaleY);

    // Score Popups
    for (const pop of this.scorePopups) {
      ctx.globalAlpha = pop.life / 30;
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.globalAlpha = 1;
    }

    // Score
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText(`Score: ${this.score}`, 10, 20);
    ctx.fillText(`Hi: ${this.highScore}`, 10, 34);

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
      ctx.fillText('Game Over!', W / 2, H / 2 - 24);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.fillText(`Score: ${this.score}`, W / 2, H / 2);
      ctx.fillText(`High Score: ${this.highScore}`, W / 2, H / 2 + 20);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`Tap or Space to retry`, W / 2, H / 2 + 48);
      ctx.textAlign = 'left';
    }
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, onGround: boolean, scaleY: number): void {
    const px = Math.round(x);
    const py = Math.round(y);
    const h = this.PH * scaleY;
    const yOff = this.PH - h;

    ctx.save();
    ctx.translate(px, py + yOff);

    // Body
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(4, 12, 20, 16 * scaleY);

    // Head
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(6, 2, 16, 12);

    // Hat
    ctx.fillStyle = '#4338ca';
    ctx.fillRect(4, 0, 20, 6);
    ctx.fillRect(2, 4, 24, 4);

    // Eyes
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(10, 5, 3, 3);
    ctx.fillRect(17, 5, 3, 3);

    // Mustache
    ctx.fillStyle = '#92400e';
    ctx.fillRect(8, 10, 12, 3);

    // Legs (animated)
    ctx.fillStyle = '#1e40af';
    const legY = 12 + 16 * scaleY;
    if (!onGround) {
      ctx.fillRect(4, legY, 8, 4);
      ctx.fillRect(16, legY - 4, 8, 8);
    } else if (frame === 0) {
      ctx.fillRect(4, legY, 8, 6);
      ctx.fillRect(16, legY, 8, 6);
    } else {
      ctx.fillRect(4, legY - 2, 8, 8);
      ctx.fillRect(16, legY + 2, 8, 4);
    }

    // Shoes
    ctx.fillStyle = '#7c2d12';
    const shoeY = legY + 4;
    if (!onGround) {
      ctx.fillRect(2, shoeY - 2, 10, 4);
      ctx.fillRect(16, shoeY - 2, 10, 4);
    } else {
      ctx.fillRect(2, shoeY, 10, 4);
      ctx.fillRect(16, shoeY, 10, 4);
    }

    // Arms
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(0, 14, 6, 8);
    ctx.fillRect(22, 14, 6, 8);

    ctx.restore();
  }
}
