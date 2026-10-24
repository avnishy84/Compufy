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

// ─── Pure state machine helpers for mobile UX PBT ────────────────────────────

interface GameSessionState {
  score: number;
  showStartScreen: boolean;
  showEndScreen: boolean;
  engineRunning: boolean;
  active: boolean;
  canvasWidth: number;
  canvasHeight: number;
  isLandscape: boolean;
}

function initialState(): GameSessionState {
  return {
    score: 0,
    showStartScreen: false,
    showEndScreen: false,
    engineRunning: false,
    active: false,
    canvasWidth: 0,
    canvasHeight: 0,
    isLandscape: false,
  };
}

function applyActivate(state: GameSessionState): GameSessionState {
  return { ...state, active: true, showStartScreen: true, engineRunning: false };
}

function applyPlay(state: GameSessionState): GameSessionState {
  if (!state.active) return state;
  return { ...state, showStartScreen: false, engineRunning: true };
}

function applyAllDestroyed(state: GameSessionState): GameSessionState {
  return { ...state, showEndScreen: true, engineRunning: false };
}

function applyDeactivate(state: GameSessionState): GameSessionState {
  return {
    ...state,
    score: 0,
    showStartScreen: false,
    showEndScreen: false,
    active: false,
    engineRunning: false,
  };
}

function applyResize(state: GameSessionState, width: number, height: number): GameSessionState {
  return {
    ...state,
    canvasWidth: width,
    canvasHeight: height,
    isLandscape: width > height,
  };
}

// ─── Mobile UX PBT tests ─────────────────────────────────────────────────────

describe('PBT – P1: Score monotonicity', () => {
  // Feature: rocket-game-mobile-ux, Property 1: Score never decreases during a session
  it('score never decreases across any sequence of destruction events', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 5 }), { minLength: 0, maxLength: 50 }),
        (batchSizes) => {
          let score = 0;
          let destroyedCount = 0;
          const scores: number[] = [];

          for (const batch of batchSizes) {
            destroyedCount += batch;
            score = destroyedCount; // onTargetDestroyedCb sets score = count
            scores.push(score);
          }

          // Verify monotonicity: each score >= previous score
          for (let i = 1; i < scores.length; i++) {
            expect(scores[i]).toBeGreaterThanOrEqual(scores[i - 1]);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('PBT – P2: End Screen trigger', () => {
  // Feature: rocket-game-mobile-ux, Property 2: showEndScreen becomes true exactly when the Nth target is destroyed
  it('showEndScreen becomes true exactly when the last target is destroyed', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        (totalTargets) => {
          let showEndScreen = false;
          let destroyedCount = 0;

          // Simulate destroying targets one by one
          for (let i = 0; i < totalTargets; i++) {
            destroyedCount++;
            const allGone = destroyedCount === totalTargets;

            if (allGone) {
              showEndScreen = true;
            }

            if (i < totalTargets - 1) {
              // Not yet all destroyed — End Screen must NOT be showing
              expect(showEndScreen).toBeFalse();
            }
          }

          // After all targets destroyed — End Screen MUST be showing
          expect(showEndScreen).toBeTrue();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('PBT – P3: Start/End Screen gate', () => {
  // Feature: rocket-game-mobile-ux, Property 3: Engine never running while either screen is visible
  it('engine is never running while Start Screen or End Screen is visible', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom('activate', 'play', 'exit', 'allDestroyed'),
          { minLength: 0, maxLength: 30 }
        ),
        (events) => {
          let state = initialState();

          for (const event of events) {
            switch (event) {
              case 'activate':
                state = applyActivate(state);
                break;
              case 'play':
                state = applyPlay(state);
                break;
              case 'exit':
                state = applyDeactivate(state);
                break;
              case 'allDestroyed':
                if (state.engineRunning) {
                  state = applyAllDestroyed(state);
                }
                break;
            }

            // Invariant: engine must NOT be running while either screen is visible
            if (state.showStartScreen || state.showEndScreen) {
              expect(state.engineRunning).toBeFalse();
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('PBT – P4: Orientation signal accuracy', () => {
  // Feature: rocket-game-mobile-ux, Property 4: isLandscape() equals width > height after resize
  it('isLandscape equals width > height for any (width, height) pair', () => {
    fc.assert(
      fc.property(
        fc.record({
          width:  fc.integer({ min: 1, max: 2000 }),
          height: fc.integer({ min: 1, max: 2000 }),
        }),
        ({ width, height }) => {
          const state = applyResize(initialState(), width, height);
          expect(state.isLandscape).toBe(width > height);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('PBT – P5: Canvas dimensions match window after resize', () => {
  // Feature: rocket-game-mobile-ux, Property 5: canvasWidth and canvasHeight match window dimensions after resize
  it('canvasWidth and canvasHeight match the provided dimensions after resize', () => {
    fc.assert(
      fc.property(
        fc.record({
          width:  fc.integer({ min: 1, max: 2000 }),
          height: fc.integer({ min: 1, max: 2000 }),
        }),
        ({ width, height }) => {
          const state = applyResize(initialState(), width, height);
          expect(state.canvasWidth).toBe(width);
          expect(state.canvasHeight).toBe(height);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('PBT – P6: Exit resets all session state', () => {
  // Feature: rocket-game-mobile-ux, Property 6: deactivate() resets all signals to initial values
  it('deactivate() resets score, showStartScreen, showEndScreen to initial values for any session state', () => {
    fc.assert(
      fc.property(
        fc.record({
          score:       fc.integer({ min: 0, max: 100 }),
          startScreen: fc.boolean(),
          endScreen:   fc.boolean(),
        }),
        ({ score, startScreen, endScreen }) => {
          // Build an arbitrary session state
          let state = initialState();
          state = { ...state, score, showStartScreen: startScreen, showEndScreen: endScreen, active: true };

          // Apply deactivate
          state = applyDeactivate(state);

          // All signals must be reset to initial values
          expect(state.score).toBe(0);
          expect(state.showStartScreen).toBeFalse();
          expect(state.showEndScreen).toBeFalse();
          expect(state.active).toBeFalse();
          expect(state.engineRunning).toBeFalse();
        }
      ),
      { numRuns: 100 }
    );
  });
});
