# Tasks

## Task List

- [x] 1. Update component imports and data models
  - [x] 1.1 Add Lucide icon imports (`Lightbulb`, `Users`, `Zap`, `Eye`, `TrendingUp`) and `LucideAngularModule` to the component's `imports` array
  - [x] 1.2 Define inline interfaces `MissionVisionCard`, `CoreValue`, `AchievementStat` in the component file
  - [x] 1.3 Add readonly class properties: `missionVisionCards`, `coreValues`, `differentiators`, `expertiseTags`, `achievements` with static data as specified in the design

- [x] 2. Add "Our Story" section to the template
  - [x] 2.1 Insert the "Our Story" section above the team cards section with the required paragraph text and a section heading

- [x] 3. Add "Mission & Vision" section to the template
  - [x] 3.1 Render two cards (Mission and Vision) with the specified text and Tailwind hover transition classes (`transition-all duration-150`)

- [x] 4. Add "Core Values" section to the template
  - [x] 4.1 Render a responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) iterating over `coreValues`
  - [x] 4.2 Render a `<lucide-icon>` alongside each value label
  - [x] 4.3 Apply hover transition classes to each card

- [x] 5. Add "What Makes Us Different" section to the template
  - [x] 5.1 Render exactly four differentiator items from the `differentiators` array with hover transition classes

- [x] 6. Add "Our Expertise" section to the template
  - [x] 6.1 Render expertise tags as chip/badge elements using brand color tokens, iterating over `expertiseTags`

- [x] 7. Update Team Card layout (Founder and CTO cards)
  - [x] 7.1 Swap heading order: render designation as `<h2>` (primary bold) and name as subdued `<p>` below it
  - [x] 7.2 Add hover transition classes to both team cards
  - [x] 7.3 Verify description paragraph and expertise badges are still present

- [x] 8. Add "Team Philosophy" section to the template
  - [x] 8.1 Insert the "Team Philosophy" section after the team cards with the required text, styled with an accent border or highlighted background

- [x] 9. Add "Achievements / Milestones" section to the template
  - [x] 9.1 Render four stat cards in a responsive grid (`grid-cols-2 lg:grid-cols-4`) iterating over `achievements`
  - [x] 9.2 Each card displays a numeric value and a label
  - [x] 9.3 Apply hover transition classes to each stat card

- [x] 10. Update the CTA section
  - [x] 10.1 Update the CTA heading to "Have an idea? Let's build it together."
  - [x] 10.2 Ensure the CTA button/link is labelled "Contact Us" or "Start a Project" and uses `routerLink="/contact"`
  - [x] 10.3 Apply hover transition classes to the CTA button

- [x] 11. Write unit tests (`who-we-are.component.spec.ts`)
  - [x] 11.1 Test Our Story paragraph text is present in the DOM
  - [x] 11.2 Test Mission and Vision card texts are present and exactly two cards render
  - [x] 11.3 Test all five core value labels are present in the DOM
  - [x] 11.4 Test all four differentiator texts are present in the DOM
  - [x] 11.5 Test all five expertise tags are present in the DOM
  - [x] 11.6 Test team card designation renders as primary heading before the name
  - [x] 11.7 Test team card description paragraph and expertise badges are still present
  - [x] 11.8 Test Team Philosophy text is present in the DOM
  - [x] 11.9 Test exactly four achievement stat cards render with labels
  - [x] 11.10 Test CTA heading text and `/contact` routerLink are present

- [x] 12. Write property-based tests (`who-we-are.component.pbt.spec.ts`)
  - [x] 12.1 Property 1: For any array of CoreValue-shaped objects, each rendered card contains an icon host element alongside the label
  - [x] 12.2 Property 2: For any array of AchievementStat-shaped objects, each rendered stat card contains both a non-empty value and a non-empty label
