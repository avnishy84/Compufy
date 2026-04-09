# Requirements Document

## Introduction

This feature enhances the existing "Who We Are" page for Compufy Technology. The goal is to enrich the page with additional sections (Our Story, Mission & Vision, Core Values, What Makes Us Different, Our Expertise, Achievements, Team Philosophy, and a Call To Action), update the team card layout to lead with designation over name, and apply UI polish (hover effects, spacing, icons) — all while preserving the existing dark/light-mode-compatible design system built on Angular 18 standalone components and Tailwind CSS.

## Glossary

- **Page**: The `WhoWeAreComponent` at `src/app/features/who-we-are/who-we-are.component.ts`
- **Team_Card**: The existing founder/CTO card UI block rendered inside the Page
- **Surface**: The dark background token (`bg-surface`, `bg-surface-card`) used throughout the design system
- **Brand_Colors**: Tailwind custom tokens `brand-primary` (indigo), `brand-secondary` (violet), `brand-accent` (cyan)
- **Lucide_Icons**: The `lucide-angular` icon library already present in the project
- **CTA**: Call-To-Action section at the bottom of the Page

---

## Requirements

### Requirement 1: Our Story Section

**User Story:** As a site visitor, I want to read a brief origin story for Compufy Technology, so that I can understand the company's background and motivation.

#### Acceptance Criteria

1. THE Page SHALL render an "Our Story" section above the team cards section.
2. THE "Our Story" section SHALL display the paragraph: "Compufy Technology was founded with a vision to bridge the gap between innovative ideas and scalable digital solutions. What started as a passion for building meaningful software has evolved into a mission-driven team focused on delivering real business impact."
3. WHEN the Page is rendered, THE "Our Story" section SHALL be visually distinct from adjacent sections via consistent spacing and a section heading.

---

### Requirement 2: Mission & Vision Cards

**User Story:** As a site visitor, I want to see the company's mission and vision presented as distinct cards, so that I can quickly grasp the company's purpose and direction.

#### Acceptance Criteria

1. THE Page SHALL render a "Mission & Vision" section containing exactly two cards.
2. THE Mission card SHALL display the text: "To build scalable, efficient, and future-ready technology solutions that empower businesses."
3. THE Vision card SHALL display the text: "To become a trusted technology partner for startups and enterprises globally."
4. WHEN a visitor hovers over a Mission or Vision card, THE card SHALL apply a subtle visual hover effect (e.g., border highlight or background shift) within 150ms.
5. THE Mission & Vision section SHALL maintain visual consistency with the existing Surface and Brand_Colors design tokens.

---

### Requirement 3: Core Values Grid

**User Story:** As a site visitor, I want to see the company's core values displayed in an icon-based grid, so that I can understand the principles that guide the team.

#### Acceptance Criteria

1. THE Page SHALL render a "Core Values" section as an icon-based grid.
2. THE Core Values grid SHALL display exactly five values: "Innovation First", "Client-Centric Approach", "Performance & Quality", "Transparency", and "Continuous Growth".
3. THE Page SHALL render a Lucide_Icons icon alongside each Core Value label.
4. WHEN a visitor hovers over a Core Value card, THE card SHALL apply a subtle visual hover effect within 150ms.
5. THE Core Values grid SHALL be responsive: displaying as a single column on mobile, two columns on tablet, and three or more columns on desktop.

---

### Requirement 4: What Makes Us Different Section

**User Story:** As a site visitor, I want to see a list of differentiators for Compufy Technology, so that I can understand why I should choose them over competitors.

#### Acceptance Criteria

1. THE Page SHALL render a "What Makes Us Different" section containing exactly four items.
2. THE four items SHALL be: "Focus on real-world scalable solutions", "Strong blend of business and technology thinking", "Fast execution with startup mindset", and "Clean, maintainable, future-proof architecture".
3. WHEN a visitor hovers over a differentiator card or list item, THE item SHALL apply a subtle visual hover effect within 150ms.

