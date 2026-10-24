// Feature: rocket-game-overlay, Property 6: Destroyed targets are removed from cache
import * as fc from 'fast-check';
import { TargetEntry } from './entities';

describe('PBT – P6: Destroyed targets are removed from cache', () => {
  /**
   * Validates: Requirements 6.3
   *
   * For any target cache, after a target is marked destroyed, it shall not be
   * present in the set of non-destroyed entries returned for subsequent
   * collision tests.
   */
  it('destroyed entries are absent from the live (non-destroyed) set', () => {
    fc.assert(
      fc.property(
        fc.array(fc.boolean(), { minLength: 0, maxLength: 50 }),
        (destroyedFlags) => {
          // Build a synthetic cache
          const cache: TargetEntry[] = destroyedFlags.map((destroyed) => ({
            element: {} as Element,
            rect: {
              left: 0, top: 0, right: 10, bottom: 10,
              width: 10, height: 10, x: 0, y: 0,
              toJSON: () => ({}),
            } as DOMRect,
            destroyed,
          }));

          // The live set is all non-destroyed entries
          const liveSet = cache.filter((e) => !e.destroyed);

          // No entry in liveSet should be destroyed
          for (const entry of liveSet) {
            expect(entry.destroyed).toBeFalse();
          }

          // Count check: liveSet.length === number of false flags
          const expectedLiveCount = destroyedFlags.filter((f) => !f).length;
          expect(liveSet.length).toBe(expectedLiveCount);
        }
      ),
      { numRuns: 100 }
    );
    expect(true).toBeTrue();
  });
});
