// Feature: rocket-game-overlay, Property 5: AABB collision correctness
// For any bullet rectangle and target rectangle, testAABB returns true if and only if
// the two rectangles overlap (standard AABB intersection).
//
// Validates: Requirements 6.2

import * as fc from 'fast-check';
import { testAABB } from './collision-handler';
import { Bullet } from './entities';

// Reference implementation to compare against
function referenceOverlap(
  bx: number, by: number,
  tx: number, ty: number,
  tw: number, th: number
): boolean {
  const bLeft = bx - 2, bRight = bx + 2, bTop = by - 6, bBottom = by + 6;
  return !(bRight <= tx || bLeft >= tx + tw || bBottom <= ty || bTop >= ty + th);
}

function makeRect(x: number, y: number, w: number, h: number): DOMRect {
  return {
    left: x,
    top: y,
    right: x + w,
    bottom: y + h,
    width: w,
    height: h,
    x,
    y,
    toJSON: () => ({})
  } as DOMRect;
}

describe('Property 5: AABB collision correctness', () => {
  it('testAABB matches reference implementation for arbitrary rect pairs', () => {
    fc.assert(
      fc.property(
        // bullet position
        fc.record({ x: fc.integer({ min: -1000, max: 1000 }), y: fc.integer({ min: -1000, max: 1000 }) }),
        // target rect: position + positive dimensions
        fc.record({
          tx: fc.integer({ min: -1000, max: 1000 }),
          ty: fc.integer({ min: -1000, max: 1000 }),
          tw: fc.integer({ min: 1, max: 500 }),
          th: fc.integer({ min: 1, max: 500 })
        }),
        ({ x, y }, { tx, ty, tw, th }) => {
          const bullet: Bullet = { x, y, vx: 0, vy: 0 };
          const rect = makeRect(tx, ty, tw, th);
          const actual = testAABB(bullet, rect);
          const expected = referenceOverlap(x, y, tx, ty, tw, th);
          return actual === expected;
        }
      ),
      { numRuns: 100 }
    );
    // Jasmine expectation so Karma does not warn about missing expectations
    expect(true).toBeTrue();
  });
});
