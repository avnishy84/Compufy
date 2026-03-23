# Requirements Document

## Introduction

Compufy Technology is a corporate website built with Angular (latest version) following Clean Architecture and SOLID principles. The site presents the company's brand, services, and contact information through a modern, dark-mode-first UI with glassmorphism accents. It includes three primary public-facing pages (Home, Services, Contact/Registration) and is structured for scalability using standalone components, Angular Signals, Tailwind CSS, lazy-loaded routes, and OnPush change detection.

## Glossary

- **App**: The Angular application as a whole
- **Router**: Angular Router responsible for navigation and lazy loading
- **Home_Page**: The landing page featuring a hero section and service overview
- **Services_Page**: The page displaying categorized service offering cards
- **Contact_Page**: The registration and contact form page
- **Reactive_Form**: An Angular Reactive Form with typed controls and custom validators
- **Validator**: A custom Angular form validator function
- **Animation_Service**: The Angular Animations layer handling page transitions and UI reveals
- **Theme**: The global Tailwind CSS design token system including dark mode and glassmorphism styles
- **Signal**: An Angular Signal used for reactive state management
- **Standalone_Component**: An Angular component declared without NgModules
- **Core_Module**: The `src/app/core/` layer containing singleton services (HTTP, error handling, interceptors)
- **Shared_Module**: The `src/app/shared/` layer containing reusable dumb UI components
- **Feature_Module**: A domain-specific folder under `src/app/features/` (home, services, contact)
- **Data_Layer**: The `src/app/data/` folder containing models, types, and API endpoint constants
- **OnPush_Component**: A Standalone_Component using `ChangeDetectionStrategy.OnPush`
- **Skeleton_Loader**: A placeholder UI shown while content is loading
- **Glassmorphism**: A visual style using frosted-glass backgrounds (backdrop blur + semi-transparent fills)
- **P.I.T.C.**: A specific service category offered by Compufy Technology (Professional IT Consulting)

---

## Requirements

### Requirement 1: Application Architecture

**User Story:** As a developer, I want the app to follow Clean Architecture with a Core/Shared/Features/Data/Theme folder structure, so that the codebase is maintainable, testable, and scalable.

#### Acceptance Criteria

1. THE App SHALL organize source code into `core/`, `shared/`, `features/`, `data/`, and `theme/` directories under `src/app/`.
2. THE Core_Module SHALL contain only singleton services including HTTP clients, interceptors, and error handlers.
3. THE Shared_Module SHALL contain only reusable, stateless UI components (buttons, modals, inputs) with no business logic.
4. THE Data_Layer SHALL define all data models as TypeScript interfaces and export all API endpoint constants.
5. THE Theme SHALL define all design tokens (colors, spacing, typography) as Tailwind CSS configuration values.
6. WHEN a Feature_Module is added, THE App SHALL not require changes to `core/`, `shared/`, or `data/` unless new shared contracts are introduced.

---

### Requirement 2: Routing and Lazy Loading

**User Story:** As a user, I want fast initial page loads, so that I can access the site quickly regardless of connection speed.

#### Acceptance Criteria

1. THE Router SHALL define routes for `/` (Home_Page), `/services` (Services_Page), and `/contact` (Contact_Page).
2. WHEN a route is navigated to, THE Router SHALL lazy-load the corresponding Feature_Module.
3. THE App SHALL use `loadComponent` or `loadChildren` with dynamic `import()` for all feature routes.
4. WHEN a route is not found, THE Router SHALL redirect the user to the Home_Page.
5. THE Router SHALL use `PathLocationStrategy` (HTML5 routing) with no hash-based URLs.

---

### Requirement 3: Global Theme and Dark Mode

**User Story:** As a user, I want a consistent dark-mode-first visual experience, so that the site is comfortable to read and visually modern.

#### Acceptance Criteria

1. THE Theme SHALL default to dark mode as the primary visual style.
2. THE Theme SHALL apply glassmorphism styles (backdrop blur, semi-transparent backgrounds, subtle borders) to card and panel components.
3. THE App SHALL use Tailwind CSS utility classes exclusively for layout and styling, with no inline styles.
4. WHEN the viewport width changes, THE App SHALL apply responsive Tailwind breakpoint classes to maintain usability on mobile, tablet, and desktop.
5. THE Theme SHALL define a consistent color palette using Tailwind CSS `theme.extend` configuration.

---

### Requirement 4: Standalone Components and OnPush Change Detection

**User Story:** As a developer, I want all components to be standalone with OnPush change detection, so that the app has minimal bundle size and optimal rendering performance.

#### Acceptance Criteria

1. THE App SHALL declare all components as Standalone_Components using `standalone: true`.
2. THE App SHALL NOT use NgModules for feature organization.
3. EVERY Standalone_Component SHALL use `ChangeDetectionStrategy.OnPush`.
4. WHEN component state changes, THE Standalone_Component SHALL use Angular Signals to trigger re-renders instead of manual `markForCheck()` calls.

---

### Requirement 5: State Management with Signals

**User Story:** As a developer, I want reactive state managed via Angular Signals, so that the app avoids unnecessary RxJS complexity for local and shared UI state.

#### Acceptance Criteria

