# Tasks: Rocket Game Mobile UX

## Task List

- [x] 1. Extend GameStateService with showStartScreen signal
  - [x] 1.1 Add `readonly showStartScreen = signal<boolean>(false)` to `GameStateService`
  - [x] 1.2 Verify existing `active` signal is unchanged

- [x] 2. Extend GameEngine with destruction callbacks
  - [x] 2.1 Define `GameCallbacks` interface (`onTargetDestroyed`, `onAllDestroyed`) in `game-engine.ts`
  - [x] 2.2 Add `private destroyedCount = 0` and `private callbacks: GameCallbacks | undefined` fields
  - [x] 2.3 Update `start()` signature to accept optional `callbacks?: GameCallbacks` parameter; reset `destroyedCount` to `0` and store callbacks
  - [x] 2.4 Update `stop()` to clear stored callbacks (set to `undefined`) to prevent stale invocations
  - [x] 2.5 In the loop, after processing `result.destroyedIndices`, increment `destroyedCount`, invoke `onTargetDestroyed(destroyedCount)`, and invoke `onAllDestroyed()` + `stop()` when all targets are destroyed

- [x] 3. Add Mobile_Trigger to HeroSectionComponent
  - [x] 3.1 Inject `GameStateService` into `HeroSectionComponent`
  - [x] 3.2 Add a `<button id="mobile-game-trigger">` inside the existing flex container, styled `sm:hidden`, minimum 44×44 px touch target, displaying rocket emoji and "Play Game" label
  - [x] 3.3 Wire the button's `(click)` handler to set `gameState.showStartScreen(true)` and `gameState.active(true)`
  - [x] 3.4 Add `aria-label="Play rocket game"` to the button

- [x] 4. Add new signals and orientation tracking to RocketGameOverlayComponent
  - [x] 4.1 Add `readonly score = signal<number>(0)` signal
  - [x] 4.2 Add `readonly showStartScreen = this.gameState.showStartScreen` alias
  - [x] 4.3 Add `readonly showEndScreen = signal<boolean>(false)` signal
  - [x] 4.4 Add `readonly isLandscape = signal<boolean>(false)` signal
  - [x] 4.5 Update `onResize` handler to call `this.isLandscape.set(window.innerWidth > window.innerHeight)` inside the RAF callback
  - [x] 4.6 Set `isLandscape` during `activate()` to capture initial orientation

- [x] 5. Implement Start Screen in RocketGameOverlayComponent
  - [x] 5.1 Add Start Screen template region inside `@if (active())` — full-screen glassmorphism overlay at z-index 10002, visible when `showStartScreen()` is true
  - [x] 5.2 Include D-pad and Fire Button icon descriptions with short labels in the Start Screen body
  - [x] 5.3 Add "Play" button (`aria-label="Start game"`) that calls `startEngine()` and sets `showStartScreen` to `false`
  - [x] 5.4 Add "Exit" button (`aria-label="Cancel and exit"`) that calls `deactivate()`
  - [x] 5.5 Add `aria-live="polite"` to the Start Screen container element
  - [x] 5.6 Ensure `startEngine()` private method encapsulates `engine.start()` call with callbacks wired up

- [x] 6. Implement End Screen in RocketGameOverlayComponent
  - [x] 6.1 Add End Screen template region inside `@if (active())` — full-screen glassmorphism overlay at z-index 10002, visible when `showEndScreen()` is true
  - [x] 6.2 Display `score()` value as the final score in the End Screen body
  - [x] 6.3 Add "Play Again" button (`aria-label="Play again"`) that calls `playAgain()`
  - [x] 6.4 Add "Exit" button (`aria-label="Exit game"`) that calls `deactivate()`
  - [x] 6.5 Add `aria-live="polite"` to the End Screen container element
  - [x] 6.6 Implement `playAgain()` method: set `showEndScreen(false)`, reset `score(0)`, restore destroyed elements' visibility and `destroyed` flag, rebuild target cache, call `startEngine()`

- [x] 7. Implement HUD (score display)
  - [x] 7.1 Add HUD template region inside `@if (active())` — top-left corner, z-index 10001, `sm:hidden`, visible only when neither Start Screen nor End Screen is showing
  - [x] 7.2 Display `score()` with semi-transparent background (`rgba(99,102,241,0.25)`) and `border border-white/10 backdrop-blur` styling
  - [x] 7.3 Ensure HUD has at least 16 px clearance from screen edges

