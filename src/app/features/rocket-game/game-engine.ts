import { Bullet, GameState, Particle, Rocket, TargetEntry } from './entities';
import { InputHandler } from './input-handler';
import { runCollisions } from './collision-handler';
import { renderFrame } from './renderer';
import { refreshRects } from './target-cache';

const ACCEL = 800;       // px/s²
const FRICTION = 0.85;
const HALF_SIZE = 15;
const MAX_BULLETS = 20;
const FIRE_RATE_MS = 200;
const BULLET_SPEED = 600;
const PARTICLE_COUNT = 8;
const PARTICLE_LIFESPAN = 400;
const BREAK_FALLBACK_MS = 700;
const DT_CAP = 0.05;

export { HALF_SIZE, DT_CAP, FIRE_RATE_MS, MAX_BULLETS };

export class GameEngine {
  private ctx: CanvasRenderingContext2D | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private inputHandler: InputHandler | null = null;
  private targetCache: TargetEntry[] = [];

  private state: GameState | null = null;
  private rafId: number | null = null;
  private lastTime = 0;
  private lastFireTime = 0;
  private spawnX: number | null = null;
  private spawnY: number | null = null;

  /** Set rocket spawn position before calling start(). */
  spawnAt(x: number, y: number): void {
    this.spawnX = x;
    this.spawnY = y;
  }

  start(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    inputHandler: InputHandler,
    targetCache: TargetEntry[]
  ): void {
    this.ctx = ctx;
    this.canvas = canvas;
    this.inputHandler = inputHandler;
    this.targetCache = targetCache;

    const spawnX = this.spawnX ?? canvas.width / 2;
    const spawnY = this.spawnY ?? canvas.height / 2;

    const rocket: Rocket = {
      x: spawnX,
      y: spawnY,
      vx: 0,
      vy: 0,
      angle: 0,
    };

    this.state = {
      rocket,
      bullets: [],
      particles: [],
    };

    this.lastFireTime = 0;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  getState(): GameState | null {
    return this.state;
  }

  private loop(now: number): void {
    if (!this.state || !this.ctx || !this.canvas || !this.inputHandler) return;

    const rawDt = (now - this.lastTime) / 1000;
    const dt = Math.min(rawDt, DT_CAP);
    this.lastTime = now;

    const input = this.inputHandler.getState();
    const { rocket, bullets, particles } = this.state;

    // --- Rocket movement ---
    if (input.up)    rocket.vy -= ACCEL * dt;
    if (input.down)  rocket.vy += ACCEL * dt;
    if (input.left)  rocket.vx -= ACCEL * dt;
    if (input.right) rocket.vx += ACCEL * dt;

    const anyKey = input.up || input.down || input.left || input.right;
    if (!anyKey) {
      rocket.vx *= FRICTION;
      rocket.vy *= FRICTION;
    }

    rocket.x += rocket.vx * dt;
    rocket.y += rocket.vy * dt;

    const speed = Math.sqrt(rocket.vx * rocket.vx + rocket.vy * rocket.vy);
    if (speed > 0.5) {
      rocket.angle = Math.atan2(rocket.vx, -rocket.vy);
    }

    // Boundary clamping — horizontal stays hard-clamped
    rocket.x = Math.max(HALF_SIZE, Math.min(this.canvas.width - HALF_SIZE, rocket.x));

    // Vertical: auto-scroll the page when rocket reaches top/bottom edge zone
    const SCROLL_ZONE = 60; // px from edge that triggers scrolling
    if (rocket.y < SCROLL_ZONE && rocket.vy < 0) {
      // Scroll speed proportional to rocket velocity — slow rocket = slow scroll
      const speed = Math.abs(rocket.vy);
      const scrollAmount = -(speed * dt * (speed / 200));
      window.scrollBy({ top: scrollAmount, behavior: 'instant' });
      rocket.y = Math.max(HALF_SIZE, rocket.y);
    } else if (rocket.y > this.canvas.height - SCROLL_ZONE && rocket.vy > 0) {
      const speed = Math.abs(rocket.vy);
      const scrollAmount = speed * dt * (speed / 200);
      window.scrollBy({ top: scrollAmount, behavior: 'instant' });
      rocket.y = Math.min(this.canvas.height - HALF_SIZE, rocket.y);
    } else {
      rocket.y = Math.max(HALF_SIZE, Math.min(this.canvas.height - HALF_SIZE, rocket.y));
    }

    // --- Bullet movement + OOB removal ---
    for (const b of bullets) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
    }

    const w = this.canvas.width;
    const h = this.canvas.height;
    this.state.bullets = bullets.filter(
      (b) => b.x >= -10 && b.x <= w + 10 && b.y >= -10 && b.y <= h + 10
    );

    // --- Bullet creation ---
    if (
      input.fire &&
      now - this.lastFireTime >= FIRE_RATE_MS &&
      this.state.bullets.length < MAX_BULLETS
    ) {
      const newBullet: Bullet = {
        x: rocket.x + Math.sin(rocket.angle) * HALF_SIZE,
        y: rocket.y - Math.cos(rocket.angle) * HALF_SIZE,
        vx: Math.sin(rocket.angle) * BULLET_SPEED,
        vy: -Math.cos(rocket.angle) * BULLET_SPEED,
      };
      this.state.bullets.push(newBullet);
      this.lastFireTime = now;
    }

    // --- Particle movement + expiry removal ---
    for (const p of particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    this.state.particles = particles.filter(
      (p) => now - p.born < p.lifespan
    );

    // --- Refresh target rects each frame to account for scroll/layout changes ---
    refreshRects(this.targetCache);

    // --- Collisions ---
    const result = runCollisions(this.state, this.targetCache);

    // Remove collided bullets
    if (result.bulletsToRemove.size > 0) {
      this.state.bullets = this.state.bullets.filter(
        (_, i) => !result.bulletsToRemove.has(i)
      );
    }

    // Handle destroyed targets
    for (const ti of result.destroyedIndices) {
      const entry = this.targetCache[ti];
      const rect = entry.rect;
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;

      // Spawn particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const newParticle: Particle = {
          x: targetCenterX,
          y: targetCenterY,
          vx: (Math.random() - 0.5) * 300,
          vy: (Math.random() - 0.5) * 300,
          born: now,
          lifespan: PARTICLE_LIFESPAN,
        };
        this.state.particles.push(newParticle);
      }

      // Break animation
      const el = entry.element as HTMLElement;
      el.classList.add('target-breaking');
      const cleanup = (): void => {
        el.style.visibility = 'hidden';
        el.removeEventListener('transitionend', cleanup);
      };
      el.addEventListener('transitionend', cleanup);
      setTimeout(() => {
        el.style.visibility = 'hidden';
        el.removeEventListener('transitionend', cleanup);
      }, BREAK_FALLBACK_MS);
    }

    // --- Render ---
    renderFrame(this.ctx, this.state, now);

    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }
}
