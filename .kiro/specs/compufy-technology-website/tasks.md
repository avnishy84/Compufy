# Tasks

## Task List

- [x] 1. Project scaffolding and configuration
  - [x] 1.1 Generate a new Angular (v18+) project with standalone components and routing enabled
  - [x] 1.2 Install and configure Tailwind CSS with the custom `theme.extend` palette defined in the design
  - [x] 1.3 Install `lucide-angular` and `fast-check` dependencies
  - [x] 1.4 Create the folder structure: `src/app/core/`, `src/app/shared/`, `src/app/features/`, `src/app/data/`, `src/app/theme/`
  - [x] 1.5 Configure `tailwind.config.ts` with brand, surface, and backdropBlur tokens

- [x] 2. Data layer
  - [x] 2.1 Create `data/models/service.model.ts` with `ServiceCategory` and `Service` interfaces
  - [x] 2.2 Create `data/models/contact.model.ts` with `ContactFormValue` interface
  - [x] 2.3 Create `data/models/error.model.ts` with `AppError` interface
  - [x] 2.4 Create `data/constants/api.constants.ts` with `API_ENDPOINTS`
  - [x] 2.5 Create `data/static/services.data.ts` with static `SERVICES_DATA` array covering Web Development, Digital Solutions, and P.I.T.C. categories (at least 3 services each)

- [x] 3. Core layer
  - [x] 3.1 Create `core/error-handler.service.ts` with `signal<AppError | null>(null)`, `handleHttpError()`, `setError()`, and `clearError()` methods
  - [x] 3.2 Create `core/http-error.interceptor.ts` as a functional interceptor that catches 4xx/5xx responses and delegates to `ErrorHandlerService`
  - [x] 3.3 Create `core/app-error-handler.ts` implementing Angular's `ErrorHandler` interface
  - [x] 3.4 Create `core/http.service.ts` as a typed HTTP wrapper using `HttpClient` with `toSignal()`
  - [x] 3.5 Register `AppErrorHandler`, `provideHttpClient(withInterceptors([httpErrorInterceptor]))` in `app.config.ts`
  - [x] 3.6 Create `core/error-notification/error-notification.component.ts` as a standalone OnPush component that reads `errorSignal` and renders a dismissible notification banner

- [x] 4. Shared UI components
  - [x] 4.1 Create `shared/button/button.component.ts` — standalone OnPush, accepts `variant`, `size`, `disabled`, `type` via `input()`
  - [x] 4.2 Create `shared/input/input.component.ts` — standalone OnPush, accepts `label`, `control`, `type`, `placeholder`; renders inline validation errors when control is invalid and touched
  - [x] 4.3 Create `shared/card/card.component.ts` — standalone OnPush, accepts `title`, `description`, `icon`; applies glassmorphism Tailwind classes
  - [x] 4.4 Create `shared/skeleton-loader/skeleton-loader.component.ts` — standalone OnPush, accepts `rows` and `height`; renders animated shimmer placeholder
  - [x] 4.5 Create `shared/animations/animations.ts` exporting `scrollReveal`, `staggerCards`, and `successFade` Angular Animation triggers

- [x] 5. Routing
  - [x] 5.1 Define `app.routes.ts` with lazy `loadComponent` routes for `/` (Home), `/services` (Services), `/contact` (Contact), and a `**` wildcard redirect to `/`
  - [x] 5.2 Configure `provideRouter` with `withComponentInputBinding()` and `PathLocationStrategy` in `app.config.ts`
  - [x] 5.3 Update `app.component.ts` to render `<router-outlet>` and the `ErrorNotificationComponent` conditionally on `errorSignal`

- [x] 6. Home feature
  - [x] 6.1 Create `features/home/home.component.ts` as the page shell (standalone, OnPush, lazy-loaded)
  - [x] 6.2 Create `features/home/hero-section/hero-section.component.ts` with full-viewport layout, headline, subheadline, CTA button (using `ButtonComponent`), and a CSS/SVG 3D tech element
  - [x] 6.3 Create `features/home/what-we-do/what-we-do-section.component.ts` that reads `SERVICES_DATA` and renders a summary grid of category cards using `CardComponent`
  - [x] 6.4 Wire CTA button click to `Router.navigate(['/services'])`
  - [x] 6.5 Apply `scrollReveal` animation trigger to hero and what-we-do sections

- [x] 7. Services feature
  - [x] 7.1 Create `features/services/services.component.ts` as the page shell (standalone, OnPush, lazy-loaded)
  - [x] 7.2 Create `features/services/service-category/service-category.component.ts` that renders a labeled category group
  - [x] 7.3 Create `features/services/service-card/service-card.component.ts` that renders a glassmorphism card with Lucide icon, title, and description
  - [x] 7.4 Apply `staggerCards` animation trigger to the card list in `ServicesComponent`
  - [x] 7.5 Ensure responsive grid layout: single column on mobile, multi-column on desktop via Tailwind breakpoint classes

- [x] 8. Contact feature
  - [x] 8.1 Create `features/contact/contact.component.ts` as the page shell (standalone, OnPush, lazy-loaded); owns the typed `FormGroup<ContactFormControls>`
  - [x] 8.2 Implement custom validators: `minLengthTrimmed(2)` for fullName, Angular's `Validators.email` for email, `Validators.required` for subject, `Validators.minLength(10)` for message
  - [x] 8.3 Create `features/contact/contact-form/contact-form.component.ts` that renders four `InputComponent` fields and a submit `ButtonComponent`
  - [x] 8.4 Implement submit handler: if form invalid, mark all controls touched; if valid, call HTTP service and show success state
  - [x] 8.5 Create `features/contact/success-message/success-message.component.ts` with `successFade` animation trigger
  - [x] 8.6 Apply `scrollReveal` animation to the form section on page load

- [x] 9. Tests
  - [x] 9.1 Write unit tests for `ErrorHandlerService` (set/clear error signal)
  - [x] 9.2 Write unit tests for `HttpErrorInterceptor` (2xx passes through; 4xx/5xx delegates to service)
  - [x] 9.3 Write unit tests for `AppErrorHandler` (calls `setError` on unhandled error)
  - [x] 9.4 Write unit tests for `InputComponent` (shows error when invalid+touched; hides when untouched)
  - [x] 9.5 Write unit tests for `ContactComponent` (form has 4 controls; invalid submit marks all touched; valid submit triggers success)
  - [x] 9.6 Write unit tests for `app.routes.ts` (routes for /, /services, /contact exist; wildcard redirects to /)
  - [x] 9.7 Write property-based tests (fast-check) for fullName validator — P5: strings < 2 chars → error; ≥ 2 chars → null
  - [x] 9.8 Write property-based tests (fast-check) for email validator — P6: invalid email strings → error; valid emails → null
  - [x] 9.9 Write property-based tests (fast-check) for subject validator — P7: empty/whitespace → error; non-empty → null
  - [x] 9.10 Write property-based tests (fast-check) for message validator — P8: < 10 chars → error; ≥ 10 chars → null
  - [x] 9.11 Write property-based tests (fast-check) for invalid form submission — P10: any invalid form → all controls touched after submit
  - [x] 9.12 Write property-based tests (fast-check) for HTTP error signal propagation — P12: 4xx/5xx status → errorSignal truthy with status code
  - [x] 9.13 Write property-based tests (fast-check) for service card rendering — P4: any Service object → rendered card contains title, description, iconName
  - [x] 9.14 Write property-based tests (fast-check) for service category grouping — P3: any services list → each card appears under its declared category
