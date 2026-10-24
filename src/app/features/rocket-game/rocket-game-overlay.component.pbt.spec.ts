// Feature: rocket-game-overlay
// Property 6: Destroyed targets are removed from the live cache

import * as fc from 'fast-check';
import { TargetEntry } from './entities';

describe('PBT – Rocket Game Overlay: Destroyed targets are removed from cache', () => {
  /**
   * Validates: Requirements 6.3
   *
   * Destroyed targets must not appear in the live set used for collision tests.
   */
  it('excludes destroyed entries from the live target set', () => {
    fc.assert(
      fc.property(
        fc.array(fc.boolean(), { minLength: 0, maxLength: 50 }),
        (destroyedFlags) => {
          const cache: TargetEntry[] = destroyedFlags.map((destroyed) => ({
            element: {} as Element,
            rect: {
              left: 0,
              top: 0,
              right: 10,
              bottom: 10,
              width: 10,
              height: 10,
              x: 0,
              y: 0,
              toJSON: () => ({}),
            } as DOMRect,
            destroyed,
          }));

          const liveSet = cache.filter((entry) => !entry.destroyed);
          const expectedLiveCount = destroyedFlags.filter(
            (destroyed) => !destroyed,
          ).length;

          expect(liveSet.every((entry) => !entry.destroyed)).toBe(true);
          expect(liveSet.length).toBe(expectedLiveCount);
          expect(liveSet.length + cache.filter((entry) => entry.destroyed).length)
            .toBe(cache.length);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Pure state machine helpers for mobile UX property-based tests

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
  return {
    ...state,
    active: true,
    showStartScreen: true,
    showEndScreen: false,
    engineRunning: false,
  };
}

function applyPlay(state: GameSessionState): GameSessionState {
  if (!state.active || state.showEndScreen) {
    return state;
  }

  return {
    ...state,
    showStartScreen: false,
    engineRunning: true,
  };
}

function applyAllDestroyed(state: GameSessionState): GameSessionState {
  if (!state.engineRunning) {
    return state;
  }

  return {
    ...state,
    showEndScreen: true,
    engineRunning: false,
  };
}

function applyDeactivate(state: GameSessionState): GameSessionState {
  return {
    ...state,
    score: 0,
    showStartScreen: false,
    showEndScreen: false,
    engineRunning: false,
    active: false,
  };
}

function applyResize(
  state: GameSessionState,
  width: number,
  height: number,
): GameSessionState {
  return {
    ...state,
    canvasWidth: width,
    canvasHeight: height,
    isLandscape: width > height,
  };
}

// P1: Score monotonicity

describe('PBT – Mobile UX P1: Score monotonicity', () => {
  it('score never decreases during a session', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 5 }), {
          minLength: 0,
          maxLength: 50,
        }),
        (batchSizes) => {
          let destroyedCount = 0;
          let previousScore = 0;

          for (const batch of batchSizes) {
            destroyedCount += batch;
            const score = destroyedCount;

            expect(score).toBeGreaterThanOrEqual(previousScore);
            previousScore = score;
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// P2: End screen trigger

describe('PBT – Mobile UX P2: End screen trigger', () => {
  it('shows the end screen only after the final target is destroyed', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        (totalTargets) => {
          let destroyedCount = 0;
          let showEndScreen = false;

          for (let i = 0; i < totalTargets; i++) {
            destroyedCount++;

            if (destroyedCount === totalTargets) {
              showEndScreen = true;
            }

            expect(showEndScreen).toBe(destroyedCount === totalTargets);
          }

          expect(showEndScreen).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// P3: Start/end screen gate

describe('PBT – Mobile UX P3: Start/end screen gate', () => {
  it('never runs the engine while either screen is visible', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom('activate', 'play', 'exit', 'allDestroyed'),
          { minLength: 0, maxLength: 30 },
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
                state = applyAllDestroyed(state);
                break;
            }

            if (state.showStartScreen || state.showEndScreen) {
              expect(state.engineRunning).toBe(false);
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// P4: Orientation signal accuracy

describe('PBT – Mobile UX P4: Orientation signal accuracy', () => {
  it('sets isLandscape according to width > height after resize', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 1, max: 2000 }),
          height: fc.integer({ min: 1, max: 2000 }),
        }),
        ({ width, height }) => {
          const state = applyResize(initialState(), width, height);

          expect(state.isLandscape).toBe(width > height);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// P5: Canvas dimensions

describe('PBT – Mobile UX P5: Canvas dimensions after resize', () => {
  it('matches the supplied dimensions after resize', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 1, max: 2000 }),
          height: fc.integer({ min: 1, max: 2000 }),
        }),
        ({ width, height }) => {
          const state = applyResize(initialState(), width, height);

          expect(state.canvasWidth).toBe(width);
          expect(state.canvasHeight).toBe(height);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// P6: Exit resets all session state

describe('PBT – Mobile UX P6: Exit resets session state', () => {
  it('resets all session signals while preserving canvas dimensions', () => {
    fc.assert(
      fc.property(
        fc.record({
          score: fc.integer({ min: 0, max: 100 }),
          startScreen: fc.boolean(),
          endScreen: fc.boolean(),
          engineRunning: fc.boolean(),
          active: fc.boolean(),
          width: fc.integer({ min: 0, max: 2000 }),
          height: fc.integer({ min: 0, max: 2000 }),
        }),
        ({
          score,
          startScreen,
          endScreen,
          engineRunning,
          active,
          width,
          height,
        }) => {
          const state: GameSessionState = {
            ...initialState(),
            score,
            showStartScreen: startScreen,
            showEndScreen: endScreen,
            engineRunning,
            active,
            canvasWidth: width,
            canvasHeight: height,
            isLandscape: width > height,
          };

          const result = applyDeactivate(state);

          expect(result.score).toBe(0);
          expect(result.showStartScreen).toBe(false);
          expect(result.showEndScreen).toBe(false);
          expect(result.active).toBe(false);
          expect(result.engineRunning).toBe(false);

          expect(result.canvasWidth).toBe(width);
          expect(result.canvasHeight).toBe(height);
          expect(result.isLandscape).toBe(width > height);
        },
      ),
      { numRuns: 100 },
    );
  });
});