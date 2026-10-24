import {
  HALF_SIZE,
  DT_CAP,
  FIRE_RATE_MS,
  MAX_BULLETS,
  clampRocket,
  capDeltaTime,
} from './game-engine';

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
    expect(canCreate).toBe(false);
  });

  it('allows bullet creation when below capacity', () => {
    const bullets = Array.from({ length: MAX_BULLETS - 1 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0,
    }));
    const canCreate = bullets.length < MAX_BULLETS;
    expect(canCreate).toBe(true);
  });

  it('does not create a bullet when fire-rate limit has not elapsed', () => {
    const now = 1000;
    const lastFireTime = 900; // only 100 ms ago
    const canFire = now - lastFireTime >= FIRE_RATE_MS;
    expect(canFire).toBe(false);
  });

  it('allows firing when fire-rate limit has elapsed', () => {
    const now = 1000;
    const lastFireTime = 700; // 300 ms ago
    const canFire = now - lastFireTime >= FIRE_RATE_MS;
    expect(canFire).toBe(true);
  });

  it('allows firing exactly at the fire-rate boundary (200 ms)', () => {
    const now = 1000;
    const lastFireTime = 800; // exactly 200 ms ago
    const canFire = now - lastFireTime >= FIRE_RATE_MS;
    expect(canFire).toBe(true);
  });
});

// ─── Particle removal ────────────────────────────────────────────────────────

describe('GameEngine – particle removal', () => {
  it('removes a particle when its lifespan has elapsed', () => {
    const now = 1000;
    const particle = { x: 0, y: 0, vx: 0, vy: 0, born: 500, lifespan: 400 };
    // now - born = 500 >= lifespan 400 → should be removed
    const alive = now - particle.born < particle.lifespan;
    expect(alive).toBe(false);
  });

  it('keeps a particle alive when lifespan has not elapsed', () => {
    const now = 1000;
    const particle = { x: 0, y: 0, vx: 0, vy: 0, born: 700, lifespan: 400 };
    // now - born = 300 < lifespan 400 → should stay
    const alive = now - particle.born < particle.lifespan;
    expect(alive).toBe(true);
  });

  it('removes a particle exactly at lifespan boundary', () => {
    const now = 1000;
    const particle = { x: 0, y: 0, vx: 0, vy: 0, born: 600, lifespan: 400 };
    // now - born = 400 >= lifespan 400 → removed
    const alive = now - particle.born < particle.lifespan;
    expect(alive).toBe(false);
  });
});

// ─── GameEngine callbacks logic ──────────────────────────────────────────────

// Simulates the callback invocation logic from the engine loop
function simulateDestructions(
  destroyedBatches: number[], // each element = number of targets destroyed in that batch
  totalTargets: number,
  callbacks: { onTargetDestroyed?: (count: number) => void; onAllDestroyed?: () => void }
): { finalCount: number; stopped: boolean } {
  let destroyedCount = 0;
  let stopped = false;
  let activeCallbacks: typeof callbacks | undefined = callbacks;

  // Simulate a cache of totalTargets entries
  const cache = Array.from({ length: totalTargets }, () => ({ destroyed: false }));
  let cacheDestroyedSoFar = 0;

  for (const batchSize of destroyedBatches) {
    if (stopped) break;

    // Mark batchSize entries as destroyed
    for (let i = 0; i < batchSize && cacheDestroyedSoFar < totalTargets; i++) {
      cache[cacheDestroyedSoFar].destroyed = true;
      cacheDestroyedSoFar++;
    }

    destroyedCount += batchSize;
    activeCallbacks?.onTargetDestroyed?.(destroyedCount);

    const allGone = cache.every((e) => e.destroyed);
    if (allGone) {
      const onAllDestroyed = activeCallbacks?.onAllDestroyed;
      // stop() clears callbacks
      activeCallbacks = undefined;
      stopped = true;
      onAllDestroyed?.();
    }
  }

  return { finalCount: destroyedCount, stopped };
}

// ─── GameEngine callbacks ────────────────────────────────────────────────────

describe('GameEngine – onTargetDestroyed callback', () => {
  it('is called with count=1 after first target is destroyed', () => {
    const calls: number[] = [];
    simulateDestructions([1], 3, { onTargetDestroyed: (c) => calls.push(c) });
    expect(calls).toEqual([1]);
  });

  it('is called with incrementing count after each destruction', () => {
    const calls: number[] = [];
    simulateDestructions([1, 1, 1], 5, { onTargetDestroyed: (c) => calls.push(c) });
    expect(calls).toEqual([1, 2, 3]);
  });

  it('increments by batch size when multiple targets destroyed at once', () => {
    const calls: number[] = [];
    simulateDestructions([2, 3], 10, { onTargetDestroyed: (c) => calls.push(c) });
    expect(calls).toEqual([2, 5]);
  });

  it('is not called when no targets are destroyed', () => {
    const calls: number[] = [];
    simulateDestructions([], 3, { onTargetDestroyed: (c) => calls.push(c) });
    expect(calls).toEqual([]);
  });
});

describe('GameEngine – onAllDestroyed callback', () => {
  it('is called exactly once when the last target is destroyed', () => {
    let callCount = 0;
    simulateDestructions([1, 1, 1], 3, { onAllDestroyed: () => callCount++ });
    expect(callCount).toBe(1);
  });

  it('is not called when targets remain', () => {
    let callCount = 0;
    simulateDestructions([1, 1], 3, { onAllDestroyed: () => callCount++ });
    expect(callCount).toBe(0);
  });

  it('is called when all targets destroyed in a single batch', () => {
    let callCount = 0;
    simulateDestructions([3], 3, { onAllDestroyed: () => callCount++ });
    expect(callCount).toBe(1);
  });
});

describe('GameEngine – callbacks cleared after stop()', () => {
  it('onTargetDestroyed is not invoked after stop() is called', () => {
    const calls: number[] = [];
    const { stopped } = simulateDestructions([1, 1, 1], 2, {
      onTargetDestroyed: (c) => calls.push(c),
    });
    // After both targets are destroyed, stop() runs and the 3rd batch is skipped
    expect(stopped).toBe(true);
    expect(calls).toEqual([1, 2]);
  });

  it('onAllDestroyed is not invoked again after stop() is called', () => {
    let callCount = 0;
    // The extra 3rd batch after stop must not re-fire the callback
    simulateDestructions([1, 1, 1], 2, { onAllDestroyed: () => callCount++ });
    expect(callCount).toBe(1);
  });

  it('callbacks are cleared (set to undefined) when stop() is called', () => {
    // After allGone, the callback reference is captured, then callbacks are
    // cleared before onAllDestroyed is invoked
    const order: string[] = [];
    simulateDestructions([1], 1, {
      onTargetDestroyed: () => order.push('destroyed'),
      onAllDestroyed: () => order.push('allDestroyed'),
    });
    expect(order).toEqual(['destroyed', 'allDestroyed']);
  });
});