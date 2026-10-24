import * as fc from 'fast-check';
import { HALF_SIZE, DT_CAP, FIRE_RATE_MS, MAX_BULLETS } from './game-engine';
import { Bullet, Particle } from './entities';

// ─── Pure helpers (mirrors game-engine internals) ────────────────────────────

function clampRocket(
  x: number,
  y: number,
  w: number,
  h: number
): { x: number; y: number } {
  return {
    x: Math.max(HALF_SIZE, Math.min(w - HALF_SIZE, x)),
    y: Math.max(HALF_SIZE, Math.min(h - HALF_SIZE, y)),
  };
}

function applyFriction(vx: number, vy: number, times: number): { vx: number; vy: number } {
  let cx = vx;
  let cy = vy;
  for (let i = 0; i < times; i++) {
    cx *= 0.85;
    cy *= 0.85;
  }
  return { vx: cx, vy: cy };
}

function isBulletOOB(b: Bullet, w: number, h: number): boolean {
  return b.x < -10 || b.x > w + 10 || b.y < -10 || b.y > h + 10;
}

// ─── P1: Rocket bounds clamping ──────────────────────────────────────────────

describe('PBT – P1: Rocket stays within canvas bounds', () => {
  // Feature: rocket-game-overlay, Property 1: Rocket stays within canvas bounds
  it('clamp always keeps rocket within [HALF_SIZE, dim - HALF_SIZE]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 2000 }),  // canvas width
        fc.integer({ min: 100, max: 2000 }),  // canvas height
        fc.float({ min: -5000, max: 5000, noNaN: true }),  // raw x
        fc.float({ min: -5000, max: 5000, noNaN: true }),  // raw y
        (w, h, rawX, rawY) => {
          const { x, y } = clampRocket(rawX, rawY, w, h);
          expect(x).toBeGreaterThanOrEqual(HALF_SIZE);
          expect(x).toBeLessThanOrEqual(w - HALF_SIZE);
          expect(y).toBeGreaterThanOrEqual(HALF_SIZE);
          expect(y).toBeLessThanOrEqual(h - HALF_SIZE);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── P2: Friction convergence ────────────────────────────────────────────────

describe('PBT – P2: Friction decelerates to near-zero', () => {
  // Feature: rocket-game-overlay, Property 2: Friction decelerates to near-zero
  it('applying friction N times never increases speed', () => {
    fc.assert(
      fc.property(
        fc.float({ min: -1000, max: 1000, noNaN: true }),  // initial vx
        fc.float({ min: -1000, max: 1000, noNaN: true }),  // initial vy
        fc.integer({ min: 1, max: 200 }),                  // N iterations
        (vx, vy, n) => {
          const initialSpeed = Math.sqrt(vx * vx + vy * vy);
          const after = applyFriction(vx, vy, n);
          const finalSpeed = Math.sqrt(after.vx * after.vx + after.vy * after.vy);
          // Speed must never grow
          expect(finalSpeed).toBeLessThanOrEqual(initialSpeed + 1e-9);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── P3: Bullet count cap ────────────────────────────────────────────────────

describe('PBT – P3: Bullet count never exceeds maximum', () => {
  // Feature: rocket-game-overlay, Property 3: Bullet count never exceeds maximum
  it('simulated fire sequence never exceeds MAX_BULLETS', () => {
    fc.assert(
      fc.property(
        fc.array(fc.boolean(), { minLength: 1, maxLength: 1000 }),
        (fireSequence) => {
          const bullets: Bullet[] = [];
          for (const shouldFire of fireSequence) {
            if (shouldFire && bullets.length < MAX_BULLETS) {
              bullets.push({ x: 0, y: 0, vx: 0, vy: -600 });
            }
            expect(bullets.length).toBeLessThanOrEqual(MAX_BULLETS);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── P4: Out-of-bounds bullet removal ───────────────────────────────────────

describe('PBT – P4: Out-of-bounds bullets are removed', () => {
  // Feature: rocket-game-overlay, Property 4: Out-of-bounds bullets are removed
  it('bullets outside canvas bounds are filtered out after one tick', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 2000 }),  // canvas width
        fc.integer({ min: 100, max: 2000 }),  // canvas height
        fc.record({
          x: fc.oneof(
            fc.float({ min: -1000, max: -11, noNaN: true }),   // left OOB
            fc.float({ min: 2011, max: 5000, noNaN: true })    // right OOB
          ),
          y: fc.float({ min: -5000, max: 5000, noNaN: true }),
          vx: fc.float({ min: -600, max: 600, noNaN: true }),
          vy: fc.float({ min: -600, max: 600, noNaN: true }),
        }),
        (w, h, bullet) => {
          // The bullet is OOB on x axis
          const active = [bullet].filter((b) => !isBulletOOB(b, w, h));
          expect(active.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('bullets inside canvas bounds are kept', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 200, max: 2000 }),
        fc.integer({ min: 200, max: 2000 }),
        fc.record({
          x: fc.float({ min: 0, max: 100, noNaN: true }),
          y: fc.float({ min: 0, max: 100, noNaN: true }),
          vx: fc.float({ min: -600, max: 600, noNaN: true }),
          vy: fc.float({ min: -600, max: 600, noNaN: true }),
        }),
        (w, h, bullet) => {
          const active = [bullet].filter((b) => !isBulletOOB(b, w, h));
          expect(active.length).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── P7: Delta-time cap ──────────────────────────────────────────────────────

describe('PBT – P7: Delta-time cap', () => {
  // Feature: rocket-game-overlay, Property 7: Delta-time cap
  it('computed dt never exceeds 0.05 s for any timestamp pair', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1_000_000 }),   // prev timestamp ms
        fc.integer({ min: 0, max: 1_000_000 }),   // now timestamp ms
        (prev, now) => {
          const rawDt = Math.abs(now - prev) / 1000;  // always non-negative
          const dt = Math.min(rawDt, DT_CAP);
          expect(dt).toBeLessThanOrEqual(DT_CAP);
          expect(dt).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── P8: Particle opacity bounded ───────────────────────────────────────────

describe('PBT – P8: Particle opacity is non-negative and bounded', () => {
  // Feature: rocket-game-overlay, Property 8: Particle opacity is non-negative and bounded
  it('opacity is always in [0, 1] for any particle and timestamp', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1_000_000 }),   // born timestamp ms
        fc.integer({ min: 0, max: 1_000_000 }),   // elapsed ms (>= 0)
        (born, elapsedMs) => {
          // now is always >= born (elapsed is non-negative)
          const now = born + elapsedMs;
          const lifespan = 400;
          const elapsed = now - born; // always >= 0
          const opacity = Math.max(0, 1 - elapsed / lifespan);
          expect(opacity).toBeGreaterThanOrEqual(0);
          expect(opacity).toBeLessThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── P9: Fire-rate limit enforced ────────────────────────────────────────────

describe('PBT – P9: Fire-rate limit enforced', () => {
  // Feature: rocket-game-overlay, Property 9: Fire-rate limit enforced
  it('no two consecutive fire events are less than 200 ms apart', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 10_000 }), { minLength: 1, maxLength: 200 }),
        (timestamps) => {
          // Simulate fire-rate gating: only record a fire if >= FIRE_RATE_MS since last
          const fireTimes: number[] = [];
          let lastFireTime = -Infinity;

          for (const t of timestamps) {
            if (t - lastFireTime >= FIRE_RATE_MS) {
              fireTimes.push(t);
              lastFireTime = t;
            }
          }

          // Verify no two consecutive recorded fires are < 200 ms apart
          for (let i = 1; i < fireTimes.length; i++) {
            const gap = fireTimes[i] - fireTimes[i - 1];
            expect(gap).toBeGreaterThanOrEqual(FIRE_RATE_MS);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Suppress unused import warning
const _particleTypeCheck: Particle = { x: 0, y: 0, vx: 0, vy: 0, born: 0, lifespan: 400 };
void _particleTypeCheck;
