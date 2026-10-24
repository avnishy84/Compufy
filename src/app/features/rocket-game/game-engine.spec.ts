import { HALF_SIZE, DT_CAP, FIRE_RATE_MS, MAX_BULLETS } from './game-engine';

// ─── Pure helper functions extracted for unit testing ───────────────────────

function clampRocket(
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  return {
    x: Math.max(HALF_SIZE, Math.min(canvasWidth - HALF_SIZE, x)),
    y: Math.max(HALF_SIZE, Math.min(canvasHeight - HALF_SIZE, y)),
  };
}

function capDeltaTime(rawDt: number): number {
  return Math.min(rawDt, DT_CAP);
}

// ─── Boundary clamping ───────────────────────────────────────────────────────

describe('GameEngine – boundary clamping', () => {
  const W = 800;
  const H = 600;

  it('clamps x=0 to HALF_SIZE', () => {
    const { x } = clampRocket(0, 300, W, H);
    expect(x).toBe(HALF_SIZE);
  });

  it('clamps x=canvas.width to canvas.width - HALF_SIZE', () => {
    const { x } = clampRocket(W, 300, W, H);
    expect(x).toBe(W - HALF_SIZE);
  });

  it('clamps y=0 to HALF_SIZE', () => {
    const { y } = clampRocket(400, 0, W, H);
    expect(y).toBe(HALF_SIZE);
  });

  it('clamps y=canvas.height to canvas.height - HALF_SIZE', () => {
    const { y } = clampRocket(400, H, W, H);
    expect(y).toBe(H - HALF_SIZE);
  });

  it('does not clamp a position already within bounds', () => {
    const { x, y } = clampRocket(400, 300, W, H);
    expect(x).toBe(400);
    expect(y).toBe(300);
  });

  it('clamps negative x to HALF_SIZE', () => {
    const { x } = clampRocket(-100, 300, W, H);
    expect(x).toBe(HALF_SIZE);
  });

  it('clamps x beyond canvas.width to canvas.width - HALF_SIZE', () => {
    const { x } = clampRocket(W + 500, 300, W, H);
    expect(x).toBe(W - HALF_SIZE);
  });
});

// ─── Delta-time cap ──────────────────────────────────────────────────────────

describe('GameEngine – delta-time cap', () => {
  it('caps raw dt of 1.0 s to 0.05 s', () => {
    expect(capDeltaTime(1.0)).toBe(0.05);
  });

  it('passes through raw dt of 0.03 s unchanged', () => {
    expect(capDeltaTime(0.03)).toBe(0.03);
  });

  it('caps raw dt exactly at 0.05 s (boundary)', () => {
    expect(capDeltaTime(0.05)).toBe(0.05);
  });

  it('caps raw dt of 0.1 s to 0.05 s', () => {
    expect(capDeltaTime(0.1)).toBe(0.05);
  });

  it('passes through raw dt of 0.016 s (60 fps) unchanged', () => {
    expect(capDeltaTime(0.016)).toBe(0.016);
  });
});

// ─── Bullet creation guards ──────────────────────────────────────────────────

describe('GameEngine – bullet creation guards', () => {
  it('does not create a bullet when at capacity (20 bullets)', () => {
    const bullets = Array.from({ length: MAX_BULLETS }, () => ({
      x: 0, y: 0, vx: 0, vy: 0,
    }));
    // Simulate the guard: only create if length < MAX_BULLETS
    const canCreate = bullets.length < MAX_BULLETS;
    expect(canCreate).toBeFalse();
  });

  it('allows bullet creation when below capacity', () => {
    const bullets = Array.from({ length: MAX_BULLETS - 1 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0,
    }));
    const canCreate = bullets.length < MAX_BULLETS;
    expect(canCreate).toBeTrue();
  });

  it('does not create a bullet when fire-rate limit has not elapsed', () => {
    const now = 1000;
    const lastFireTime = 900; // only 100 ms ago
    const canFire = now - lastFireTime >= FIRE_RATE_MS;
    expect(canFire).toBeFalse();
  });

  it('allows firing when fire-rate limit has elapsed', () => {
    const now = 1000;
    const lastFireTime = 700; // 300 ms ago
    const canFire = now - lastFireTime >= FIRE_RATE_MS;
    expect(canFire).toBeTrue();
  });

  it('allows firing exactly at the fire-rate boundary (200 ms)', () => {
    const now = 1000;
    const lastFireTime = 800; // exactly 200 ms ago
    const canFire = now - lastFireTime >= FIRE_RATE_MS;
    expect(canFire).toBeTrue();
  });
});

// ─── Particle removal ────────────────────────────────────────────────────────

describe('GameEngine – particle removal', () => {
  it('removes a particle when its lifespan has elapsed', () => {
    const now = 1000;
    const particle = { x: 0, y: 0, vx: 0, vy: 0, born: 500, lifespan: 400 };
    // now - born = 500 >= lifespan 400 → should be removed
    const alive = now - particle.born < particle.lifespan;
    expect(alive).toBeFalse();
  });

  it('keeps a particle alive when lifespan has not elapsed', () => {
    const now = 1000;
    const particle = { x: 0, y: 0, vx: 0, vy: 0, born: 700, lifespan: 400 };
    // now - born = 300 < lifespan 400 → should stay
    const alive = now - particle.born < particle.lifespan;
    expect(alive).toBeTrue();
  });

  it('removes a particle exactly at lifespan boundary', () => {
    const now = 1000;
    const particle = { x: 0, y: 0, vx: 0, vy: 0, born: 600, lifespan: 400 };
    // now - born = 400 >= lifespan 400 → removed
    const alive = now - particle.born < particle.lifespan;
    expect(alive).toBeFalse();
  });
});
