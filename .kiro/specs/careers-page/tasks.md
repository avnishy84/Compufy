# Tasks: Careers Page

## Task List

- [x] 1. Create data models and static careers content
  - [x] 1.1 Create `src/app/data/models/careers.model.ts` with `CompanyValue` and `WhyJoinItem` interfaces
  - [x] 1.2 Create `src/app/data/static/careers.data.ts` exporting `COMPANY_VALUES` (≥3 entries) and `WHY_JOIN_ITEMS` (≥3 entries) typed against the careers models

- [x] 2. Add API endpoint constant
  - [x] 2.1 Add `CAREERS_SUBMIT: '/api/careers'` to `src/app/data/constants/api.constants.ts`

- [x] 3. Create custom validators
  - [x] 3.1 Create `src/app/features/careers/validators.ts` with `pdfOnly(): ValidatorFn` that returns `{ pdfOnly: true }` for non-PDF files
  - [x] 3.2 Add `maxFileSize(bytes: number): ValidatorFn` to the same file that returns `{ maxFileSize: { max, actual } }` for oversized files

- [x] 4. Register the route
  - [x] 4.1 Add the `/careers` lazy-loaded route to `src/app/app.routes.ts` using `loadComponent` (before the `**` wildcard)

- [x] 5. Update navigation
  - [x] 5.1 Add a "Careers" `routerLink="/careers"` nav entry to `src/app/app.component.ts` alongside existing nav links

- [x] 6. Build the CareersComponent
  - [x] 6.1 Create `src/app/features/careers/careers.component.ts` as a standalone `OnPush` component with inline template and `ReactiveFormsModule` import
  - [x] 6.2 Define the typed `FormGroup<CareersFormControls>` with `fullName`, `designation`, `yearsOfExperience`, and `resume` controls and their validators
  - [x] 6.3 Implement the Values Section rendering `COMPANY_VALUES` with `@for`, each as a `surface-card` card with title and description
  - [x] 6.4 Implement the Why Join Section rendering `WHY_JOIN_ITEMS` with `@for`, each showing icon, title, and description
  - [x] 6.5 Implement the Application Form template with all four fields, visible `<label>` elements with matching `for`/`id` attributes, and `aria-describedby` on error messages
  - [x] 6.6 Implement `onFileChange(event: Event)` to update the `resume` control from the file input's `change` event
  - [x] 6.7 Implement `onSubmit()` — marks all touched if invalid, sets `submitting` signal, calls `HttpService.post`, handles success (`submitted = true`) and error (`submitError` set), resets `submitting` in both paths
  - [x] 6.8 Add `submitted`, `submitting`, and `submitError` signals; show success message when `submitted()` is true; disable submit button while `submitting()` is true
  - [x] 6.9 Apply dark-mode glassmorphism styling using brand and surface Tailwind tokens consistent with existing pages

- [x] 7. Write unit tests
  - [x] 7.1 Create `src/app/features/careers/careers.component.spec.ts`
  - [x] 7.2 Test that the component renders without errors
  - [x] 7.3 Test that the `/careers` route exists in `app.routes.ts` and uses `loadComponent`
  - [x] 7.4 Test that the "Careers" nav link is present in `AppComponent`
  - [x] 7.5 Test that `COMPANY_VALUES` has at least 3 entries each with non-empty title and description
  - [x] 7.6 Test that `WHY_JOIN_ITEMS` has at least 3 entries each with non-empty title and description
  - [x] 7.7 Test that `onSubmit()` with an invalid form marks all controls touched and does not call `HttpService`
  - [x] 7.8 Test that `onSubmit()` with a valid form calls `HttpService.post` with `CAREERS_SUBMIT` endpoint
  - [x] 7.9 Test that on success response `submitted()` becomes `true`
  - [x] 7.10 Test that on error response `submitError()` is set and form values are preserved
  - [x] 7.11 Test that `submitting()` is `true` during in-flight request and `false` after response
  - [x] 7.12 Test that the file input has `accept=".pdf"` attribute
  - [x] 7.13 Test that `aria-describedby` links each error message element to its input

- [x] 8. Write property-based tests
  - [x] 8.1 Create `src/app/features/careers/careers.component.pbt.spec.ts` with fast-check arbitraries
  - [x] 8.2 Implement Property 1 — for any valid form values (valid name, designation, years in [0,50], PDF file ≤2MB), the form is valid and submit is enabled (100 runs)
  - [x] 8.3 Implement Property 2 — for any fullName string with fewer than 2 trimmed characters, the fullName control is invalid (100 runs)
  - [x] 8.4 Implement Property 3 — for any yearsOfExperience value outside [0, 50], the control is invalid (100 runs)
  - [x] 8.5 Implement Property 4 — for any File with type !== 'application/pdf', `pdfOnly()` returns a non-null error with the `pdfOnly` key (100 runs)
  - [x] 8.6 Implement Property 5 — for any File with size > 2097152, `maxFileSize(2 * 1024 * 1024)` returns a non-null error with the `maxFileSize` key (100 runs)
  - [x] 8.7 Implement Property 6 — for any invalid form state, `onSubmit()` marks all four controls as touched (100 runs)
  - [x] 8.8 Implement Property 7 — for any `CompanyValue[]` and `WhyJoinItem[]` arrays, all item titles and descriptions appear in the rendered DOM (100 runs)