- [x] 8. Implement Exit Button
  - [x] 8.1 Add Exit Button template region inside `@if (active())` — top-right corner, z-index 10001, `sm:hidden`
  - [x] 8.2 Style with minimum 44×44 px touch target, glassmorphism background, "✕" icon
  - [x] 8.3 Add `aria-label="Exit game"` and wire `(touchstart)` / `(click)` to `deactivate()`

- [x] 9. Polish D-pad and Fire Button with orientation-aware layout
  - [x] 9.1 Update D-pad container to use `isLandscape()` signal for conditional Tailwind classes: portrait uses 52×52 px buttons with `bottom-8`; landscape uses 44×44 px buttons with `bottom-4`
  - [x] 9.2 Update Fire Button to use `isLandscape()` signal: portrait 72 px diameter; landscape 60 px diameter
  - [x] 9.3 Add CSS transitions to D-pad buttons: `transition: background 60ms, transform 120ms` with `:active` state scaling to `0.92` and background `rgba(99,102,241,0.65)`
  - [x] 9.4 Add CSS transitions to Fire Button: same timing pattern with `:active` background `rgba(239,68,68,0.65)` and scale `0.92`
  - [x] 9.5 Ensure all D-pad buttons and Fire Button have `touch-action: none` and `style="touch-action: none"` to prevent scroll interference
  - [x] 9.6 Hide D-pad and Fire Button while Start Screen or End Screen is visible

- [x] 10. Update deactivate() to reset all new signals
  - [x] 10.1 In `deactivate()`, call `this.score.set(0)`, `this.gameState.showStartScreen.set(false)`, `this.showEndScreen.set(false)` before clearing the canvas

- [x] 11. Wire onTargetDestroyed and onAllDestroyed callbacks in the component
  - [x] 11.1 Implement `private readonly onTargetDestroyedCb = (count: number): void => { this.score.set(count); }` arrow method
  - [x] 11.2 Implement `private readonly onAllDestroyedCb = (): void => { this.showEndScreen.set(true); }` arrow method
  - [x] 11.3 Pass both callbacks to `engine.start()` via the `GameCallbacks` object in `startEngine()`

- [x] 12. Write unit tests for GameEngine callbacks
  - [x] 12.1 Test `onTargetDestroyed` is called with incrementing count after each target destruction
  - [x] 12.2 Test `onAllDestroyed` is called exactly once when the last target is destroyed
  - [x] 12.3 Test callbacks are not invoked after `stop()` is called

- [x] 13. Write unit tests for RocketGameOverlayComponent new behaviour
  - [x] 13.1 Test `deactivate()` resets `score`, `showStartScreen`, `showEndScreen` to initial values
  - [x] 13.2 Test `playAgain()` resets score to 0 and calls `engine.start()`
  - [x] 13.3 Test `onResize` sets `isLandscape` correctly for portrait dimensions (width < height)
  - [x] 13.4 Test `onResize` sets `isLandscape` correctly for landscape dimensions (width > height)
  - [x] 13.5 Test Start Screen is rendered when `showStartScreen` is true
  - [x] 13.6 Test End Screen is rendered when `showEndScreen` is true
  - [x] 13.7 Test HUD is rendered when active and neither screen is showing
  - [x] 13.8 Test Exit Button has `aria-label="Exit game"`
  - [x] 13.9 Test all D-pad buttons have correct `aria-label` values
  - [x] 13.10 Test Fire Button has `aria-label="Fire"`
  - [x] 13.11 Test no mobile controls rendered when `isPlatformBrowser` returns false (SSR)

- [x] 14. Write property-based tests
  - [x] 14.1 P1 — Score monotonicity: for any sequence of destruction events, score never decreases
  - [x] 14.2 P2 — End Screen trigger: for any cache of size N, `showEndScreen` becomes true exactly when the Nth target is destroyed
  - [x] 14.3 P3 — Start/End Screen gate: for any event sequence, engine never running while either screen is visible
  - [x] 14.4 P4 — Orientation signal accuracy: for any (width, height), `isLandscape()` equals `width > height` after resize
  - [x] 14.5 P5 — Canvas dimensions match window: for any (width, height), signals match after resize
  - [x] 14.6 P6 — Exit resets state: for any session state, `deactivate()` resets all signals to initial values
