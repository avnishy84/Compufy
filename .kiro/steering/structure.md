# Project Structure

## Root
```
src/
├── app/                  # Application source
├── environments/         # Environment configs (environment.ts / environment.prod.ts)
├── insights/             # Analytics / tracking HTML
├── index.html            # App shell
├── main.ts               # Browser bootstrap
├── main.server.ts        # SSR bootstrap
├── styles.css            # Global styles (Tailwind base imports)
└── server.ts             # Express SSR server
public/                   # Static assets (copied as-is to dist)
dist/                     # Build output (do not edit)
```

## App Structure
```
src/app/
├── core/                 # Singleton services and app-wide infrastructure
│   ├── http.service.ts
│   ├── error-handler.service.ts
│   ├── http-error.interceptor.ts
│   ├── firebase.service.ts
│   └── error-notification/
├── shared/               # Reusable, stateless UI components
│   ├── button/
│   ├── input/
│   ├── card/
│   ├── skeleton-loader/
│   └── animations/       # Shared Angular animation definitions
├── features/             # Page-level feature components (lazy-loaded)
│   ├── home/
│   │   ├── hero-section/
│   │   └── what-we-do/
│   ├── services/
│   │   ├── service-card/
│   │   └── service-category/
│   ├── contact/
│   │   ├── contact-form/
│   │   ├── success-message/
│   │   └── validators.ts
│   └── coming-soon/
├── data/                 # Pure data — no logic, no Angular deps
│   ├── models/           # TypeScript interfaces (*.model.ts)
│   ├── constants/        # API endpoints and other constants (*.constants.ts)
│   └── static/           # Hard-coded static data (*.data.ts)
├── app.routes.ts         # Route definitions
├── app.component.ts      # Root component
└── app.config.ts         # provideRouter, provideHttpClient, etc.
```

## Conventions

**Components**
- Always `standalone: true`, `ChangeDetectionStrategy.OnPush`
- Inline template (no separate `.html` file)
- Styling via Tailwind utility classes inline (no separate `.css` file unless global)
- Dependency injection via `inject()` function, not constructor params
- Signals for all local reactive state

**File Naming**
| Type | Pattern |
|---|---|
| Component | `name.component.ts` |
| Service | `name.service.ts` |
| Interceptor | `name.interceptor.ts` |
| Model/Interface | `name.model.ts` |
| Constants | `name.constants.ts` |
| Static data | `name.data.ts` |
| Unit test | `name.spec.ts` |
| Property-based test | `name.pbt.spec.ts` |

**Routing**
- All feature routes use `loadComponent` with dynamic `import()` (no eager loading)
- Wildcard `**` redirects to `''`

**Services**
- Core services: `providedIn: 'root'` singleton
- HTTP calls go through `HttpService` wrapper, not `HttpClient` directly
- Errors handled centrally via `HttpErrorInterceptor` + `ErrorHandlerService`

**Tailwind Custom Tokens**
- Brand colors: `brand-primary` (indigo), `brand-secondary` (violet), `brand-accent` (cyan)
- Surface colors: `surface` (slate-900), `surface-card` (slate-800), `surface-glass` (rgba)
- Backdrop blur: `backdrop-blur-glass`
