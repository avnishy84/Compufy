# Compufy Technology Website — Technical Documentation

**Version:** 1.0  
**Last Updated:** March 2026  
**Status:** Production

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Tech Stack](#2-architecture--tech-stack)
3. [Implementation Details](#3-implementation-details)
4. [What Makes It Different](#4-what-makes-it-different)
5. [Scalability & Performance Optimization](#5-scalability--performance-optimization)
6. [Testing Strategy](#6-testing-strategy)
7. [CI/CD Pipeline](#7-cicd-pipeline)
8. [Deployment & Hosting](#8-deployment--hosting)
9. [Future Enhancements](#9-future-enhancements)

---

## 1. Project Overview

### Purpose

Compufy Technology is a corporate marketing website for a technology company. It presents the company's brand identity, service offerings, team information, and contact capabilities through a modern, high-performance web experience.

### Target Users

- **Prospective clients** evaluating Compufy's technology services
- **Recruiters and job seekers** exploring career opportunities
- **Business stakeholders** seeking company background and AI approach
- **General visitors** discovering the brand

### Key Features

- Dark-mode-first glassmorphism UI with smooth animations
- Server-side rendered pages for fast initial load and SEO
- Categorized service listings with individual detail pages
- Contact form with Firebase-backed submission and success state
- Careers page with job listings and application flow
- Interactive rocket game overlay — a hidden easter egg accessible from the navbar
- Fully responsive layout optimized for mobile, tablet, and desktop

---

## 2. Architecture & Tech Stack

### Frontend

| Concern | Technology |
|---|---|
| Framework | Angular 18.2 (standalone components, no NgModules) |
| Language | TypeScript 5.5 (strict mode) |
| Styling | Tailwind CSS 3.4 (utility-first, dark-mode via `class` strategy) |
| Icons | Lucide-Angular (tree-shakeable, registered centrally) |
| Animations | Angular Animations (built-in) |
| State | Angular Signals (`signal`, `computed`, `effect`) |
| HTTP | RxJS 7.8 streams via `HttpService` wrapper |
| Forms | Reactive Forms with typed `FormGroup<T>` / `FormControl<T>` |

### Backend & Infrastructure

| Concern | Technology |
|---|---|
| Backend | Firebase 12 + `@angular/fire` 18 |
| SSR | Angular SSR 18 + Express 4 |
| Analytics | Firebase Analytics (production only) |
| Environment | `src/environments/environment.ts` / `environment.prod.ts` |

### High-Level Architecture

```
Browser
  └── Angular Universal (SSR)
        ├── Express Server  ──────────────────► Firebase (Firestore / Analytics)
        └── Angular SPA
              ├── AppComponent (root shell + navbar + game overlay)
              ├── Lazy-loaded Feature Routes
              │     ├── HomeComponent
              │     ├── ServicesComponent / ServiceDetailsComponent
              │     ├── ContactComponent
              │     ├── WhoWeAreComponent
              │     ├── CareersComponent
              │     ├── AiApproachComponent
              │     └── PrivacyPolicy / TermsOfService
              ├── Shared UI Components (Button, Card, Input, SkeletonLoader)
              ├── Core Services (Firebase, HttpService, ErrorHandler)
              └── Rocket Game Overlay (canvas-based, SSR-safe)
```

### Design Patterns

- **Standalone components** — no NgModules; each component declares its own imports
- **OnPush change detection** — all components use `ChangeDetectionStrategy.OnPush` for minimal re-renders
- **Signal-first reactivity** — local and shared state managed via Angular Signals; RxJS reserved for HTTP streams only
- **Functional DI** — `inject()` used throughout instead of constructor injection
- **Feature-based folder structure** — each page is a self-contained feature directory
- **Pure data layer** — `src/app/data/` contains only interfaces, constants, and static data with zero Angular dependencies

---

## 3. Implementation Details

### Development Approach

The project was built following a spec-driven development methodology:

1. **Requirements** — user stories and acceptance criteria defined per feature
2. **Design** — component architecture, data models, and correctness properties documented
3. **Tasks** — granular implementation checklist derived from the design
4. **Implementation** — code written against the spec with tests validating each property
5. **Review** — diagnostics checked, tests run, and changes committed

### Key Modules & Responsibilities

#### `AppComponent`
Root shell. Renders the fixed navbar, router outlet, footer, error notification, and the rocket game overlay. Injects `GameStateService` to toggle the Play/Exit Game button.

#### `app.config.ts`
Application-level providers: router with scroll restoration, HTTP client with error interceptor, animations, custom error handler, Lucide icon registry, and Firebase eager initialization.

#### `app.routes.ts`
All routes use `loadComponent` with dynamic `import()` for code splitting. Wildcard redirects to home.

#### Core Services

| Service | Responsibility |
|---|---|
| `FirebaseService` | Initializes Firebase app and Analytics (production only) |
| `HttpService` | Wraps `HttpClient`; all HTTP calls go through this |
| `ErrorHandlerService` | Centralized error state via Signal |
| `AppErrorHandler` | Implements Angular's `ErrorHandler`; routes errors to `ErrorHandlerService` |
| `HttpErrorInterceptor` | Intercepts HTTP errors and forwards to `ErrorHandlerService` |

#### Shared Components

| Component | Responsibility |
|---|---|
| `ButtonComponent` | Reusable button with variant/size props |
| `InputComponent` | Styled form input |
| `CardComponent` | Generic card container |
| `SkeletonLoaderComponent` | Loading placeholder |
| `FooterComponent` | Site-wide footer |
| `ErrorNotificationComponent` | Toast-style error display |

#### Feature Components

| Feature | Route | Description |
|---|---|---|
| `HomeComponent` | `/` | Hero section, what-we-do, stats, CTA |
| `ServicesComponent` | `/services` | Categorized service grid |
| `ServiceDetailsComponent` | `/services/:id` | Individual service detail page |
| `ContactComponent` | `/contact` | Contact form with Firebase submission |
| `WhoWeAreComponent` | `/who-we-are` | Team and company background |
| `CareersComponent` | `/careers` | Job listings and application |
| `AiApproachComponent` | `/ai-approach` | AI methodology overview |

#### Rocket Game Overlay (`src/app/features/rocket-game/`)

A fully modular canvas-based mini-game embedded as an easter egg. Architecture:

| Module | Responsibility |
|---|---|
| `entities.ts` | TypeScript interfaces: `Rocket`, `Bullet`, `Particle`, `GameState`, `TargetEntry`, `InputState` |
| `input-handler.ts` | Keyboard event capture + touch state injection via `setTouch()` |
| `target-cache.ts` | Auto-discovers all shootable DOM elements; refreshes rects each frame |
| `collision-handler.ts` | Pure AABB intersection functions; no DOM access |
| `renderer.ts` | All Canvas 2D draw calls; pure functions with `save()`/`restore()` symmetry |
| `game-engine.ts` | RAF loop, physics, bullet/particle lifecycle, collision delegation, auto-scroll |
| `game-state.service.ts` | Shared `active` signal between overlay and navbar |
| `rocket-game-overlay.component.ts` | Angular component; wires all modules, handles lifecycle, renders mobile controls |

### Third-Party Integrations

| Integration | Purpose |
|---|---|
| Firebase Firestore | Contact form submission storage |
| Firebase Analytics | Production usage tracking (browser-only) |
| Lucide-Angular | SVG icon library (tree-shakeable, centrally registered) |
| Angular Animations | Scroll reveal and transition effects |

---

## 4. What Makes It Different

### Rocket Game Easter Egg

Most corporate websites are purely informational. Compufy embeds a fully functional 2D rocket game directly on top of the page content:

- Activated via a gamepad button in the navbar — available on every page
- The rocket flies over the live page; all visible DOM elements (headings, cards, buttons, nav links) become destructible targets
- Targets are auto-discovered at activation time — no manual tagging required
- Break animation (CSS transition) plays on destruction; elements fade and fall
- Particle explosion effect on hit
- Auto-scrolls the page as the rocket approaches viewport edges, with speed proportional to rocket velocity
- Full mobile support via virtual D-pad and fire button
- SSR-safe: all browser APIs guarded with `isPlatformBrowser`

### UX/UI Considerations

- **Dark-mode first** — slate-900 background with glassmorphism cards reduces eye strain and feels premium
- **OnPush everywhere** — eliminates unnecessary re-renders; UI stays snappy even with complex animations
- **Skeleton loaders** — content placeholders prevent layout shift during async loads
- **Scroll position restoration** — Angular router restores scroll to top on navigation
- **Error boundary** — global error handler surfaces issues as non-blocking toast notifications
- **Responsive by default** — Tailwind utility classes ensure correct layout at all breakpoints

### Comparison with Typical Solutions

| Aspect | Typical Corporate Site | Compufy |
|---|---|---|
| Rendering | Client-side only | SSR + hydration |
| State management | NgRx or BehaviorSubjects | Angular Signals (zero boilerplate) |
| Change detection | Default (full tree) | OnPush (targeted) |
| Icons | Font-based (all loaded) | Tree-shakeable SVG (only used icons) |
| Engagement feature | None | Interactive rocket game overlay |
| Testing | Unit tests only | Unit + property-based tests |

---

## 5. Scalability & Performance Optimization

### Code Splitting & Lazy Loading

Every feature route uses `loadComponent` with dynamic `import()`. The browser only downloads the JavaScript for a page when the user navigates to it. Initial bundle contains only the root shell.

### OnPush Change Detection

All components opt into `ChangeDetectionStrategy.OnPush`. Angular only checks a component's template when its Signal inputs change or an event fires within it — not on every global tick.

### Angular Signals

Signals replace zone-based reactivity for local state. Updates are surgical: only the specific template binding that reads a signal re-evaluates when it changes.

### SSR + Hydration

Angular Universal pre-renders HTML on the server. Users see fully rendered content on first load without waiting for JavaScript to execute. This also improves Core Web Vitals (LCP, FCP) and SEO indexability.

### Tree-Shakeable Icons

Lucide icons are registered explicitly in `app.config.ts`. Only the icons actually used are included in the production bundle — no icon font bloat.

### Production Build Budgets

Angular CLI enforces size budgets:
- Initial bundle: 500 kB warning / 1 MB error
- Per-component styles: 2 kB warning / 4 kB error

### Game Loop Performance

The rocket game uses `requestAnimationFrame` for rendering, delta-time capped at 50 ms to prevent large jumps after tab focus loss, and `getBoundingClientRect` refreshed per frame (cheap, avoids stale collision data after scroll).

### Firebase Analytics

Analytics is initialized only in production and only in the browser — zero overhead during development or SSR.

---

## 6. Testing Strategy

### Unit Tests (`.spec.ts`) — Jasmine 5 + Karma 6

Focused on concrete examples, edge cases, and component lifecycle:

| Module | Coverage |
|---|---|
| `InputHandler` | Key mapping, attach/detach, snapshot isolation, re-attach |
| `TargetCache` | Cache build, refresh, destroyed entry skipping |
| `CollisionHandler` | Overlapping/non-overlapping rects, multi-target/multi-bullet, pre-destroyed entries |
| `Renderer` | `save()`/`restore()` symmetry, draw order, clearRect before draws |
| `GameEngine` | Boundary clamping at exact edges, delta-time cap, bullet guards, particle removal |
| `RocketGameOverlayComponent` | Lifecycle (activate, deactivate, destroy), signal initial values, pointer-events, SSR guard |

### Property-Based Tests (`.pbt.spec.ts`) — fast-check 4

Each test runs a minimum of 100 iterations across arbitrary inputs, verifying general correctness:

| Property | Validates |
|---|---|
| P1: Rocket bounds clamping | Rocket always stays within `[HALF_SIZE, dim - HALF_SIZE]` for any canvas size |
| P2: Friction convergence | Applying friction 0.85 repeatedly never increases speed |
| P3: Bullet count cap | Active bullet count never exceeds 20 |
| P4: OOB bullet removal | Bullets outside canvas bounds are removed after one tick |
| P5: AABB correctness | `testAABB` matches reference implementation for arbitrary rect pairs |
| P6: Cache cleanup | Destroyed entries are absent from the live (non-destroyed) set |
| P7: Delta-time cap | Computed dt never exceeds 0.05 s for any timestamp pair |
| P8: Particle opacity | Opacity always in `[0, 1]` for any particle and timestamp |
| P9: Fire-rate limit | No two consecutive fire events less than 200 ms apart |

### Running Tests

```bash
npm test                    # run all tests (unit + PBT) via Karma, single pass
ng test --watch=false       # equivalent explicit command
```

---

## 7. CI/CD Pipeline

### Current Setup

The project uses Git for version control with a `master` branch. Deployment is manual via Angular CLI build + Firebase CLI or hosting provider upload.

### Recommended Pipeline (GitHub Actions)

```yaml
name: CI/CD
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm test -- --watch=false --browsers=ChromeHeadless

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/master'
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist }
      - run: npx firebase-tools deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

### Branching Strategy

| Branch | Purpose |
|---|---|
| `master` | Production-ready code |
| `feature/*` | New features (merge via PR) |
| `fix/*` | Bug fixes |
| `chore/*` | Dependency updates, refactors |

---

## 8. Deployment & Hosting

### Build

```bash
npm run build
# Output: dist/compufy-technology-website/
#   browser/   — static assets served to clients
#   server/    — Node.js SSR server bundle
```

### SSR Server

```bash
node dist/compufy-technology-website/server/server.mjs
```

The Express server handles SSR rendering and serves static assets. It can be deployed to any Node.js-compatible host (Firebase Functions, Cloud Run, Railway, Render, etc.).

### Environment Configuration

| File | Purpose |
|---|---|
| `src/environments/environment.ts` | Development config (Firebase dev project) |
| `src/environments/environment.prod.ts` | Production config (Firebase prod project) |

Angular CLI automatically swaps environment files at build time via `fileReplacements` in `angular.json`.

### Deployment Steps

1. Set production environment variables in `environment.prod.ts`
2. Run `npm run build`
3. Deploy `dist/compufy-technology-website/browser/` to static hosting (or)
4. Deploy `dist/compufy-technology-website/server/` to a Node.js host for SSR
5. Configure Firebase project credentials and Firestore rules

---

## 9. Future Enhancements

### Planned Improvements

- **CMS integration** — replace static `data/` files with a headless CMS (Contentful or Sanity) for content management without code deploys
- **Blog / Insights section** — article listing with SSR-rendered detail pages
- **i18n** — Angular's built-in internationalization for multi-language support
- **Dark/light mode toggle** — user-controlled theme preference persisted to `localStorage`
- **Rocket game leaderboard** — track destruction scores per session with Firebase Realtime Database
- **Game sound effects** — Web Audio API for shoot and explosion sounds
- **PWA support** — service worker for offline capability and installability

### Scaling Strategies

- **Edge SSR** — deploy the Express server to Cloudflare Workers or Vercel Edge for global low-latency rendering
- **CDN** — serve static assets from a CDN (Firebase Hosting already provides this globally)
- **Incremental Static Regeneration** — cache SSR responses at the edge with configurable TTL
- **Bundle analysis** — run `ng build --stats-json` + `webpack-bundle-analyzer` periodically to catch bundle size regressions
- **Firestore security rules** — tighten rules as data model grows; add server-side validation via Cloud Functions

---

*Documentation maintained alongside the codebase in `docs/technical-documentation.md`.*
