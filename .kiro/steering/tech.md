# Tech Stack

## Core
- **Framework**: Angular 18.2 (standalone components, no NgModules)
- **Language**: TypeScript 5.5 (strict mode)
- **Styling**: Tailwind CSS 3.4 (utility-first, dark-mode via `class` strategy)
- **Icons**: Lucide-Angular (tree-shakeable)
- **Animations**: Angular Animations (built-in)

## State & Reactivity
- Angular Signals (`signal()`, `computed()`, `effect()`) for local/shared state
- RxJS 7.8 for HTTP streams only — prefer Signals over Subjects for UI state
- Reactive Forms with typed `FormGroup<T>` / `FormControl<T>`

## Backend & Infrastructure
- **Firebase** 12 + `@angular/fire` 18 for backend services
- **Angular SSR** 18 + Express 4 for server-side rendering
- Environment configs in `src/environments/`

## Testing
- **Jasmine** 5 + **Karma** 6 for unit tests (`.spec.ts`)
- **fast-check** 4 for property-based tests (`.pbt.spec.ts`)
- Run tests single-pass with `ng test --watch=false`

## Build
- Angular CLI 18 / `@angular-devkit/build-angular`
- Output: `dist/compufy-technology-website/`
- Production budgets: 500 kB initial warning / 1 MB error; 2 kB / 4 kB per component style

## Common Commands

```bash
npm start                                        # dev server (ng serve)
npm run build                                    # production build
npm run watch                                    # dev build in watch mode
npm test                                         # run unit + PBT tests via Karma
node dist/compufy-technology-website/server/server.mjs  # serve SSR build
```

## TypeScript Strictness
All of the following are enabled — do not disable them:
`strict`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`
