import { ClientProject } from '../models/client-project.model';

export const CLIENT_PROJECTS_DATA: ClientProject[] = [
  {
    id: '1',
    slug: 'cvio',
    name: 'CVio',
    industry: 'AI / Career Tech',
    tagline: 'AI-powered resume builder with ATS scoring, GPT-4o optimization, role tailoring, LinkedIn comparison, and PDF/DOCX export.',
    initials: 'CV',
    logoUrl: '/cvio.png',
    overview: `CVio solves a common pain point for job seekers: resumes that look good to humans but fail Applicant Tracking Systems (ATS). The platform combines document parsing, AI-powered rewriting, ATS scoring, role-specific tailoring, personal branding analysis, and LinkedIn consistency checking into a single cohesive workflow.`,
    quote: `"Most resume tools give you a single ATS score and call it done. CVio gives you a weighted 6-category breakdown, tells you exactly what to fix, and rewrites it for you — without inventing facts."`,
    featureGroups: [
      {
        heading: 'Core Workflow',
        items: [
          { name: 'Resume Upload & Parsing', description: 'Upload PDF or DOCX (up to 10 MB); GPT-4o extracts structured data automatically.' },
          { name: 'AI Optimization', description: 'Rewrites bullets with strong action verbs and quantified achievements; never fabricates facts.' },
          { name: 'ATS Scoring', description: 'Weighted 6-category breakdown with actionable suggestions.' },
          { name: 'Role-Based Tailoring', description: 'Optimizes for Software Developer, UI/UX Designer, Product Manager, HR, or Marketing.' },
        ],
      },
      {
        heading: 'Advanced Features',
        items: [
          { name: 'Personal Branding Analysis', description: 'Tone detection, UVP identification, headline and career narrative suggestions.' },
          { name: 'LinkedIn Comparison', description: 'Surfaces inconsistencies between resume and LinkedIn; supports selective field import.' },
          { name: 'Resume Builder', description: 'Inline editor with three templates (Notion, Apple, ATS-Friendly) and live preview.' },
          { name: 'Version History', description: 'Every save creates a versioned snapshot; full history retained and browsable.' },
        ],
      },
    ],
    techStackGroups: [
      {
        heading: 'Frontend & Framework',
        items: [
          { name: 'Next.js 14', description: 'App Router, TypeScript, Server Components.' },
          { name: 'Tailwind CSS', description: 'Glassmorphism UI design language.' },
          { name: 'Framer Motion', description: 'Animations on section wrappers and cards.' },
        ],
      },
      {
        heading: 'Backend & Services',
        items: [
          { name: 'OpenAI GPT-4o', description: 'Parsing, optimization, branding, LinkedIn comparison.' },
          { name: 'Firebase Auth + Firestore', description: 'Authentication and versioned resume storage.' },
          { name: 'Puppeteer', description: 'Server-side PDF rendering with visual fidelity.' },
          { name: 'docx library', description: 'DOCX export.' },
        ],
      },
    ],
    techTags: ['Next.js 14', 'TypeScript', 'GPT-4o', 'Firebase', 'Tailwind CSS', 'Puppeteer', 'Framer Motion', 'Jest', 'fast-check', 'Vercel'],
    architecture: `Browser (Next.js App Router)
│
▼
Next.js API Routes
├── Parser            (pdf-parse / mammoth → GPT-4o)
├── AI_Optimizer      (GPT-4o, anti-hallucination prompt)
├── ATS_Scorer        (pure deterministic function)
├── Role_Optimizer    (GPT-4o + ROLE_CONVENTIONS config)
├── Branding_Analyzer (GPT-4o)
├── LinkedIn_Comparator (GPT-4o)
├── Exporter          (Puppeteer / docx)
├── Auth_Service      (Firebase Admin SDK)
└── Version_Store     (Firestore sub-collections)`,
    architectureNotes: [
      { heading: 'Pure domain modules', body: 'Parser, ATS_Scorer, and other services are plain TypeScript with no Next.js dependency, making them independently testable.' },
      { heading: 'Single ResumeData type', body: 'One shared type flows through every service, ensuring type safety across the entire pipeline.' },
      { heading: 'Firestore sub-collections', body: "Version history stored per resume; querying one user's data never scans another's." },
      { heading: 'Puppeteer PDF fidelity', body: 'Renders the same HTML template shown in the live preview, guaranteeing what you see is what you export.' },
    ],
    differentiators: [
      { heading: 'Anti-Hallucination AI', body: 'The optimization system prompt explicitly forbids GPT-4o from changing employer names, job titles, dates, or credentials. This is a hard constraint enforced at the prompt level — not a suggestion.' },
      { heading: 'Deterministic ATS Scoring', body: 'The ATS scorer is a pure function with no AI dependency. The same resume always produces the same score — making it auditable, reproducible, and fully testable with property-based tests.' },
      { heading: 'Role-Specific Conventions', body: 'Each of the five supported roles has a curated keyword list, tone descriptor, and preferred section ordering baked into the prompt — going beyond generic "optimize for this role" instructions.' },
      { heading: 'LinkedIn Selective Import', body: "Users can cherry-pick which LinkedIn fields to import rather than doing an all-or-nothing sync. The import function is pure — it never mutates the original resume data." },
    ],
    liveDemoAvailable: false,
  },
  {
    id: '2',
    slug: 'portfolio-website',
    name: 'Portfolio Website',
    industry: 'Web / Personal Branding',
    tagline: 'A fully responsive personal portfolio built in under a day using AI-assisted development, prompt engineering, and agentic AI workflows.',
    initials: 'PW',
    logoUrl: '/avnish-transparent.png',
    overview: `This portfolio website is itself a project — a demonstration of what modern AI-assisted development looks like in practice. The entire site was designed, built, and deployed in under a day through natural language conversation with Kiro, an agentic AI IDE. No design tools, no manual CSS tweaking sessions, no hours spent reading Firebase docs.`,
    quote: `"The biggest lesson: scalability isn't about making things faster. It's about controlling how work flows through the system — and AI is the best flow controller I've found."`,
    featureGroups: [
      {
        heading: 'Visual & UX',
        items: [
          { name: 'Animated Starfield', description: 'CSS + JS animated background with 150 stars.' },
          { name: 'Mouse-Trail Particles', description: 'Falling star particle effect that follows cursor movement.' },
          { name: 'Hero Avatar', description: 'Radial glow ring around the profile image.' },
          { name: 'Typing Animation', description: 'Role title types out on page load.' },
          { name: 'Scroll Animations', description: 'Fade-in triggered for every section on scroll.' },
          { name: 'Dark Mode', description: 'Default dark theme persisted via localStorage.' },
        ],
      },
      {
        heading: 'Navigation & Layout',
        items: [
          { name: 'Sticky Nav', description: 'Active link highlight updates as you scroll through sections.' },
          { name: 'Smooth Scroll', description: 'All anchor links scroll smoothly to their target.' },
          { name: 'Mobile Menu', description: 'Hamburger menu for tablet and mobile viewports.' },
          { name: 'Scroll-to-Top', description: 'Floating button appears after scrolling down.' },
          { name: 'Fully Responsive', description: 'Optimised for desktop, tablet, and mobile.' },
          { name: 'Project Detail Pages', description: 'Individual pages per project with Read More navigation.' },
        ],
      },
    ],
    techStackGroups: [
      {
        heading: 'Frontend',
        items: [
          { name: 'HTML5', description: 'Semantic markup throughout.' },
          { name: 'CSS3', description: 'Custom properties, keyframe animations, CSS Grid.' },
          { name: 'Vanilla JavaScript', description: 'No framework — single JS file, zero build step.' },
          { name: 'Google Fonts + Font Awesome', description: 'Inter, Lato, Montserrat typefaces and icon set.' },
        ],
      },
      {
        heading: 'Hosting & Analytics',
        items: [
          { name: 'Firebase Hosting', description: 'Zero-config static hosting with global CDN.' },
          { name: 'Firebase Analytics', description: 'Page-view and event tracking.' },
        ],
      },
    ],
    techTags: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Firebase Hosting', 'Firebase Analytics', 'Google Fonts', 'Font Awesome'],
    differentiators: [
      { heading: 'Zero Build Step', body: 'Deliberately framework-free. No React, no bundler, no hydration. The site loads instantly because there is nothing to compile.' },
      { heading: 'AI-Built End to End', body: 'Every feature — from the starfield to the project detail pages — was implemented through natural language prompts to Kiro. No manual CSS tweaking or copy-paste.' },
      { heading: 'CSS Theming System', body: 'All colors, shadows, and surfaces switch between light and dark mode by toggling a single .dark class on the body via CSS custom properties.' },
      { heading: 'Prompt Engineering Showcase', body: 'The project demonstrates that proper prompt engineering turns vague design intent into production-ready solutions without a single design tool.' },
    ],
    liveDemoAvailable: true,
    liveDemoUrl: 'https://avnish-portfolio-c14e6.web.app/',
  },
  {
    id: '3',
    slug: 'compufy-technology',
    name: 'Compufy Technology',
    industry: 'Corporate / Web',
    tagline: 'A high-performance corporate marketing website built with Angular 18 SSR, Tailwind CSS, and Firebase — featuring a hidden rocket game easter egg.',
    initials: 'CT',
    logoUrl: '/compufy-logo.webp',
    overview: `Compufy Technology is a corporate marketing website that presents the company's brand identity, service offerings, team information, and contact capabilities through a modern, high-performance web experience. Built with a spec-driven development methodology — requirements, design, and tasks documented before a single line of code was written. The result is a production-grade Angular application with SSR, OnPush change detection, Angular Signals, and a comprehensive test suite.`,
    quote: `"Most corporate websites are purely informational. Compufy embeds a fully functional 2D rocket game directly on top of the page — where every visible DOM element becomes a destructible target."`,
    featureGroups: [
      {
        heading: 'Core Pages',
        items: [
          { name: 'Home', description: 'Landing page with hero section, services overview, and animated sections.' },
          { name: 'Services', description: 'Categorized service offerings with individual service detail pages.' },
          { name: 'Contact', description: 'Contact form with Firebase submission handling and success state.' },
          { name: 'Who We Are', description: 'Team and company story with animated timeline.' },
          { name: 'Careers & AI Approach', description: 'Dedicated pages for hiring and AI-first development philosophy.' },
        ],
      },
      {
        heading: 'Rocket Game Easter Egg',
        items: [
          { name: 'Canvas Overlay', description: 'Rocket flies over live page content — activated via gamepad button in the navbar.' },
          { name: 'Auto-Discovered Targets', description: 'All visible DOM elements become destructible targets via getBoundingClientRect — no manual tagging.' },
          { name: 'Physics & Particles', description: 'Break animation, particle explosions on hit, and auto-scroll as rocket approaches viewport edges.' },
          { name: 'Mobile Support', description: 'Full mobile support via virtual D-pad and fire button.' },
        ],
      },
    ],
    techStackGroups: [
      {
        heading: 'Frontend',
        items: [
          { name: 'Angular 18.2', description: 'Standalone components, no NgModules.' },
          { name: 'TypeScript 5.5', description: 'Strict mode throughout.' },
          { name: 'Tailwind CSS 3.4', description: 'Utility-first, dark-mode via class strategy.' },
          { name: 'Angular Signals', description: 'signal, computed, effect for zero-boilerplate state.' },
          { name: 'Lucide-Angular', description: 'Tree-shakeable SVG icons.' },
        ],
      },
      {
        heading: 'Backend & Infrastructure',
        items: [
          { name: 'Angular SSR 18', description: 'Server-side rendering via Express 4.' },
          { name: 'Firebase 12', description: 'Firestore for contact form, Analytics for production tracking.' },
          { name: '@angular/fire 18', description: 'Typed Firebase integration.' },
          { name: 'RxJS 7.8', description: 'HTTP streams via HttpService wrapper.' },
        ],
      },
    ],
    techTags: ['Angular 18', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Angular SSR', 'Angular Signals', 'RxJS', 'Canvas 2D', 'fast-check PBT', 'Kiro AI'],
    architecture: `Browser
└── Angular Universal (SSR)
    ├── Express Server ──────────► Firebase (Firestore / Analytics)
    └── Angular SPA
        ├── AppComponent (root shell + navbar + game overlay)
        ├── Lazy-loaded Feature Routes
        │     ├── HomeComponent
        │     ├── ServicesComponent / ServiceDetailsComponent
        │     ├── ContactComponent
        │     ├── WhoWeAreComponent
        │     ├── CareersComponent
        │     └── AiApproachComponent
        ├── Shared UI (Button, Card, Input, SkeletonLoader)
        ├── Core Services (Firebase, HttpService, ErrorHandler)
        └── Rocket Game Overlay (canvas-based, SSR-safe)`,
    architectureNotes: [
      { heading: 'Standalone components', body: 'No NgModules; each component declares its own imports.' },
      { heading: 'OnPush change detection', body: 'All components use OnPush for minimal re-renders.' },
      { heading: 'Signal-first reactivity', body: 'Local and shared state via Angular Signals; RxJS reserved for HTTP only.' },
      { heading: 'Functional DI', body: 'inject() used throughout instead of constructor injection.' },
      { heading: 'Pure data layer', body: 'src/app/data/ contains only interfaces, constants, and static data with zero Angular dependencies.' },
    ],
    differentiators: [
      { heading: 'Rocket Game Easter Egg', body: 'A fully modular canvas-based mini-game embedded on every page. All visible DOM elements auto-discovered as destructible targets — no manual tagging required.' },
      { heading: 'Spec-Driven + Agentic AI', body: 'Built with Kiro AI following a requirements → design → tasks workflow. Every feature was formally specified with correctness properties before implementation.' },
      { heading: 'SSR + Hydration', body: 'Angular Universal pre-renders HTML on the server. Users see fully rendered content on first load — improving Core Web Vitals (LCP, FCP) and SEO indexability.' },
      { heading: 'Property-Based Testing', body: '8 formal correctness properties validated with fast-check: rocket bounds clamping, friction convergence, bullet cap, AABB collision, delta-time cap, particle opacity, and fire-rate limiting.' },
    ],
    liveDemoAvailable: true,
    liveDemoUrl: 'https://compufytech.web.app/',
  },
  {
    id: '4',
    slug: 'vishwakarma-carpenters',
    name: 'Vishwakarma Carpenters',
    industry: 'Business / Carpentry',
    tagline: 'A premium, cinematic single-page marketing website for a 40+ year old carpentry business — built to generate leads via WhatsApp and showcase craftsmanship.',
    initials: 'VC',
    logoUrl: '/vishwakamra-carpenter-logo.svg',
    overview: `Vishwakarma Carpenters is a premium, cinematic single-page marketing website built for a 40+ year old carpentry and custom furniture business based in Madan Mahal, Jabalpur, Madhya Pradesh, India. The goal was to modernize the business's digital presence, generate leads via WhatsApp, and showcase their craftsmanship through an immersive, high-end visual experience. The site is fully responsive, animation-rich, and optimized for SEO and performance — deployed on Firebase Hosting with a Vite production build.`,
    quote: `"The human role was to describe the problem, review outputs, and report what was wrong. The agent handled requirements, architecture, implementation, testing, and debugging — end to end."`,
    featureGroups: [
      {
        heading: 'Visual & UX',
        items: [
          { name: 'GSAP Hero Reveal', description: 'Character-by-character text reveal with parallax background.' },
          { name: '3D Flip Service Cards', description: 'CSS 3D flip cards for service showcase — hover on desktop, tap on mobile.' },
          { name: 'Masonry Portfolio Grid', description: 'Category filtering with lightbox viewer.' },
          { name: 'Testimonials Carousel', description: 'Auto-advancing carousel with stacked card depth effect.' },
          { name: 'Film Grain & Cursor Glow', description: 'Film grain overlay, cursor glow, and gold shimmer text effects.' },
          { name: 'Animated Stat Counters', description: 'Scroll-triggered number counters for business stats.' },
        ],
      },
      {
        heading: 'Lead Generation & Contact',
        items: [
          { name: 'WhatsApp Deep-Link Form', description: 'Contact form encodes data into a WhatsApp URL — no backend required.' },
          { name: 'Floating WhatsApp CTA', description: 'Fixed bottom-right WhatsApp button visible on every section.' },
          { name: 'Glassmorphism Navbar', description: 'Scroll-aware active section indicator with Framer Motion layoutId pill.' },
          { name: 'Local SEO', description: 'Structured data and meta tags optimized for Jabalpur, Madan Mahal.' },
        ],
      },
    ],
    techStackGroups: [
      {
        heading: 'Frontend',
        items: [
          { name: 'React 18', description: 'JSX, functional components, hooks.' },
          { name: 'Vite 5', description: 'Production build with tree-shaking and asset hashing.' },
          { name: 'Tailwind CSS 3', description: 'Custom design tokens: wood-dark, wood-gold, wood-cream palette.' },
          { name: 'Framer Motion 11', description: 'Declarative animations — layoutId nav pill, AnimatePresence carousel, 3D tilt form.' },
          { name: 'GSAP 3 + ScrollTrigger', description: 'Imperative timeline animations — hero char reveal, about timeline stagger.' },
          { name: 'Lucide React', description: 'Tree-shakeable icon set.' },
        ],
      },
      {
        heading: 'Infrastructure & Testing',
        items: [
          { name: 'Firebase Hosting', description: 'Global CDN, HTTPS enforced, SPA rewrites.' },
          { name: 'Vitest + Testing Library', description: 'Component unit tests in jsdom environment.' },
          { name: 'fast-check', description: 'Property-based tests across all major components.' },
        ],
      },
    ],
    techTags: ['React 18', 'Vite 5', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Firebase Hosting', 'fast-check', 'Lucide React'],
    architecture: `main.jsx
└── App.jsx
    └── Home.jsx  ← Page composition root
        ├── Navbar     (glassmorphism, scroll-aware active pill)
        ├── Hero       (GSAP char reveal, parallax bg, floating particles)
        ├── About      (story, timeline, animated stat counters)
        ├── Services   (CSS 3D flip cards × 4)
        ├── Portfolio  (masonry grid, category filter, lightbox)
        ├── WhyUs      (feature cards, sticky heading, hover glow)
        ├── Testimonials (auto-carousel, stacked cards, dot nav)
        ├── Contact    (3D tilt form → WhatsApp deep-link)
        ├── Footer
        ├── WhatsAppBtn (fixed FAB)
        └── CursorGlow (desktop mouse follower)`,
    architectureNotes: [
      { heading: 'Decoupled data layer', body: 'All content lives in src/data/ as plain JS named exports — services, portfolio items, testimonials, stats. Components import and render, never hardcode.' },
      { heading: 'GSAP + Framer Motion coexistence', body: 'GSAP handles DOM-level entrance sequences; Framer Motion handles React state-driven interactions. Both scoped to avoid conflicts.' },
      { heading: 'WhatsApp form (no backend)', body: 'Form validates client-side, encodes data into a WhatsApp deep-link URL, and opens in a new tab — zero server infrastructure needed.' },
      { heading: 'Touch-friendly 3D cards', body: 'Detected (hover: none) media query; replaced hover-flip with tap-toggle state via useState for mobile users.' },
    ],
    differentiators: [
      { heading: 'Cinematic Animation Stack', body: 'Dual animation system — GSAP for timeline-based entrance sequences and Framer Motion for React state-driven interactions — without conflicts.' },
      { heading: 'Zero-Backend Lead Gen', body: 'Contact form encodes all fields into a WhatsApp deep-link URL. Leads go directly to the business owner\'s WhatsApp — no server, no database, no maintenance.' },
      { heading: 'Premium Design System', body: 'Custom Tailwind tokens (wood-dark, wood-gold, wood-cream), Playfair Display headings, film grain overlay, gold shimmer text, and cursor glow create a luxury feel.' },
      { heading: 'Property-Based Test Suite', body: '8 test files covering navbar active detection, carousel index bounds, category filter correctness, counter animation, and semantic HTML structure using fast-check.' },
    ],
    liveDemoAvailable: true,
    liveDemoUrl: 'https://vishwakarma-carpenter.web.app',
  },
];

export const CLIENT_PROJECTS_BY_SLUG: Map<string, ClientProject> = new Map(
  CLIENT_PROJECTS_DATA.map(p => [p.slug, p])
);