---

### Requirement 5: Our Expertise Tags

**User Story:** As a site visitor, I want to see the company's technology expertise displayed as tags or chips, so that I can quickly scan the technical capabilities offered.

#### Acceptance Criteria

1. THE Page SHALL render an "Our Expertise" section displaying expertise as tag/chip elements.
2. THE expertise tags SHALL include: "Full Stack Development", "Cloud & DevOps", "AI & Automation", "System Design & Architecture", and "Performance Optimization".
3. THE expertise tags SHALL use Brand_Colors for styling and be visually consistent with the existing badge/chip pattern used in team cards.

---

### Requirement 6: Updated Team Card Layout

**User Story:** As a site visitor, I want to see team member designations as the primary heading on team cards, so that I can immediately understand each person's role before their name.

#### Acceptance Criteria

1. THE Team_Card SHALL render the member's designation (e.g., "Chief Technology Officer") as the primary bold heading.
2. THE Team_Card SHALL render the member's name as secondary, visually subdued text below the designation.
3. THE Team_Card SHALL retain the existing description paragraph and expertise badge elements.
4. WHEN a visitor hovers over a Team_Card, THE card SHALL apply a subtle visual hover effect within 150ms.

---

### Requirement 7: Team Philosophy Section

**User Story:** As a site visitor, I want to read a short philosophy statement from the team, so that I can understand the team's culture and working ethos.

#### Acceptance Criteria

1. THE Page SHALL render a "Team Philosophy" section after the team cards.
2. THE "Team Philosophy" section SHALL display the text: "We believe great products come from collaboration, curiosity, and continuous learning. At Compufy, we don't just build software — we solve problems."
3. THE "Team Philosophy" section SHALL be visually styled to stand out (e.g., italic text, accent border, or highlighted background) while remaining consistent with the Surface design tokens.

---

### Requirement 8: Achievements / Milestones Stats

**User Story:** As a site visitor, I want to see key company milestones displayed as stat cards, so that I can quickly gauge the company's experience and track record.

#### Acceptance Criteria

1. THE Page SHALL render an "Achievements" section containing exactly four stat cards.
2. THE four stat cards SHALL represent: "Projects Delivered", "Technologies Used", "Happy Clients", and "Years of Experience".
3. THE stat cards SHALL display a numeric value (placeholder values are acceptable) and a label for each metric.
4. WHEN a visitor hovers over a stat card, THE card SHALL apply a subtle visual hover effect within 150ms.
5. THE Achievements section SHALL be responsive: displaying as a two-column grid on mobile and a four-column grid on desktop.

---

### Requirement 9: Call To Action Section

**User Story:** As a site visitor, I want to see a clear call-to-action at the bottom of the page, so that I can easily navigate to start a project or contact the team.

#### Acceptance Criteria

1. THE Page SHALL render a CTA section at the bottom of the page content.
2. THE CTA section SHALL display the heading: "Have an idea? Let's build it together."
3. THE CTA section SHALL contain a button or link labelled "Contact Us" or "Start a Project" that navigates to the `/contact` route.
4. WHEN a visitor hovers over the CTA button, THE button SHALL apply a visual hover effect within 150ms.

---

### Requirement 10: Responsive Layout and UI Polish

**User Story:** As a site visitor on any device, I want the page to be well-spaced, readable, and visually consistent, so that I have a smooth browsing experience regardless of screen size.

#### Acceptance Criteria

1. THE Page SHALL maintain dark/light-mode compatibility using the existing Surface and Brand_Colors design tokens throughout all new sections.
2. THE Page SHALL apply consistent section spacing (e.g., `mb-20`) between all sections.
3. THE Page SHALL use Lucide_Icons for iconography in new sections where icons are specified.
4. WHEN the viewport width is below 640px, THE Page SHALL render all multi-column grids as single-column layouts.
5. THE Page SHALL preserve all existing background gradient blob decorations.
