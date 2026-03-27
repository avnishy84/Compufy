import { Bullet, GameState, TargetEntry } from './entities';

export interface CollisionResult {
  destroyedIndices: number[];
  bulletsToRemove: Set<number>;
}

/**
 * AABB intersection test between a bullet and a DOMRect.
 * Bullet bounding box: 4×12 px, centered at (bullet.x, bullet.y).
 */
export function testAABB(bullet: Bullet, rect: DOMRect): boolean {
  const bLeft   = bullet.x - 2;
  const bRight  = bullet.x + 2;
  const bTop    = bullet.y - 6;
  const bBottom = bullet.y + 6;

  return !(
    bRight  <= rect.left   ||
    bLeft   >= rect.right  ||
    bBottom <= rect.top    ||
    bTop    >= rect.bottom
  );
}

/**
 * Run collision tests for all active bullets against all non-destroyed cache entries.
 * Skips all tests when the bullet list is empty.
 */
export function runCollisions(
  state: GameState,
  cache: TargetEntry[]
): CollisionResult {
  const destroyedIndices: number[] = [];
  const bulletsToRemove = new Set<number>();

  if (state.bullets.length === 0) {
    return { destroyedIndices, bulletsToRemove };
  }

  for (let ti = 0; ti < cache.length; ti++) {
    const entry = cache[ti];
    if (entry.destroyed) continue;

    for (let bi = 0; bi < state.bullets.length; bi++) {
      if (testAABB(state.bullets[bi], entry.rect)) {
        destroyedIndices.push(ti);
        bulletsToRemove.add(bi);
        entry.destroyed = true;
        break; // one bullet is enough to destroy this target
      }
    }
  }

  return { destroyedIndices, bulletsToRemove };
}
