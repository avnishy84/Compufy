import { testAABB, runCollisions } from './collision-handler';
import { Bullet, GameState, TargetEntry } from './entities';

// Helper to build a minimal DOMRect-like object
function makeRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({})
  } as DOMRect;
}

function makeBullet(x: number, y: number): Bullet {
  return { x, y, vx: 0, vy: -600 };
}

describe('testAABB', () => {
  // Bullet bounding box: left=x-2, right=x+2, top=y-6, bottom=y+6

  it('returns true when bullet center is inside the target rect', () => {
    const bullet = makeBullet(100, 100);
    const rect = makeRect(90, 90, 30, 30); // covers 90–120 × 90–120
    expect(testAABB(bullet, rect)).toBeTrue();
  });

  it('returns true when bullet partially overlaps on the left edge', () => {
    // bullet right = 102, rect left = 100 → overlap by 2px
    const bullet = makeBullet(100, 100);
    const rect = makeRect(100, 94, 50, 12); // top=94, bottom=106 overlaps bullet top=94..bottom=106
    expect(testAABB(bullet, rect)).toBeTrue();
  });

  it('returns true when bullet partially overlaps on the top edge', () => {
    // bullet bottom = 106, rect top = 100 → overlap by 6px
    const bullet = makeBullet(100, 100);
    const rect = makeRect(98, 100, 10, 20);
    expect(testAABB(bullet, rect)).toBeTrue();
  });

  it('returns false when bullet is entirely to the left of the rect', () => {
    // bullet right = 102, rect left = 110
    const bullet = makeBullet(100, 100);
    const rect = makeRect(110, 90, 50, 50);
    expect(testAABB(bullet, rect)).toBeFalse();
  });

  it('returns false when bullet is entirely to the right of the rect', () => {
    // bullet left = 98, rect right = 90
    const bullet = makeBullet(100, 100);
    const rect = makeRect(40, 90, 50, 50); // right = 90
    expect(testAABB(bullet, rect)).toBeFalse();
  });

  it('returns false when bullet is entirely above the rect', () => {
    // bullet bottom = 106, rect top = 110
    const bullet = makeBullet(100, 100);
    const rect = makeRect(90, 110, 50, 50);
    expect(testAABB(bullet, rect)).toBeFalse();
  });

  it('returns false when bullet is entirely below the rect', () => {
    // bullet top = 94, rect bottom = 90
    const bullet = makeBullet(100, 100);
    const rect = makeRect(90, 40, 50, 50); // bottom = 90
    expect(testAABB(bullet, rect)).toBeFalse();
  });

  it('returns false when bullet right edge exactly touches rect left edge (no overlap)', () => {
    // bullet right = 102, rect left = 102 → touching but not overlapping
    const bullet = makeBullet(100, 100);
    const rect = makeRect(102, 94, 50, 12);
    expect(testAABB(bullet, rect)).toBeFalse();
  });

  it('returns false when bullet bottom edge exactly touches rect top edge (no overlap)', () => {
    // bullet bottom = 106, rect top = 106
    const bullet = makeBullet(100, 100);
    const rect = makeRect(98, 106, 10, 20);
    expect(testAABB(bullet, rect)).toBeFalse();
  });
});

describe('runCollisions', () => {
  function makeState(bullets: Bullet[]): GameState {
    return {
      rocket: { x: 0, y: 0, vx: 0, vy: 0, angle: 0 },
      bullets,
      particles: []
    };
  }

  function makeEntry(left: number, top: number, width: number, height: number, destroyed = false): TargetEntry {
    return {
      element: {} as Element,
      rect: makeRect(left, top, width, height),
      destroyed
    };
  }

  it('returns empty results when bullets array is empty', () => {
    const state = makeState([]);
    const cache = [makeEntry(0, 0, 100, 100)];
    const result = runCollisions(state, cache);
    expect(result.destroyedIndices).toEqual([]);
    expect(result.bulletsToRemove.size).toBe(0);
  });

  it('detects a collision and returns correct indices', () => {
    const bullet = makeBullet(50, 50);
    const state = makeState([bullet]);
    const cache = [makeEntry(40, 40, 30, 30)]; // covers 40–70 × 40–70
    const result = runCollisions(state, cache);
    expect(result.destroyedIndices).toEqual([0]);
    expect(result.bulletsToRemove.has(0)).toBeTrue();
  });

  it('marks the cache entry as destroyed after collision', () => {
    const bullet = makeBullet(50, 50);
    const state = makeState([bullet]);
    const cache = [makeEntry(40, 40, 30, 30)];
    runCollisions(state, cache);
    expect(cache[0].destroyed).toBeTrue();
  });

  it('skips already-destroyed entries', () => {
    const bullet = makeBullet(50, 50);
    const state = makeState([bullet]);
    const cache = [makeEntry(40, 40, 30, 30, true)]; // pre-destroyed
    const result = runCollisions(state, cache);
    expect(result.destroyedIndices).toEqual([]);
    expect(result.bulletsToRemove.size).toBe(0);
  });

  it('only one bullet destroys a target (inner loop breaks)', () => {
    const b1 = makeBullet(50, 50);
    const b2 = makeBullet(50, 50);
    const state = makeState([b1, b2]);
    const cache = [makeEntry(40, 40, 30, 30)];
    const result = runCollisions(state, cache);
    // target destroyed once, only first colliding bullet removed
    expect(result.destroyedIndices).toEqual([0]);
    expect(result.bulletsToRemove.has(0)).toBeTrue();
    expect(result.bulletsToRemove.size).toBe(1);
  });

  it('handles multiple targets and multiple bullets independently', () => {
    const b0 = makeBullet(50, 50);   // hits target 0
    const b1 = makeBullet(200, 200); // hits target 1
    const state = makeState([b0, b1]);
    const cache = [
      makeEntry(40, 40, 30, 30),   // target 0
      makeEntry(190, 190, 30, 30)  // target 1
    ];
    const result = runCollisions(state, cache);
    expect(result.destroyedIndices).toContain(0);
    expect(result.destroyedIndices).toContain(1);
    expect(result.bulletsToRemove.has(0)).toBeTrue();
    expect(result.bulletsToRemove.has(1)).toBeTrue();
  });

  it('returns no collision when bullet misses all targets', () => {
    const bullet = makeBullet(500, 500);
    const state = makeState([bullet]);
    const cache = [makeEntry(0, 0, 50, 50)];
    const result = runCollisions(state, cache);
    expect(result.destroyedIndices).toEqual([]);
    expect(result.bulletsToRemove.size).toBe(0);
  });
});
