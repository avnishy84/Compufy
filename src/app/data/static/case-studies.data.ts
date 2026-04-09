import { CaseStudy } from '../models/case-study.model';

export const CASE_STUDIES_DATA: CaseStudy[] = [
  {
    id: '1',
    slug: 'retail-inventory-platform',
    clientName: 'RetailEdge Solutions',
    projectTitle: 'Real-Time Retail Inventory Platform',
    shortDescription:
      'A cloud-native inventory management system that reduced stock discrepancies by 94% for a mid-size retail chain.',
    tags: ['Angular', 'Firebase', 'Cloud Functions', 'Real-Time'],
    problemStatement:
      'RetailEdge operated across 12 stores with no centralised inventory view. Stock counts were reconciled manually via spreadsheets, leading to frequent over-ordering, stockouts, and a 6–8% shrinkage rate that cost the business significantly each quarter.',
    solution:
      'We built a real-time inventory platform on Firebase Firestore with an Angular dashboard. Store staff scan barcodes on mobile devices; changes propagate instantly to the central view. Cloud Functions enforce business rules (reorder thresholds, transfer approvals) without any server management overhead.',
    technicalDepth:
      "Firestore's optimistic concurrency model required careful transaction design to prevent double-decrement on concurrent scans. We implemented a custom conflict-resolution layer using Firestore transactions and a write-ahead log pattern. The Angular frontend uses OnPush change detection throughout, keeping the dashboard smooth even with hundreds of real-time updates per minute.",
    liveDemoUrl: 'https://retail-demo.compufytech.web.app',
  },
  {
    id: '2',
    slug: 'logistics-route-optimiser',
    clientName: 'SwiftMove Logistics',
    projectTitle: 'AI-Assisted Route Optimisation Engine',
    shortDescription:
      'A route planning tool that cut average delivery time by 31% and fuel costs by 22% for a regional logistics provider.',
    tags: ['Angular', 'Node.js', 'Google Maps API', 'Optimisation'],
    problemStatement:
      'SwiftMove dispatchers manually planned 200+ daily routes using a legacy desktop tool. The process took 3–4 hours each morning, routes were suboptimal, and last-minute order additions caused cascading delays across the fleet.',
    solution:
      'We replaced the legacy tool with a web-based dispatch console. Dispatchers drag-and-drop orders onto a live map; the backend calls a constraint-satisfaction solver to rebalance routes in under two seconds. The system integrates with Google Maps Platform for real-time traffic and supports live re-routing when drivers report delays.',
    technicalDepth:
      'The optimisation backend is a Node.js service wrapping a custom implementation of the Clarke-Wright savings algorithm, extended with time-window constraints. We use Angular Signals for the dispatch UI state so the map and sidebar stay in sync without any manual change detection. WebSocket push from the backend ensures dispatchers see driver positions and ETAs update live.',
    liveDemoUrl: '',
  },
  {
    id: '3',
    slug: 'healthcare-patient-portal',
    clientName: 'MedConnect Clinics',
    projectTitle: 'Patient Self-Service Portal',
    shortDescription:
      'A HIPAA-aligned patient portal enabling online appointment booking, prescription refills, and secure messaging with care teams.',
    tags: ['Angular', 'Firebase Auth', 'SSR', 'Accessibility'],
    problemStatement:
      "MedConnect's front-desk staff spent 40% of their time handling appointment calls and prescription refill requests. Patients had no digital channel to interact with their care team, leading to long hold times and low satisfaction scores.",
    solution:
      'We delivered a server-side-rendered Angular portal with Firebase Authentication for secure login. Patients book appointments, request refills, and message their care team through a clean, accessible interface. Automated Cloud Function triggers notify staff of new requests and send patients confirmation emails.',
    technicalDepth:
      "SSR was critical for initial load performance on low-bandwidth connections common in the clinic's patient demographic. We used Angular Universal with Express, pre-rendering static shells and hydrating on the client. All forms are built with Angular Reactive Forms and custom validators that enforce HIPAA-compliant input patterns. Accessibility was a first-class concern: every interactive element meets WCAG 2.1 AA contrast and keyboard-navigation requirements.",
    liveDemoUrl: 'https://medconnect-demo.compufytech.web.app',
  },
];

// Runtime duplicate-slug guard — throws during module initialisation if data is invalid
const _slugs = CASE_STUDIES_DATA.map(cs => cs.slug);
const _unique = new Set(_slugs);
if (_unique.size !== _slugs.length) {
  throw new Error('CASE_STUDIES_DATA contains duplicate slugs');
}

export const CASE_STUDIES_BY_SLUG: Map<string, CaseStudy> = new Map(
  CASE_STUDIES_DATA.map(cs => [cs.slug, cs])
);
