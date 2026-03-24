# Tasks: Who We Are Page

## Task List

- [x] 1. Create data model and static founder data
  - [x] 1.1 Create `src/app/data/models/founder.model.ts` with `SkillCategory`, `ExperienceEntry`, `EducationEntry`, and `FounderProfile` interfaces
  - [x] 1.2 Create `src/app/data/static/founder.data.ts` exporting `FOUNDER_DATA` constant typed as `FounderProfile` with Avnish Yadav's details

- [x] 2. Register the route
  - [x] 2.1 Add the `/who-we-are` lazy-loaded route to `src/app/app.routes.ts` using `loadComponent`

- [x] 3. Build the WhoWeAreComponent
  - [x] 3.1 Create `src/app/features/who-we-are/who-we-are.component.ts` as a standalone `OnPush` component with inline template
  - [x] 3.2 Implement the hero/profile section displaying name, title, location, role, and summary from `FOUNDER_DATA`
  - [x] 3.3 Implement the skills section rendering each `SkillCategory` with skill badges using `@for` and an `@empty` fallback
  - [x] 3.4 Implement the experience section rendering each `ExperienceEntry` in data order with `@for` and an `@empty` fallback
  - [x] 3.5 Implement the education section rendering each `EducationEntry` in data order with `@for` and an `@empty` fallback
  - [x] 3.6 Apply dark-mode glassmorphism styling using brand and surface Tailwind tokens consistent with existing pages

- [x] 4. Update navigation
  - [x] 4.1 Add a top navigation bar to `src/app/app.component.ts` with `RouterLink` entries for Home, Services, Who We Are, and Contact

- [x] 5. Write unit tests
  - [x] 5.1 Create `src/app/features/who-we-are/who-we-are.component.spec.ts`
  - [x] 5.2 Test that the component renders without errors using `FOUNDER_DATA`
  - [x] 5.3 Test that `@empty` fallback blocks render when `skillCategories`, `experience`, and `education` arrays are empty
  - [x] 5.4 Test that the `/who-we-are` route entry exists in `app.routes.ts` and uses `loadComponent`

- [x] 6. Write property-based tests
  - [x] 6.1 Create `src/app/features/who-we-are/who-we-are.component.pbt.spec.ts` with fast-check arbitraries for `FounderProfile`
  - [x] 6.2 Implement Property 1 — for any `FounderProfile`, all header fields (name, title, location, summary, role) and all experience/education entry fields appear in the rendered DOM (100 runs)
  - [x] 6.3 Implement Property 2 — for any `FounderProfile`, every skill in every skill category appears in the rendered DOM (100 runs)
  - [x] 6.4 Implement Property 3 — for any `FounderProfile`, the DOM order of experience entries and education entries matches the data array order (100 runs)
