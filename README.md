# Compufy Technology Website

> **SaaS Engineering & IT Consulting** — Architecting secure, multi-tenant SaaS platforms and aligning your tech strategy for scale.

A modern, SSR-enabled corporate marketing website built with Angular 18, Firebase, and Tailwind CSS. Features a dark-mode glassmorphism UI, lazy-loaded routes, a Firebase-backed contact and careers system, and a hidden interactive rocket game easter egg.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Pages & Routes](#pages--routes)
- [Module Architecture](#module-architecture)
  - [Core](#core)
  - [Shared](#shared)
  - [Features](#features)
  - [Data Layer](#data-layer)
  - [Rocket Game Overlay](#rocket-game-overlay)
- [State Management](#state-management)
- [Testing Strategy](#testing-strategy)
- [Build & Deployment](#build--deployment)
- [Environment Configuration](#environment-configuration)
- [Commands Reference](#commands-reference)

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
# → http://localhost:4200

# Run tests
npm test

# Production build
npm run build

# Serve SSR build
node dist/compufy-technology-website/server/server.mjs
```

---

## Project Structure

```
src/
├── app/
│   ├── core/                   # Singleton services (Firebase, HTTP, error handling)
│   ├── shared/                 # Reusable stateless UI components
│   ├── features/               # Lazy-loaded page components
│   │   ├── home/               # Landing page (hero, what-we-do, stats, CTA)
│   │   ├── services/           # Service listings + detail pages
│   │   ├── contact/            # Contact form with Firebase submission
│   │   ├── careers/            # Careers page with application form
│   │   ├── who-we-are/         # Team and company background
│   │   ├── ai-approach/        # AI methodology overview
│   │   ├── coming-soon/        # Placeholder route
│   │   ├── privacy-policy/     # Legal page
│   │   ├── terms-of-service/   # Legal page
│   │   └── rocket-game/        # Canvas-based game overlay (easter egg)
│   ├── data/
│   │   ├── models/             # TypeScript interfaces (*.model.ts)
│   │   ├── constants/          # API endpoints, config constants
│   │   └── static/             # Hard-coded static data (*.data.ts)
│   ├── app.component.ts        # Root shell (navbar, footer, game overlay)
│   ├── app.config.ts           # App-level providers
│   └── app.routes.ts           # Route definitions (all lazy-loaded)
├── environments/               # environment.ts / environment.prod.ts
├── index.html                  # App shell with Open Graph / SEO meta tags
├── styles.css                  # Global Tailwind imports + break animation
├── main.ts                     # Browser bootstrap
├── main.server.ts              # SSR bootstrap
└── server.ts                   # Express SSR server
```

---

## Architecture Overview

```
Browser Request
      │
      ▼
Express SSR Server (Angular Universal)
      │  pre-renders HTML
      ▼
Angular SPA (hydrates in browser)
      │
      ├── AppComponent ──────────────────────────────────────────────┐
      │     ├── Fixed Navbar (Play button, nav links)                │
      │     ├── <router-outlet> (lazy feature components)            │
      │     ├── FooterComponent                                       │
      │     ├── ErrorNotificationComponent                            │
      │     └── RocketGameOverlayComponent (canvas, always mounted)  │
      │                                                               │
      ├── Core Services ──────────────────────────────────────────── │
      │     ├── FirebaseService → Firebase SDK (Firestore, Analytics) │
      │     ├── HttpService → HttpClient wrapper                      │
      │     ├── ErrorHandlerService → Signal-based error state        │
      │     └── HttpErrorInterceptor → routes HTTP errors             │
      │                                                               │
      └── Feature Routes (code-split, loaded on demand) ─────────────┘
            /           → HomeComponent
            /services   → ServicesComponent
            /services/:id → ServiceDetailsComponent
            /contact    → ContactComponent
            /careers    → CareersComponent
            /who-we-are → WhoWeAreComponent
            /ai-approach → AiApproachComponent
            /privacy-policy → PrivacyPolicyComponent
            /terms-of-service → TermsOfServiceComponent
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Angular (standalone, no NgModules) | 18.2 |
| Language | TypeScript (strict mode) | 5.5 |
| Styling | Tailwind CSS (utility-first, dark-mode via `class`) | 3.4 |
| Icons | Lucide-Angular (tree-shakeable SVG) | 0.577 |
| Animations | Angular Animations (built-in) | 18.2 |
| State | Angular Signals (`signal`, `computed`, `effect`) | 18.2 |
| HTTP | RxJS streams via `HttpService` wrapper | 7.8 |
| Forms | Typed Reactive Forms (`FormGroup<T>`) | 18.2 |
| Backend | Firebase + `@angular/fire` | 12 / 18 |
| SSR | Angular Universal + Express | 18.2 / 4 |
| Email | EmailJS browser SDK | 4.4 |
| Unit Tests | Jasmine + Karma | 5 / 6 |
| Property Tests | fast-check | 4 |
| Build | Angular CLI / `@angular-devkit/build-angular` | 18.2 |

---

## Pages & Routes

| Route | Component | Description |
|---|---|---|
| `/` | `HomeComponent` | Hero section, what-we-do overview, stats, CTA |
| `/services` | `ServicesComponent` | Categorized service cards grid |
| `/services/:id` | `ServiceDetailsComponent` | Individual service detail page |
| `/contact` | `ContactComponent` | Contact form → Firebase submission |
| `/careers` | `CareersComponent` | Values, why-join, application form |
| `/who-we-are` | `WhoWeAreComponent` | Team and company background |
| `/ai-approach` | `AiApproachComponent` | AI methodology and philosophy |
| `/privacy-policy` | `PrivacyPolicyComponent` | Legal privacy policy |
| `/terms-of-service` | `TermsOfServiceComponent` | Legal terms |
| `**` | redirect | Redirects to `/` |

All routes use `loadComponent` with dynamic `import()` — zero eager loading.

---

## Module Architecture

### Core

Located at `src/app/core/`. Singleton services provided at root level.

| File | Responsibility |
|---|---|
| `firebase.service.ts` | Initializes Firebase app; enables Analytics in production browser only |
| `http.service.ts` | Wraps `HttpClient`; all HTTP calls go through this service |
| `error-handler.service.ts` | Holds a Signal-based error state consumed by `ErrorNotificationComponent` |
| `app-error-handler.ts` | Implements Angular's `ErrorHandler`; routes uncaught errors to `ErrorHandlerService` |
| `http-error.interceptor.ts` | Functional interceptor; catches HTTP errors and forwards to `ErrorHandlerService` |
| `error-notification/` | Toast-style component that reads the error Signal and displays non-blocking alerts |

### Shared

Located at `src/app/shared/`. Stateless, reusable UI components with no business logic.

| Component | Props | Description |
|---|---|---|
| `ButtonComponent` | `variant`, `size` | Styled button with primary/secondary/ghost variants |
| `InputComponent` | `label`, `type`, `control` | Accessible form input with label binding |
| `CardComponent` | `title`, `icon` | Generic glassmorphism card container |
| `SkeletonLoaderComponent` | `lines`, `width` | Animated loading placeholder |
| `FooterComponent` | — | Site-wide footer with links and branding |
| `animations/` | — | Shared Angular animation definitions (`scrollReveal`, etc.) |

### Features

#### Home (`src/app/features/home/`)

Composed of sub-components:

| Sub-component | Description |
|---|---|
| `HeroSectionComponent` | Full-viewport hero with animated 3D CSS cube, headline, and CTA |
| `WhatWeDoSectionComponent` | Service overview cards |
| `StatsSectionComponent` | Animated metric counters |
| `HowWeWorkSectionComponent` | Process steps |
| `AiTeaserSectionComponent` | AI capabilities teaser |
| `CtaSectionComponent` | Call-to-action banner |

#### Services (`src/app/features/services/`)

| Component | Description |
|---|---|
| `ServicesComponent` | Root page; renders `ServiceCategoryComponent` groups |
| `ServiceCategoryComponent` | Groups service cards by category |
| `ServiceCardComponent` | Individual service card with icon, title, description, and navigation |
| `ServiceDetailsComponent` | Full detail page for a single service (route param `:id`) |

Data sourced from `src/app/data/static/services.data.ts`.

#### Contact (`src/app/features/contact/`)

| Component | Description |
|---|---|
| `ContactComponent` | Page shell; manages submission state |
| `ContactFormComponent` | Typed reactive form with validation |
| `SuccessMessageComponent` | Shown after successful Firebase submission |
| `validators.ts` | Custom form validators |

Submission flow: form validates → `FirebaseService` writes to Firestore → success/error state shown.

#### Careers (`src/app/features/careers/`)

Spec: `.kiro/specs/careers-page/requirements.md`

| Section | Description |
|---|---|
| Values Section | Minimum 3 company values with title + description, sourced from `careers.data.ts` |
| Why Join Section | Minimum 3 benefit items with icon + description, sourced from `careers.data.ts` |
| Application Form | Full Name, Designation, Years of Experience, Resume (PDF upload) |

**Form validation rules:**
- Full Name: required, min 2 non-whitespace characters
- Designation: required
- Years of Experience: required, range 0–50
- Resume: required, PDF only (`application/pdf`), max 2 MB

**Submission:** validated form data + resume file sent to `FirebaseService`; success replaces form with confirmation; errors shown inline without clearing fields.

Data model: `src/app/data/models/careers.model.ts`  
Static data: `src/app/data/static/careers.data.ts`

### Data Layer

Located at `src/app/data/`. Zero Angular dependencies — pure TypeScript.

```
data/
├── models/       # *.model.ts — TypeScript interfaces
├── constants/    # *.constants.ts — API endpoints, config values
└── static/       # *.data.ts — hard-coded content arrays
```

---

## Rocket Game Overlay

Spec: `.kiro/specs/rocket-game-overlay/`

An interactive easter egg accessible via the 🎮 button in the navbar. A full-screen HTML5 Canvas overlay renders on top of the page, letting the user pilot a rocket and destroy DOM elements.

### Module Map

```
src/app/features/rocket-game/
├── entities.ts                          # TypeScript interfaces
├── input-handler.ts                     # Keyboard + touch input
├── target-cache.ts                      # DOM element discovery & rect caching
├── collision-handler.ts                 # AABB intersection (pure functions)
├── renderer.ts                          # Canvas 2D draw calls (pure functions)
├── game-engine.ts                       # RAF loop, physics, lifecycle
├── game-state.service.ts                # Shared `active` signal (navbar ↔ overlay)
└── rocket-game-overlay.component.ts     # Angular component, mobile controls
```

### Data Flow

```
#game-trigger click
        │
        ▼
RocketGameOverlayComponent.activate()
        │  builds TargetCache, starts GameEngine
        ▼
GameEngine.loop() ─── each frame ──────────────────────────────────┐
        │                                                           │
        ├── InputHandler.getState()  ← keyboard / touch buttons    │
        ├── update rocket position (velocity + friction + clamp)    │
        ├── update bullets (move + OOB removal)                     │
        ├── create bullet if fire pressed (rate-limited 200 ms)     │
        ├── update particles (move + expiry removal)                │
        ├── TargetCache.refreshRects()  ← re-reads getBCR each frame│
        ├── CollisionHandler.runCollisions()                        │
        │       └── on hit: mark destroyed, spawn particles,        │
        │           apply .target-breaking CSS, set visibility:hidden│
        └── Renderer.renderFrame()  → Canvas 2D                    │
                └── clearRect → drawRocket → drawBullets → drawParticles
```

### Key Interfaces

```typescript
interface Rocket    { x, y, vx, vy, angle }
interface Bullet    { x, y, vx, vy }
interface Particle  { x, y, vx, vy, born, lifespan }
interface GameState { rocket, bullets[], particles[] }
interface TargetEntry { element, rect, destroyed }
interface InputState  { up, down, left, right, fire }
```

### Physics Constants

| Constant | Value | Description |
|---|---|---|
| `ACCEL` | 800 px/s² | Rocket acceleration |
| `FRICTION` | 0.85 | Per-frame velocity multiplier when no key held |
| `HALF_SIZE` | 15 px | Rocket boundary clamp margin |
| `BULLET_SPEED` | 600 px/s | Bullet travel speed |
| `MAX_BULLETS` | 20 | Maximum simultaneous bullets |
| `FIRE_RATE_MS` | 200 ms | Minimum time between shots |
| `PARTICLE_COUNT` | 8 | Particles spawned per destruction |
| `PARTICLE_LIFESPAN` | 400 ms | Particle lifetime |
| `DT_CAP` | 0.05 s | Maximum delta-time per frame |

### Mobile Controls

On touch devices (`sm:hidden` breakpoint), a virtual D-pad and fire button appear:
- D-pad (▲ ◀ ▼ ▶) — sets directional input via `InputHandler.setTouch()`
- Fire button (🚀) — holds `fire: true` while pressed
- All touch events call `preventDefault()` to block page scroll during gameplay

### SSR Safety

All browser APIs (`canvas`, `requestAnimationFrame`, `window`, `document`) are guarded with `isPlatformBrowser(inject(PLATFORM_ID))`. The component renders nothing on the server.

### Correctness Properties (Property-Based Tests)

| Property | Description |
|---|---|
| P1 | Rocket always stays within `[HALF_SIZE, dim - HALF_SIZE]` |
| P2 | Friction never increases rocket speed |
| P3 | Active bullet count never exceeds 20 |
| P4 | Out-of-bounds bullets removed after one tick |
| P5 | `testAABB` matches reference AABB implementation |
| P6 | Destroyed targets absent from live collision set |
| P7 | Delta-time never exceeds 0.05 s |
| P8 | Particle opacity always in `[0, 1]` |
| P9 | No two fire events less than 200 ms apart |

---

## State Management

Angular Signals are used for all reactive state. RxJS is reserved for HTTP streams only.

| Signal | Location | Description |
|---|---|---|
| `GameStateService.active` | `game-state.service.ts` | Game running state (shared navbar ↔ overlay) |
| `ErrorHandlerService.errorSignal` | `error-handler.service.ts` | Current error message |
| `RocketGameOverlayComponent.canvasWidth/Height` | overlay component | Canvas dimensions |
| Per-component form state | feature components | Submission loading, success, error flags |

---

## Testing Strategy

### Unit Tests — Jasmine 5 + Karma 6

Files: `*.spec.ts`

```bash
npm test                        # run all tests, single pass
ng test --watch=false           # equivalent
```

Coverage areas:
- `InputHandler` — key mapping, attach/detach, snapshot isolation
- `TargetCache` — build, refresh, destroyed entry skipping
- `CollisionHandler` — overlapping/non-overlapping rects, multi-target scenarios
- `Renderer` — `save()`/`restore()` symmetry, draw order, clearRect
- `GameEngine` — boundary clamping, delta-time cap, bullet/particle guards
- `RocketGameOverlayComponent` — lifecycle, signals, SSR guard
- `CareersComponent` — form validation, submission states
- `ContactComponent` — form validation, Firebase integration

### Property-Based Tests — fast-check 4

Files: `*.pbt.spec.ts`

Each test runs ≥ 100 iterations with arbitrary inputs. Tagged with:
```
// Feature: <feature-name>, Property N: <property text>
```

See [Rocket Game Overlay — Correctness Properties](#correctness-properties-property-based-tests) for the full list.

---

## Build & Deployment

### Production Build

```bash
npm run build
# Output:
#   dist/compufy-technology-website/browser/   ← static assets
#   dist/compufy-technology-website/server/    ← SSR Node.js bundle
```

### Bundle Budgets

| Type | Warning | Error |
|---|---|---|
| Initial bundle | 500 kB | 1 MB |
| Per-component styles | 2 kB | 4 kB |

### SSR Server

```bash
node dist/compufy-technology-website/server/server.mjs
```

Deployable to any Node.js host: Firebase Functions, Cloud Run, Railway, Render, Fly.io.

### Static Hosting (no SSR)

Deploy `dist/compufy-technology-website/browser/` to Firebase Hosting, Vercel, Netlify, or any CDN.

---

## Environment Configuration

| File | Used when |
|---|---|
| `src/environments/environment.ts` | `ng serve` / development build |
| `src/environments/environment.prod.ts` | `ng build` / production build |

Angular CLI swaps files automatically via `fileReplacements` in `angular.json`.

```typescript
// environment.ts structure
export const environment = {
  production: false,
  firebase: {
    apiKey: '...',
    authDomain: '...',
    projectId: '...',
    storageBucket: '...',
    messagingSenderId: '...',
    appId: '...',
  }
};
```

---

## Commands Reference

```bash
npm start                                              # dev server → localhost:4200
npm run build                                          # production build
npm run watch                                          # dev build in watch mode
npm test                                               # unit + PBT tests (single pass)
node dist/compufy-technology-website/server/server.mjs # serve SSR build

ng generate component src/app/features/my-feature/my-feature   # scaffold component
ng build --stats-json                                  # generate bundle stats
```

---

## Conventions

**Components** — always `standalone: true`, `ChangeDetectionStrategy.OnPush`, inline template, Tailwind utility classes, `inject()` for DI.

**File naming:**

| Type | Pattern |
|---|---|
| Component | `name.component.ts` |
| Service | `name.service.ts` |
| Model/Interface | `name.model.ts` |
| Static data | `name.data.ts` |
| Unit test | `name.spec.ts` |
| Property-based test | `name.pbt.spec.ts` |

**Tailwind tokens:**

| Token | Color |
|---|---|
| `brand-primary` | Indigo |
| `brand-secondary` | Violet |
| `brand-accent` | Cyan |
| `surface` | Slate-900 |
| `surface-card` | Slate-800 |
| `surface-glass` | rgba (glassmorphism) |

---

*Full technical documentation: [`docs/technical-documentation.md`](docs/technical-documentation.md)*
