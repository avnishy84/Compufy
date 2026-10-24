# Tasks

## Task List

- [x] 1. Set up project scaffold
  - [x] 1.1 Create the `src/app/features/rocket-game/` directory with placeholder files: `entities.ts`, `input-handler.ts`, `target-cache.ts`, `collision-handler.ts`, `renderer.ts`, `game-engine.ts`, and `rocket-game-overlay.component.ts`
  - [x] 1.2 Define all TypeScript interfaces (`Rocket`, `Bullet`, `Particle`, `GameState`, `TargetEntry`, `InputState`) in `entities.ts`

- [x] 2. Implement InputHandler
  - [x] 2.1 Implement `InputHandler` class in `input-handler.ts` that listens to `keydown`/`keyup` events and maintains an `InputState` snapshot for Arrow keys, WASD, Spacebar, and Escape
  - [x] 2.2 Expose `attach(target: EventTarget)` and `detach()` methods to add/remove listeners without leaking
  - [x] 2.3 Write unit tests for key mapping in `input-handler.spec.ts`

- [x] 3. Implement TargetCache
  - [x] 3.1 Implement `buildCache()` in `target-cache.ts` to query all `.target` elements and return `TargetEntry[]` with `element`, `rect`, and `destroyed: false`
  - [x] 3.2 Implement `refreshRects(cache: TargetEntry[])` to re-call `getBoundingClientRect()` on non-destroyed entries
  - [x] 3.3 Write unit tests for cache build and refresh in `target-cache.spec.ts`

- [x] 4. Implement CollisionHandler
  - [x] 4.1 Implement pure function `testAABB(bullet: Bullet, rect: DOMRect): boolean` in `collision-handler.ts`
  - [x] 4.2 Implement `runCollisions(state: GameState, cache: TargetEntry[]): { destroyedIndices: number[]; bulletsToRemove: Set<number> }` — skips all tests when `bullets` is empty
  - [x] 4.3 Write unit tests for overlapping and non-overlapping rect pairs in `collision-handler.spec.ts`
  - [x] 4.4 Write property-based test for AABB correctness (Property 5) in `collision-handler.pbt.spec.ts`

- [x] 5. Implement Renderer
  - [x] 5.1 Implement `renderFrame(ctx: CanvasRenderingContext2D, state: GameState, now: number): void` in `renderer.ts` — clears canvas, then draws rocket, bullets, particles in order
  - [x] 5.2 Implement `drawRocket(ctx, rocket)` using `save()`/`restore()` and a triangular path
  - [x] 5.3 Implement `drawBullet(ctx, bullet)` as a 4×12 filled rectangle aligned to travel direction, using `save()`/`restore()`
  - [x] 5.4 Implement `drawParticle(ctx, particle, now)` as a filled circle radius 3 with opacity proportional to remaining lifespan, using `save()`/`restore()`
  - [x] 5.5 Write unit test verifying `save()`/`restore()` symmetry by spying on the canvas context in `renderer.spec.ts`

- [x] 6. Implement GameEngine
  - [x] 6.1 Implement `GameEngine` class in `game-engine.ts` with `start(ctx, canvas, inputHandler, targetCache)` and `stop()` methods
  - [x] 6.2 Implement the RAF loop: compute delta-time in seconds, cap at `0.05`, apply velocity to rocket position, apply friction `0.85` when no keys held, clamp rocket to canvas bounds
  - [x] 6.3 Implement bullet creation on Spacebar with fire-rate limit of 200 ms and max 20 simultaneous bullets; remove out-of-bounds bullets each frame
  - [x] 6.4 Implement particle spawning (8 particles per destruction) and removal when lifespan ≥ 400 ms
  - [x] 6.5 Delegate to `runCollisions` each frame; on destruction apply break animation CSS class and set up `transitionend` listener (with 700 ms fallback) to set `visibility: hidden`
  - [x] 6.6 Write unit tests for boundary clamping at exact edges and delta-time cap in `game-engine.spec.ts`
  - [x] 6.7 Write property-based tests (Properties 1–4, 7–9) in `game-engine.pbt.spec.ts`:
    - P1: Rocket bounds clamping
    - P2: Friction convergence
    - P3: Bullet count cap
    - P4: Out-of-bounds bullet removal
    - P7: Delta-time cap
    - P8: Particle opacity bounded
    - P9: Fire-rate limit

- [x] 7. Implement RocketGameOverlayComponent
  - [x] 7.1 Create `rocket-game-overlay.component.ts` as a standalone `OnPush` component with `active`, `canvasWidth`, `canvasHeight` signals
  - [x] 7.2 Render a `<canvas>` element with `position: fixed`, `top: 0`, `left: 0`, `width: 100vw`, `height: 100vh`, high `z-index`, and `pointer-events` bound to the `active` signal
  - [x] 7.3 Guard all browser-only APIs with `isPlatformBrowser(inject(PLATFORM_ID))`
  - [x] 7.4 On `AfterViewInit` (browser only): attach `InputHandler`, build `TargetCache`, listen for `#game-trigger` click to activate and spawn rocket at click position
  - [x] 7.5 On activation: set canvas dimensions to `window.innerWidth` × `window.innerHeight`, start `GameEngine`
  - [x] 7.6 Listen for `window resize` to update canvas dimensions and refresh `TargetCache` within one animation frame
  - [x] 7.7 Listen for `Escape` keydown to deactivate: stop `GameEngine`, clear canvas, reset entity state
  - [x] 7.8 Implement `ngOnDestroy`: cancel RAF, detach `InputHandler`, restore all modified target element styles
  - [x] 7.9 Write unit tests for component lifecycle (activate, deactivate, destroy) in `rocket-game-overlay.component.spec.ts`
  - [x] 7.10 Write property-based test for destroyed-target cache cleanup (Property 6) in `rocket-game-overlay.component.pbt.spec.ts`

- [x] 8. Add `target` class to existing page elements
  - [x] 8.1 Add `class="target"` to at least two elements in the existing pages (e.g. service cards, hero heading) so the game has destroyable targets
  - [x] 8.2 Add `id="game-trigger"` to the chosen trigger element (e.g. a hidden button or existing UI element)

- [x] 9. Register the component in the app
  - [x] 9.1 Import and add `RocketGameOverlayComponent` to the root `AppComponent` template so it is present on every page
  - [x] 9.2 Verify the overlay does not affect SSR by confirming the server build completes without errors (`npm run build`)
