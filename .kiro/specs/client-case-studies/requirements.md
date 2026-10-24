# Requirements Document

## Introduction

The Client Case Studies feature adds a "Case Studies / Client Work" section to the Compufy Technology website. It consists of two parts: a card-based preview section on the homepage that showcases completed client projects, and a dedicated detail page per project that covers the problem context, technical solution, and a link to the live project. All data is static — no backend is required.

## Glossary

- **Case_Study**: A record describing a single completed client project, including its problem statement, technical solution, and a link to the live deployment.
- **Case_Studies_Section**: The homepage section that renders a grid of Case_Study_Card components.
- **Case_Study_Card**: A summary card displayed in the Case_Studies_Section that shows the project title, client name, a short description, and a representative tag list.
- **Detail_Page**: The standalone route (`/case-studies/:slug`) that renders the full content of a single Case_Study.
- **Static_Data**: Hard-coded TypeScript data in `src/app/data/static/case-studies.data.ts` — no API calls are made.
- **Slug**: A URL-safe, kebab-case string that uniquely identifies a Case_Study (e.g. `retail-inventory-platform`).
- **Live_Demo_Button**: A call-to-action element on the Detail_Page that opens the client's live project URL in a new browser tab.
- **Router**: The Angular Router used for client-side navigation between routes.

---

## Requirements

### Requirement 1: Static Case Study Data

**User Story:** As a developer, I want all case study content defined in a single static data file, so that adding or editing projects requires no backend changes.

#### Acceptance Criteria

1. THE Static_Data SHALL define a `CaseStudy` interface with the fields: `id` (string), `slug` (Slug), `clientName` (string), `projectTitle` (string), `shortDescription` (string), `tags` (string array), `problemStatement` (string), `solution` (string), `technicalDepth` (string), and `liveDemoUrl` (string).
2. THE Static_Data SHALL export a constant array `CASE_STUDIES_DATA` of type `CaseStudy[]` containing at least two entries.
3. THE Static_Data SHALL export a `CASE_STUDIES_BY_SLUG` lookup map of type `Map<string, CaseStudy>` derived from `CASE_STUDIES_DATA`.
4. WHEN two entries in `CASE_STUDIES_DATA` share the same `slug` value, THE Static_Data SHALL be considered invalid and the build SHALL fail via a TypeScript compile-time assertion or runtime guard.

---

### Requirement 2: Homepage Case Studies Section

**User Story:** As a site visitor, I want to see a grid of client project cards on the homepage, so that I can quickly browse the work Compufy Technology has delivered.

#### Acceptance Criteria

1. THE Case_Studies_Section SHALL render within the `HomeComponent` template, positioned after the existing `HowWeWorkSection` and before the `CtaSection`.
2. THE Case_Studies_Section SHALL display one `Case_Study_Card` per entry in `CASE_STUDIES_DATA`.
3. WHEN `CASE_STUDIES_DATA` contains zero entries, THE Case_Studies_Section SHALL render nothing (no empty container or placeholder).
4. THE Case_Study_Card SHALL display the `projectTitle`, `clientName`, `shortDescription`, and `tags` fields of its associated `CaseStudy`.
5. THE Case_Study_Card SHALL use the `surface-card` background token and `brand-primary`/`brand-accent` accent tokens consistent with the site's dark-mode design system.
6. THE Case_Studies_Section SHALL be implemented as a standalone Angular component with `ChangeDetectionStrategy.OnPush`.

---

### Requirement 3: Card Navigation to Detail Page

**User Story:** As a site visitor, I want to click a project card and be taken to its detail page, so that I can read the full story behind the project.

#### Acceptance Criteria

1. WHEN a visitor clicks a `Case_Study_Card`, THE Router SHALL navigate to `/case-studies/:slug` where `:slug` is the `slug` field of the selected `CaseStudy`.
2. THE Case_Study_Card SHALL use Angular `RouterLink` for navigation (not imperative `router.navigate`) so that right-click / open-in-new-tab works correctly.
3. WHEN a `Case_Study_Card` receives keyboard focus and the Enter key is pressed, THE Router SHALL navigate to the corresponding Detail_Page.

---

### Requirement 4: Case Study Detail Page

**User Story:** As a site visitor, I want to read the full technical story of a project on a dedicated page, so that I can understand the problem, the solution, and the depth of work involved.

#### Acceptance Criteria

1. THE Detail_Page SHALL be registered as a lazy-loaded route at path `/case-studies/:slug` using `loadComponent` in `app.routes.ts`.
2. WHEN the Detail_Page is loaded, THE Detail_Page SHALL read the `:slug` route parameter and look up the matching `CaseStudy` from `CASE_STUDIES_BY_SLUG`.
3. THE Detail_Page SHALL render the `projectTitle`, `clientName`, `problemStatement`, `solution`, `technicalDepth`, and `tags` fields of the resolved `CaseStudy`.
4. THE Detail_Page SHALL be implemented as a standalone Angular component with `ChangeDetectionStrategy.OnPush`.
5. THE Detail_Page SHALL use Angular Signals (`signal()` / `computed()`) for all local reactive state — no `BehaviorSubject` or `Observable` for UI state.

---

### Requirement 5: Live Demo Button

**User Story:** As a site visitor, I want a clearly visible button on the detail page that takes me to the live project, so that I can see the finished product in action.

#### Acceptance Criteria

1. THE Detail_Page SHALL render a `Live_Demo_Button` when the resolved `CaseStudy` has a non-empty `liveDemoUrl`.
2. WHEN a visitor clicks the `Live_Demo_Button`, THE Detail_Page SHALL open `liveDemoUrl` in a new browser tab with `target="_blank"` and `rel="noopener noreferrer"`.
3. WHEN the resolved `CaseStudy` has an empty `liveDemoUrl`, THE Detail_Page SHALL not render the `Live_Demo_Button`.
4. THE `Live_Demo_Button` SHALL use the shared `ButtonComponent` with the `primary` variant.

---

### Requirement 6: Unknown Slug Handling

**User Story:** As a site visitor, I want to be redirected gracefully if I navigate to a case study URL that does not exist, so that I never see a broken or empty page.

#### Acceptance Criteria

1. WHEN the `:slug` route parameter does not match any entry in `CASE_STUDIES_BY_SLUG`, THE Detail_Page SHALL redirect the visitor to the home route (`/`).
2. WHEN a redirect occurs due to an unknown slug, THE Detail_Page SHALL not render any partial content before the redirect completes.

---

### Requirement 7: SEO Metadata

**User Story:** As a site owner, I want each case study detail page to have a unique page title and meta description, so that search engines can index individual projects correctly.

#### Acceptance Criteria

1. WHEN the Detail_Page resolves a `CaseStudy`, THE Detail_Page SHALL set the browser document title to `"{projectTitle} | Compufy Technology"` using the existing `SeoService`.
2. WHEN the Detail_Page resolves a `CaseStudy`, THE Detail_Page SHALL set the `description` meta tag to the `shortDescription` field of the resolved `CaseStudy` using the existing `SeoService`.
3. WHEN the Detail_Page redirects due to an unknown slug, THE Detail_Page SHALL not update the document title or meta description.
