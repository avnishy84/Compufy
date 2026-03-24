# Requirements Document

## Introduction

The "Who We Are" page is a new route (`/who-we-are`) on the Compufy Technology marketing website. It introduces the founder, highlights professional background, technical expertise, career history, and educational credentials. The page must match the existing dark-mode glassmorphism aesthetic and be lazy-loaded via the Angular router.

## Glossary

- **Who_We_Are_Page**: The Angular standalone component rendered at the `/who-we-are` route
- **Founder_Profile**: The structured data object representing the founder's personal and professional information
- **Skills_Section**: The UI block displaying the founder's technical skill categories
- **Experience_Section**: The UI block displaying the founder's work history
- **Education_Section**: The UI block displaying the founder's academic qualifications
- **Router**: The Angular router responsible for lazy-loading page components

## Requirements

### Requirement 1: Page Route and Navigation

**User Story:** As a site visitor, I want to navigate to a dedicated "Who We Are" page, so that I can learn about the company founder and team.

#### Acceptance Criteria

1. THE Router SHALL expose the path `/who-we-are` and lazy-load the Who_We_Are_Page component via `loadComponent`
2. WHEN a visitor navigates to `/who-we-are`, THE Who_We_Are_Page SHALL render without a full page reload
3. THE Who_We_Are_Page SHALL be reachable from the site navigation alongside existing pages (Home, Services, Contact)

---

### Requirement 2: Founder Profile Display

**User Story:** As a site visitor, I want to see the founder's name, title, and professional summary, so that I can understand who is behind Compufy Technology.

#### Acceptance Criteria

1. THE Who_We_Are_Page SHALL display the founder's full name
2. THE Who_We_Are_Page SHALL display the founder's professional title
3. THE Who_We_Are_Page SHALL display the founder's location
4. THE Who_We_Are_Page SHALL display a professional summary paragraph describing the founder's experience and focus areas
5. THE Who_We_Are_Page SHALL display the founder's role as the company founder

---

### Requirement 3: Technical Skills Display

**User Story:** As a site visitor, I want to see the founder's technical skills grouped by category, so that I can evaluate the company's technical capabilities.

#### Acceptance Criteria

1. THE Skills_Section SHALL display skills grouped into named categories (e.g., Languages, Frameworks, Databases, Tools)
2. THE Skills_Section SHALL render each skill as a distinct visual badge or tag
3. THE Skills_Section SHALL display all skill categories without truncation

---

### Requirement 4: Professional Experience Display

**User Story:** As a site visitor, I want to see the founder's work history, so that I can assess the company's industry experience.

#### Acceptance Criteria

1. THE Experience_Section SHALL display each position with company name, job title, location, and date range
2. THE Experience_Section SHALL list key projects or responsibilities associated with each position
3. THE Experience_Section SHALL present experience entries in reverse-chronological order (most recent first)

---

### Requirement 5: Education Display

**User Story:** As a site visitor, I want to see the founder's educational background, so that I can understand the academic foundation of the company.

#### Acceptance Criteria

1. THE Education_Section SHALL display each qualification with degree name, institution name, year range, and percentage score
2. THE Education_Section SHALL present education entries in reverse-chronological order (most recent first)

---

### Requirement 6: Visual Design Consistency

**User Story:** As a site visitor, I want the "Who We Are" page to look consistent with the rest of the site, so that I have a coherent browsing experience.

#### Acceptance Criteria

1. THE Who_We_Are_Page SHALL apply the dark-mode glassmorphism visual style consistent with existing pages
2. THE Who_We_Are_Page SHALL use the established brand color tokens (`brand-primary`, `brand-secondary`, `brand-accent`) for accents and highlights
3. THE Who_We_Are_Page SHALL use surface color tokens (`surface`, `surface-card`) for backgrounds
4. THE Who_We_Are_Page SHALL be fully responsive across mobile, tablet, and desktop viewport widths
5. THE Who_We_Are_Page SHALL be implemented as a standalone Angular component with `ChangeDetectionStrategy.OnPush` and an inline template

---

### Requirement 7: Static Founder Data

**User Story:** As a developer, I want founder profile data stored as a typed static data file, so that content updates do not require changes to component logic.

#### Acceptance Criteria

1. THE Who_We_Are_Page SHALL source all displayed content from a typed static data file located under `src/app/data/static/`
2. THE Founder_Profile data object SHALL be typed with a TypeScript interface defined in `src/app/data/models/`
3. WHEN the static data file is updated, THE Who_We_Are_Page SHALL reflect the updated content without changes to component logic