1. THE App SHALL use Angular `signal()`, `computed()`, and `effect()` for all local component state.
2. WHEN data is fetched from an API or static source, THE Core_Module SHALL expose the result via a Signal-based service.
3. THE App SHALL NOT use BehaviorSubject or Subject for state that can be expressed as a Signal.
4. WHERE RxJS is required (e.g., HTTP requests), THE Core_Module SHALL convert observables to signals using `toSignal()`.

---

### Requirement 6: Home Page

**User Story:** As a visitor, I want an engaging landing page with a hero section and service overview, so that I immediately understand what Compufy Technology offers.

#### Acceptance Criteria

1. THE Home_Page SHALL render a full-viewport hero section with a headline, subheadline, and a call-to-action button linking to `/services`.
2. THE Home_Page SHALL render a "What We Do" section displaying a summary of at least three service categories.
3. WHEN the Home_Page is loaded, THE Animation_Service SHALL trigger scroll-reveal animations on section entry using Angular Animations.
4. THE Home_Page SHALL include 3D-style visual tech elements (CSS-based or SVG-based) in the hero section without requiring third-party 3D libraries.
5. WHEN the call-to-action button is clicked, THE Router SHALL navigate to `/services`.

---

### Requirement 7: Services Page

**User Story:** As a visitor, I want to browse Compufy Technology's service offerings in a clear, categorized layout, so that I can understand what solutions are available.

#### Acceptance Criteria

1. THE Services_Page SHALL display service cards organized into three categories: Web Development, Digital Solutions, and P.I.T.C.
2. EACH service card SHALL display a title, a short description, and a Lucide-Angular icon.
3. THE Services_Page SHALL apply glassmorphism styling to each service card.
4. WHEN the Services_Page is loaded, THE Animation_Service SHALL animate cards into view with a staggered entrance effect.
5. THE Services_Page SHALL be fully responsive, displaying cards in a single column on mobile and a multi-column grid on desktop.

---

### Requirement 8: Contact and Registration Page

**User Story:** As a visitor, I want to submit a contact or registration form, so that I can get in touch with Compufy Technology.

#### Acceptance Criteria

1. THE Contact_Page SHALL render a Reactive_Form with fields for full name, email address, subject, and message.
2. THE Reactive_Form SHALL validate that the full name field is not empty and contains at least 2 characters.
3. THE Reactive_Form SHALL validate that the email address field contains a properly formatted email address.
4. THE Reactive_Form SHALL validate that the subject field is not empty.
5. THE Reactive_Form SHALL validate that the message field contains at least 10 characters.
6. WHEN a field is invalid and has been touched, THE Contact_Page SHALL display an inline validation error message below the field.
7. WHEN the form is submitted with all valid fields, THE Animation_Service SHALL display a success animation and confirmation message.
8. IF the form is submitted while any field is invalid, THEN THE Reactive_Form SHALL mark all fields as touched and display all validation errors without submitting.
9. THE Reactive_Form SHALL use typed `FormGroup` and `FormControl` with explicit TypeScript types.

---

### Requirement 9: Reusable UI Components

**User Story:** As a developer, I want a shared library of dumb UI components, so that I can build consistent interfaces without duplicating markup.

#### Acceptance Criteria

1. THE Shared_Module SHALL provide at minimum: a Button component, an Input component, a Card component, and a Skeleton_Loader component.
2. EACH shared component SHALL accept inputs via Angular `@Input()` signals or typed `input()` functions.
3. THE Skeleton_Loader SHALL display animated placeholder content while data is being loaded.
4. WHEN a shared component receives new input values, THE Standalone_Component SHALL re-render using OnPush change detection triggered by Signal updates.

---

### Requirement 10: Icons

**User Story:** As a developer, I want a consistent icon system, so that all icons across the site share the same visual style and are tree-shakeable.

#### Acceptance Criteria

1. THE App SHALL use Lucide-Angular as the sole icon library.
2. EVERY icon used in the App SHALL be individually imported to support tree-shaking.
3. THE App SHALL NOT use icon fonts or SVG sprite sheets.

---

### Requirement 11: Performance

**User Story:** As a user, I want the site to load and respond quickly, so that I have a smooth browsing experience.

#### Acceptance Criteria

1. THE App SHALL use `OnPush` change detection on all components to minimize unnecessary re-renders.
2. THE Router SHALL lazy-load all feature routes so the initial bundle does not include feature code.
3. WHEN content is loading, THE App SHALL display a Skeleton_Loader in place of the content until data is available.
4. THE App SHALL NOT import entire UI libraries (Angular Material or PrimeNG) at the root level; only individual components SHALL be imported where needed.

---

### Requirement 12: Error Handling

**User Story:** As a user, I want clear feedback when something goes wrong, so that I am not left with a broken or blank screen.

#### Acceptance Criteria

1. THE Core_Module SHALL include an HTTP interceptor that catches all failed HTTP responses.
2. WHEN an HTTP request fails, THE Core_Module SHALL log the error and expose the error state via a Signal.
3. WHEN an error state Signal is truthy, THE App SHALL display a user-facing error notification without navigating away from the current page.
4. IF an unhandled JavaScript error occurs, THEN THE App SHALL catch it via a global error handler and display a fallback UI.
