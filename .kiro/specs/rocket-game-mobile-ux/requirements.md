# Requirements Document

## Introduction

The rocket game is a browser-based mini 2D game embedded in the Compufy Technology website. On desktop, players activate it by clicking `#game-trigger` and exit with the Escape key. On mobile, neither mechanism exists, the virtual D-pad lacks visual polish, there is no score feedback, and the control layout is not adapted for landscape orientation. This feature improves the complete mobile UI/UX lifecycle: game discovery and activation, in-game controls ergonomics, heads-up display, orientation handling, and accessible touch interactions — without breaking the existing desktop experience.

---

## Glossary

- **Overlay**: The `RocketGameOverlayComponent` that renders the canvas and virtual controls as a fixed full-screen layer.
- **Mobile_Trigger**: A touch-friendly button rendered on small screens (`< sm` breakpoint) that activates the game.
- **Exit_Button**: A touch-friendly button rendered inside the Overlay while the game is active that deactivates the game.
- **D-pad**: The four-directional virtual control cluster used to steer the rocket.
- **Fire_Button**: The circular button that fires bullets from the rocket.
- **HUD**: The heads-up display showing the live score (destroyed target count) during gameplay.
- **Start_Screen**: A full-screen modal shown on mobile before the game loop begins, explaining controls and providing a "Play" call-to-action.
- **End_Screen**: A full-screen modal shown on mobile after all targets are destroyed, displaying the final score and a "Play Again" option.
- **Score**: The integer count of targets destroyed in the current session.
- **InputHandler**: The existing class that normalises keyboard and touch inputs into a shared `InputState`.
- **GameEngine**: The existing class that runs the RAF game loop.
- **GameStateService**: The existing Angular service that holds the `active` signal shared between the hero section and the Overlay.
- **Landscape_Mode**: A device orientation where `window.innerWidth > window.innerHeight`.
- **Portrait_Mode**: A device orientation where `window.innerWidth <= window.innerHeight`.

---

## Requirements

### Requirement 1: Mobile Game Activation

**User Story:** As a mobile user, I want a visible, touch-friendly way to start the rocket game, so that I can discover and launch the game without needing a mouse click or keyboard.

#### Acceptance Criteria

1. WHEN the viewport width is less than the `sm` Tailwind breakpoint (640 px), THE Mobile_Trigger SHALL be rendered as a visible button in the hero section adjacent to the 3D tech cube.
2. WHEN a user taps the Mobile_Trigger, THE Overlay SHALL activate the game and display the Start_Screen.
3. THE Mobile_Trigger SHALL have a minimum touch target size of 44 × 44 px in accordance with WCAG 2.5.5.
4. THE Mobile_Trigger SHALL display a rocket emoji or icon and a short label (e.g., "Play Game") so that its purpose is immediately clear.
5. WHEN the viewport width is 640 px or greater, THE Mobile_Trigger SHALL NOT be rendered, preserving the existing desktop activation flow via `#game-trigger`.

---

### Requirement 2: Mobile Game Deactivation

**User Story:** As a mobile user, I want a visible exit button while the game is running, so that I can leave the game without needing the Escape key.

#### Acceptance Criteria

1. WHEN the game is active and the viewport width is less than 640 px, THE Exit_Button SHALL be rendered in the top-right corner of the Overlay at z-index 10001 or higher.
2. WHEN a user taps the Exit_Button, THE Overlay SHALL call `deactivate()`, stop the GameEngine, clear the canvas, and hide all mobile controls.
3. THE Exit_Button SHALL have a minimum touch target size of 44 × 44 px.
4. THE Exit_Button SHALL display a clearly recognisable close icon (e.g., "✕") with an `aria-label` of "Exit game".
5. WHEN the viewport width is 640 px or greater, THE Exit_Button SHALL NOT be rendered.

---

### Requirement 3: Start Screen

**User Story:** As a first-time mobile player, I want a brief onboarding screen before the game starts, so that I understand the controls before I begin.

#### Acceptance Criteria

