# Requirements Document

## Introduction

A browser-based mini 2D game overlay that integrates with the existing Angular 18 Compufy Technology website. When activated, a full-screen HTML5 Canvas overlay appears on top of the page, allowing the user to pilot a rocket, fire bullets, and destroy designated DOM elements. The feature is implemented as a standalone Angular component using TypeScript strict mode, Signals, and Tailwind CSS, following the project's existing conventions.

## Glossary

- **Game_Overlay**: The Angular standalone component that hosts the full-screen canvas and manages game lifecycle.
- **Rocket**: The player-controlled 2D entity rendered on the canvas.
- **Bullet**: A projectile fired by the Rocket that travels in the Rocket's facing direction.
- **Target**: A DOM element with the CSS class `target` that can be destroyed by Bullet collisions.
- **Game_Loop**: The `requestAnimationFrame`-driven update-and-render cycle.
- **Collision_Handler**: The module responsible for detecting intersections between Bullets and Targets.
- **Input_Handler**: The module that captures and normalises keyboard input for Rocket movement and firing.
- **Renderer**: The module that clears and redraws all game entities onto the Canvas each frame.
- **Break_Animation**: The CSS transition applied to a Target element when it is destroyed.
- **Target_Cache**: An in-memory snapshot of Target bounding rectangles, refreshed at defined intervals to avoid per-frame DOM queries.

---

## Requirements

### Requirement 1: Game Activation

**User Story:** As a visitor, I want to click a trigger element to start the mini game, so that the game launches without disrupting my normal page browsing.

#### Acceptance Criteria

1. WHEN the user clicks the element with `id="game-trigger"`, THE Game_Overlay SHALL spawn the Rocket at the click position relative to the viewport.
2. WHEN the Game_Overlay is inactive, THE Game_Overlay SHALL set `pointer-events: none` on the canvas so that normal page interaction is unblocked.
3. WHEN the Game_Overlay is active, THE Game_Overlay SHALL set `pointer-events: auto` on the canvas to capture keyboard focus.
4. WHEN the user presses the Escape key while the Game_Overlay is active, THE Game_Overlay SHALL deactivate and remove all game entities from the canvas.

---

### Requirement 2: Canvas Setup

**User Story:** As a visitor, I want the game canvas to cover the full viewport and resize with the window, so that the game always fits my screen without layout shifts.

#### Acceptance Criteria

1. THE Game_Overlay SHALL render a `<canvas>` element with `position: fixed`, `top: 0`, `left: 0`, `width: 100vw`, and `height: 100vh`, layered above all page content via a high `z-index`.
2. WHEN the browser window is resized, THE Game_Overlay SHALL update the canvas `width` and `height` attributes to match the new `window.innerWidth` and `window.innerHeight` within one animation frame.
3. THE Game_Overlay SHALL use Angular's `ChangeDetectionStrategy.OnPush` and manage canvas state exclusively through Angular Signals.

---

### Requirement 3: Rocket Mechanics

**User Story:** As a player, I want to move the rocket smoothly around the screen using keyboard input, so that I can aim at targets.

#### Acceptance Criteria

1. THE Rocket SHALL be represented as a triangular polygon drawn with the Canvas 2D context, pointing upward by default.
2. WHEN the Arrow keys or WASD keys are held down, THE Input_Handler SHALL set the corresponding directional velocity components for the Rocket.
3. WHEN no directional keys are held, THE Rocket SHALL decelerate to a stop using a friction coefficient of `0.85` applied each frame.
4. WHILE the Game_Overlay is active, THE Game_Loop SHALL update the Rocket position each frame using the current velocity vector.
5. WHEN the Rocket reaches a canvas boundary, THE Game_Loop SHALL clamp the Rocket position so that the Rocket remains fully within the canvas bounds.
6. THE Rocket SHALL rotate to face the direction of movement when the velocity magnitude exceeds `0.5` pixels per frame.

---

### Requirement 4: Shooting System

**User Story:** As a player, I want to fire bullets from the rocket by pressing Spacebar, so that I can destroy targets.

#### Acceptance Criteria

1. WHEN the Spacebar key is pressed, THE Game_Overlay SHALL create a new Bullet at the Rocket's current position, travelling in the Rocket's current facing direction at `600` pixels per second.
2. THE Game_Overlay SHALL support a maximum of `20` simultaneous Bullets on screen.
3. WHEN a Bullet travels beyond the canvas boundary, THE Game_Loop SHALL remove that Bullet from the active Bullet list.
4. THE Renderer SHALL draw each active Bullet as a filled rectangle of `4 × 12` pixels aligned to the Bullet's travel direction.
5. WHEN the Spacebar is held continuously, THE Game_Overlay SHALL fire one Bullet every `200` milliseconds (fire-rate limit).

---

### Requirement 5: Target Detection

**User Story:** As a player, I want DOM elements marked as targets to be recognised by the game, so that I can aim at and destroy them.

