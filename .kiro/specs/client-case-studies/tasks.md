# Tasks: Client Case Studies

## Task List

- [x] 1. Create data model and static data file
  - [x] 1.1 Create `src/app/data/models/case-study.model.ts` with the `CaseStudy` interface
  - [x] 1.2 Create `src/app/data/static/case-studies.data.ts` with `CASE_STUDIES_DATA` (≥2 entries), `CASE_STUDIES_BY_SLUG` map, and duplicate-slug runtime guard

- [x] 2. Create CaseStudiesSectionComponent
  - [x] 2.1 Create `src/app/features/case-studies/case-studies-section/case-studies-section.component.ts` as a standalone OnPush component
  - [x] 2.2 Implement card grid template: `@if (caseStudies().length)` guard, `@for` loop, each card as `<a [routerLink]>` showing `projectTitle`, `clientName`, `shortDescription`, and tag pills
  - [x] 2.3 Add `CaseStudiesSectionComponent` to `HomeComponent` imports and template between `<app-how-we-work-section />` and `<app-cta-section />`

- [x] 3. Create CaseStudyDetailComponent
  - [x] 3.1 Create `src/app/features/case-studies/case-study-detail/case-study-detail.component.ts` as a standalone OnPush component using Signals
  - [x] 3.2 Implement slug resolution: read `:slug` from `ActivatedRoute`, look up in `CASE_STUDIES_BY_SLUG`, redirect to `/` on miss
  - [x] 3.3 Implement detail template rendering `projectTitle`, `clientName`, `problemStatement`, `solution`, `technicalDepth`, and `tags`
  - [x] 3.4 Implement conditional `Live_Demo_Button` using `ButtonComponent` with `variant="primary"`, `target="_blank"`, `rel="noopener noreferrer"`
  - [x] 3.5 Implement SEO: inject `Title` and `Meta`, set title to `"{projectTitle} | Compufy Technology"` and description to `shortDescription` on successful resolution only

- [x] 4. Register lazy route
  - [x] 4.1 Add `{ path: 'case-studies/:slug', loadComponent: () => import(...).then(m => m.CaseStudyDetailComponent) }` to `src/app/app.routes.ts`

- [x] 5. Unit tests
  - [x] 5.1 Create `src/app/data/static/case-studies.data.spec.ts` — verify array length ≥ 2, map size equals array length, duplicate-slug guard throws
  - [x] 5.2 Create `src/app/features/case-studies/case-studies-section/case-studies-section.component.spec.ts` — verify route registration, keyboard Enter navigation
  - [x] 5.3 Create `src/app/features/case-studies/case-study-detail/case-study-detail.component.spec.ts` — verify `ButtonComponent` used with `primary` variant

- [x] 6. Property-based tests
  - [x] 6.1 Create `src/app/data/static/case-studies.data.pbt.spec.ts`
    - Property 1: Slug map round-trip — for any unique-slug array, every entry is retrievable by slug
    - Property 2: Slug uniqueness invariant — guard throws on duplicates, passes on unique slugs
  - [x] 6.2 Create `src/app/features/case-studies/case-studies-section/case-studies-section.component.pbt.spec.ts`
    - Property 3: Section card count matches data length (including empty array edge case)
    - Property 4: Card renders required fields (projectTitle, clientName, shortDescription, tags)
    - Property 5: Card RouterLink href equals `/case-studies/{slug}`
  - [x] 6.3 Create `src/app/features/case-studies/case-study-detail/case-study-detail.component.pbt.spec.ts`
    - Property 6: Detail page renders all required fields
    - Property 7: Live demo button present iff liveDemoUrl non-empty, with correct target/rel attributes
    - Property 8: Unknown slug triggers router.navigate(['/']) with caseStudy signal null
    - Property 9: SEO title equals "{projectTitle} | Compufy Technology"
    - Property 10: SEO description meta equals shortDescription
    - Property 11: No SEO calls on unknown slug redirect