1. WHEN the Mobile_Trigger is tapped, THE Start_Screen SHALL be displayed as a full-screen overlay above the canvas before the GameEngine loop begins.
2. THE Start_Screen SHALL display the D-pad and Fire_Button icons with short labels explaining their function.
3. THE Start_Screen SHALL include a "Play" button that, when tapped, dismisses the Start_Screen and starts the GameEngine loop.
4. THE Start_Screen SHALL include an "Exit" button that, when tapped, dismisses the Start_Screen and deactivates the Overlay without starting the game.
5. WHILE the Start_Screen is visible, THE GameEngine SHALL NOT be running.
6. THE Start_Screen SHALL use the existing dark-mode glassmorphism visual style consistent with the site's design system.

---

### Requirement 4: End Screen

**User Story:** As a mobile player, I want a completion screen after destroying all targets, so that I can see my final score and choose to play again.

#### Acceptance Criteria

1. WHEN all targets in the TargetCache are marked destroyed, THE End_Screen SHALL be displayed over the canvas.
2. THE End_Screen SHALL display the final Score value.
3. THE End_Screen SHALL include a "Play Again" button that, when tapped, resets the game state and restarts the GameEngine loop from the beginning.
4. THE End_Screen SHALL include an "Exit" button that, when tapped, deactivates the Overlay.
5. WHILE the End_Screen is visible, THE GameEngine SHALL NOT be running.
6. THE End_Screen SHALL use the existing dark-mode glassmorphism visual style consistent with the site's design system.

---

### Requirement 5: Heads-Up Display (Score)

**User Story:** As a mobile player, I want to see my current score while playing, so that I have feedback on my progress.

#### Acceptance Criteria

1. WHEN the game is active and the viewport width is less than 640 px, THE HUD SHALL be rendered in the top-left corner of the Overlay.
2. THE HUD SHALL display the current Score as an integer count of destroyed targets, updated in real time each time a target is destroyed.
3. THE HUD SHALL remain visible and legible above the canvas at all times during gameplay without obscuring the rocket's spawn area.
4. THE HUD SHALL use a semi-transparent background consistent with the existing control button style (`rgba(99,102,241,0.25)` base) so it does not fully block underlying page content.
5. WHEN the game is not active, THE HUD SHALL NOT be rendered.

---

### Requirement 6: D-pad Visual Polish and Press Feedback

**User Story:** As a mobile player, I want the D-pad buttons to give clear visual feedback when pressed, so that I can confirm my inputs are registered.

#### Acceptance Criteria

1. THE D-pad SHALL render four directional buttons (up, down, left, right) arranged in a cross/plus layout with the centre cell empty.
2. WHEN a D-pad button is pressed (touchstart), THE D-pad_Button SHALL transition its background to `rgba(99,102,241,0.65)` and scale to `0.92` within 60 ms using a CSS transition.
3. WHEN a D-pad button is released (touchend or touchcancel), THE D-pad_Button SHALL transition back to its resting state within 120 ms.
4. THE D-pad buttons SHALL each have a minimum touch target size of 52 × 52 px.
5. THE D-pad SHALL use `touch-action: none` on each button to prevent scroll interference during gameplay.
6. THE D-pad buttons SHALL each have a descriptive `aria-label` ("Move up", "Move down", "Move left", "Move right").

---

### Requirement 7: Fire Button Visual Polish and Press Feedback

**User Story:** As a mobile player, I want the fire button to give clear visual feedback when pressed, so that I know my shots are being fired.

#### Acceptance Criteria

1. THE Fire_Button SHALL be rendered as a circular button with a minimum diameter of 72 px.
2. WHEN the Fire_Button is pressed (touchstart), THE Fire_Button SHALL transition its background to `rgba(239,68,68,0.65)` and scale to `0.92` within 60 ms using a CSS transition.
3. WHEN the Fire_Button is released (touchend or touchcancel), THE Fire_Button SHALL transition back to its resting state within 120 ms.
4. THE Fire_Button SHALL have `aria-label` of "Fire".
5. THE Fire_Button SHALL use `touch-action: none` to prevent scroll interference.

---

### Requirement 8: Control Layout — Portrait Mode

**User Story:** As a mobile player in portrait orientation, I want the controls positioned so they do not obscure the game canvas, so that I can see the rocket and targets while playing.

#### Acceptance Criteria