#### Acceptance Criteria

1. WHEN the Game_Overlay activates, THE Game_Overlay SHALL query all elements with class `target` and store their bounding rectangles in the Target_Cache.
2. WHEN the browser window is resized, THE Game_Overlay SHALL refresh the Target_Cache within one animation frame.
3. THE Target_Cache SHALL store, for each Target, the `DOMRect` obtained via `getBoundingClientRect()` and a reference to the DOM element.
4. THE Collision_Handler SHALL use only the Target_Cache for positional data during the Game_Loop, performing no DOM queries inside the loop.

---

### Requirement 6: Collision Detection

**User Story:** As a player, I want bullets to collide with target elements, so that hitting a target triggers its destruction.

#### Acceptance Criteria

1. WHEN a Bullet's bounding rectangle intersects a Target's cached bounding rectangle, THE Collision_Handler SHALL mark that Target as destroyed and remove the Bullet from the active list.
2. THE Collision_Handler SHALL perform axis-aligned bounding box (AABB) intersection tests between each active Bullet and each non-destroyed Target each frame.
3. WHEN a Target is marked as destroyed, THE Game_Overlay SHALL remove that Target from the Target_Cache so that subsequent Bullets do not test against it.
4. IF no active Bullets exist, THEN THE Collision_Handler SHALL skip all intersection tests for that frame.

---

### Requirement 7: Break Animation

**User Story:** As a player, I want a visual break effect when I destroy a target, so that the destruction feels satisfying.

#### Acceptance Criteria

1. WHEN a Target is destroyed, THE Game_Overlay SHALL apply a CSS class to the Target element that transitions `transform: translateY(200px) rotate(15deg)` and `opacity: 0` over `600` milliseconds using `ease-in` timing.
2. WHEN the Break_Animation transition ends, THE Game_Overlay SHALL set `visibility: hidden` on the Target element so that it no longer occupies visual space.
3. THE Break_Animation SHALL not remove the Target element from the DOM during the animation to avoid layout reflow.

---

### Requirement 8: Explosion Effect

**User Story:** As a player, I want a brief particle explosion on the canvas when a target is hit, so that the impact is visually clear.

#### Acceptance Criteria

1. WHEN a Target is destroyed, THE Renderer SHALL spawn `8` particle objects at the collision point, each with a randomised velocity vector and a lifespan of `400` milliseconds.
2. WHILE a particle's lifespan has not elapsed, THE Renderer SHALL draw the particle as a filled circle with radius `3` pixels, with opacity proportional to the remaining lifespan fraction.
3. WHEN a particle's lifespan elapses, THE Game_Loop SHALL remove the particle from the active particle list.

---

### Requirement 9: Game Loop

**User Story:** As a player, I want the game to run at a consistent frame rate, so that movement and animations feel smooth.

#### Acceptance Criteria

1. WHILE the Game_Overlay is active, THE Game_Loop SHALL schedule the next frame using `requestAnimationFrame` at the end of each update cycle.
2. THE Game_Loop SHALL compute a delta-time value in seconds between consecutive frames and use it to scale all positional updates.
3. THE Game_Loop SHALL cap the delta-time value at `0.05` seconds (equivalent to 20 FPS minimum) to prevent large position jumps after tab focus loss.
4. WHEN the Game_Overlay is deactivated, THE Game_Loop SHALL cancel the pending `requestAnimationFrame` callback and perform no further updates.

---

### Requirement 10: Rendering

**User Story:** As a player, I want all game entities to be drawn clearly on the canvas each frame, so that I can see the game state accurately.

#### Acceptance Criteria

1. THE Renderer SHALL clear the entire canvas using `clearRect` at the start of each frame before drawing any entities.
2. THE Renderer SHALL draw the Rocket, all active Bullets, and all active particles each frame in that order.
3. THE Renderer SHALL use the Canvas 2D context's `save()` and `restore()` methods when applying per-entity transforms to avoid state leakage between draw calls.

---

### Requirement 11: Code Structure

**User Story:** As a developer, I want the game code to be modular and encapsulated, so that it integrates cleanly with the Angular codebase without polluting global scope.

#### Acceptance Criteria

1. THE Game_Overlay SHALL be implemented as a single Angular standalone component in `src/app/features/rocket-game/rocket-game-overlay.component.ts`.
2. THE Game_Overlay SHALL encapsulate the Rocket, Bullet management, Input_Handler, Collision_Handler, and Renderer as TypeScript classes or pure functions within the component file or co-located files under `src/app/features/rocket-game/`.
3. THE Game_Overlay SHALL expose no properties or methods on the global `window` object.
4. THE Game_Overlay SHALL use Angular's `inject()` function for any dependency injection and Angular Signals for all reactive state.
5. WHEN the Game_Overlay component is destroyed (Angular `ngOnDestroy`), THE Game_Overlay SHALL cancel the Game_Loop, remove all event listeners, and restore all modified Target element styles.