1. WHILE the device is in Portrait_Mode and the game is active, THE D-pad SHALL be positioned in the bottom-left corner with at least 24 px clearance from the screen edges.
2. WHILE the device is in Portrait_Mode and the game is active, THE Fire_Button SHALL be positioned in the bottom-right corner with at least 24 px clearance from the screen edges.
3. WHILE the device is in Portrait_Mode, THE HUD SHALL be positioned in the top-left corner with at least 16 px clearance from the screen edges.
4. WHILE the device is in Portrait_Mode, THE Exit_Button SHALL be positioned in the top-right corner with at least 16 px clearance from the screen edges.
5. WHILE the device is in Portrait_Mode, the combined height of the bottom control row (D-pad + Fire_Button) SHALL NOT exceed 160 px so that at least 60% of the viewport height remains available for the canvas.

---

### Requirement 9: Control Layout — Landscape Mode

**User Story:** As a mobile player in landscape orientation, I want the controls repositioned to the sides of the screen, so that the full vertical canvas area is usable for gameplay.

#### Acceptance Criteria

1. WHILE the device is in Landscape_Mode and the game is active, THE D-pad SHALL be positioned in the bottom-left corner with at least 16 px clearance from the screen edges.
2. WHILE the device is in Landscape_Mode and the game is active, THE Fire_Button SHALL be positioned in the bottom-right corner with at least 16 px clearance from the screen edges.
3. WHILE the device is in Landscape_Mode, THE D-pad buttons SHALL be scaled to 44 × 44 px to reduce vertical footprint.
4. WHILE the device is in Landscape_Mode, THE Fire_Button SHALL be scaled to 60 px diameter to reduce vertical footprint.
5. WHEN the device orientation changes, THE Overlay SHALL update the control layout within one animation frame without restarting the GameEngine.

---

### Requirement 10: Orientation Change Handling

**User Story:** As a mobile player, I want the game canvas and controls to adapt when I rotate my device, so that gameplay is not interrupted by orientation changes.

#### Acceptance Criteria

1. WHEN the device orientation changes (window `resize` event), THE Overlay SHALL update `canvasWidth` and `canvasHeight` signals to match the new `window.innerWidth` and `window.innerHeight` within one RAF tick.
2. WHEN the device orientation changes, THE TargetCache SHALL refresh all `DOMRect` snapshots within the same RAF tick.
3. WHEN the device orientation changes, THE GameEngine SHALL continue running without interruption; the rocket position SHALL be clamped to the new canvas bounds.
4. IF the new canvas bounds after an orientation change would place the rocket outside the playfield, THEN THE GameEngine SHALL clamp the rocket position to `[HALF_SIZE, newWidth - HALF_SIZE] × [HALF_SIZE, newHeight - HALF_SIZE]` before the next rendered frame.

---

### Requirement 11: Touch Accessibility

**User Story:** As a mobile user relying on assistive technology, I want all interactive game controls to be accessible, so that the game is usable with screen readers and switch access.

#### Acceptance Criteria

1. THE Mobile_Trigger SHALL have a descriptive `aria-label` attribute.
2. THE Exit_Button SHALL have `aria-label="Exit game"`.
3. THE D-pad buttons SHALL each have a descriptive `aria-label` as specified in Requirement 6.6.
4. THE Fire_Button SHALL have `aria-label="Fire"` as specified in Requirement 7.4.
5. THE Start_Screen "Play" button SHALL have `aria-label="Start game"`.
6. THE Start_Screen "Exit" button SHALL have `aria-label="Cancel and exit"`.
7. THE End_Screen "Play Again" button SHALL have `aria-label="Play again"`.
8. THE End_Screen "Exit" button SHALL have `aria-label="Exit game"`.
9. WHEN the Start_Screen is displayed, THE Overlay SHALL set `aria-live="polite"` on the screen container so screen readers announce its appearance.
10. WHEN the End_Screen is displayed, THE Overlay SHALL set `aria-live="polite"` on the screen container so screen readers announce the final score.

---

### Requirement 12: SSR Safety

**User Story:** As a developer, I want all new mobile UX code to be SSR-safe, so that server-side rendering does not throw errors.

#### Acceptance Criteria

1. THE Overlay SHALL guard all new uses of `window`, `navigator`, and `screen` APIs with `isPlatformBrowser` before execution.
2. IF `isPlatformBrowser` returns false, THEN THE Overlay SHALL render no mobile controls and perform no DOM measurements.
3. THE Score signal SHALL be initialised to `0` and SHALL be readable without browser APIs.
