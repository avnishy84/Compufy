# Implementation Plan: SEO Per Page

## Overview

Implement per-page SEO metadata across all routed pages using a centralised `SeoService`. The service manages document title, meta description, Open Graph, Twitter Card, canonical URL, and JSON-LD structured data — all injected during SSR.

## Tasks

- [x] 1. Add siteUrl to environment configs
  - Add `siteUrl: 'http://localhost:4200'` to `src/environments/environment.ts`
  - Add `siteUrl: 'https://compufy.tech'` to `src/environments/environment.prod.ts`
  - _Requirements: 10.1_

- [x] 2. Create SeoConfig model and SeoService
  - [x] 2.1 Create `src/app/data/models/seo.model.ts` with the `SeoConfig` interface
    - Fields: `title`, `description`, `canonicalPath`, `ogImage?`, `ogType?`, `jsonLd?`
    - _Requirements: 1.10_

  - [x] 2.2 Create `src/app/core/seo.service.ts` with full implementation
    - Inject `Title`, `Meta`, `DOCUMENT`, read `environment.siteUrl` (warn + fallback to `''` if missing)
    - Implement `setPage(config: SeoConfig)`: set title with suffix, upsert all meta/OG/Twitter tags, call `upsertCanonical`, conditionally call `upsertJsonLd` or `removeJsonLd`, always call `removeRobotsNoIndex` first
    - Implement `setPageNotFound(label: string)`: set title + call `upsertRobotsNoIndex`
    - Implement private helpers: `upsertCanonical`, `upsertJsonLd`, `removeJsonLd`, `upsertRobotsNoIndex`, `removeRobotsNoIndex`
    - Use `id="seo-canonical"` and `id="seo-json-ld"` for stable DOM element lookup
    - Use `Meta.updateTag` (not `addTag`) to prevent duplicate tags on SSR hydration
    - Default OG image: `/og-default.png`; use when `config.ogImage` is absent
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 9.2, 9.3, 10.2, 10.3, 11.1, 11.2_

  - [x] 2.3 Write unit tests for SeoService in `src/app/core/seo.service.spec.ts`
    - Test `setPage` with full config sets all expected tags
    - Test `setPage` with `ogImage` omitted uses default `/og-default.png`
    - Test `setPage` with `jsonLd` injects script; second call without `jsonLd` removes it
    - Test `setPageNotFound` sets noindex; subsequent `setPage` removes it
    - Test missing `siteUrl` logs `console.warn` and falls back to `''`
    - _Requirements: 1.1–1.9, 9.3, 10.3, 11.2_

  - [x] 2.4 Write property-based tests for SeoService in `src/app/core/seo.service.pbt.spec.ts`
    - **Property 1: Title suffix invariant** — for any non-empty title, document title equals `config.title + " | Compufy Technology"` — **Validates: Requirements 1.2**
    - **Property 2: All meta tags are set after setPage** — for any `SeoConfig`, all required meta tags have non-empty content — **Validates: Requirements 1.3, 1.4, 1.5**
    - **Property 3: Canonical URL formation** — for any `canonicalPath`, canonical href equals `siteUrl + config.canonicalPath` — **Validates: Requirements 1.6, 10.2**
    - **Property 4: JSON-LD round-trip** — setPage with jsonLd injects script; setPage without jsonLd removes it — **Validates: Requirements 1.7, 1.8**
    - **Property 5: Service detail SEO derived from data** — for any valid slug, title contains service title, description contains truncated overview, canonical ends with `/services/` + slug — **Validates: Requirements 4.1, 4.2, 4.3**
    - **Property 6: noindex set and removed correctly** — noindex pages set robots tag; subsequent normal setPage removes it — **Validates: Requirements 4.5, 4.6, 8.2, 8.3**
    - **Property 7: No duplicate meta tags** — calling setPage twice produces same tag count as once — **Validates: Requirements 9.3**
    - **Property 8: Default OG image fallback** — when ogImage is undefined, og:image and twitter:image equal `/og-default.png` — **Validates: Requirements 11.2**
    - Use `fc.record(...)` for arbitrary `SeoConfig`, minimum 100 runs per property
    - _Requirements: 1.2–1.8, 4.1–4.3, 4.5, 4.6, 8.2, 8.3, 9.3, 11.2_

- [x] 3. Create static SEO data
  - Create `src/app/data/static/seo.data.ts` with all page SEO constants
  - `HOME_SEO`: title `'Home'`, description ~155 chars, canonicalPath `'/'`, ogType `'website'`, Organization JSON-LD
  - `SERVICES_SEO`: title `'Services'`, description ~155 chars, canonicalPath `'/services'`, ItemList JSON-LD
  - `CONTACT_SEO`: title `'Contact Us'`, description ~155 chars, canonicalPath `'/contact'`, ContactPage JSON-LD
  - `WHO_WE_ARE_SEO`: title `'Who We Are'`, description ~155 chars, canonicalPath `'/who-we-are'`, AboutPage JSON-LD
  - `CAREERS_SEO`: title `'Careers'`, description ~155 chars, canonicalPath `'/careers'`, WebPage JSON-LD
  - `COMING_SOON_SEO`: title `'Coming Soon'`, description, canonicalPath `'/coming-soon'`, no jsonLd
  - _Requirements: 2.1–2.5, 3.1–3.4, 5.1–5.4, 6.1–6.4, 7.1–7.4, 8.1_

- [~] 4. Add default OG image placeholder
  - Create `public/og-default.png` as a placeholder static asset (1×1 transparent PNG or copy an existing brand image)
  - _Requirements: 11.3_

- [ ] 5. Wire SeoService into page components
  - [~] 5.1 Modify `src/app/features/home/home.component.ts` — inject `SeoService`, call `setPage(HOME_SEO)` in constructor
    - _Requirements: 2.1–2.5_

  - [~] 5.2 Modify `src/app/features/services/services.component.ts` — inject `SeoService`, call `setPage(SERVICES_SEO)` in constructor
    - _Requirements: 3.1–3.4_

  - [~] 5.3 Modify `src/app/features/services/service-details/service-details.component.ts` — inject `SeoService` and `ActivatedRoute`, derive config from service data via slug, call `setPage(buildServiceSeoConfig(service))` for valid slugs or `setPageNotFound('Service Not Found')` for invalid slugs
    - Add `buildServiceSeoConfig(service)` helper that constructs `SeoConfig` with Service JSON-LD, truncating overview to 160 chars
    - _Requirements: 4.1–4.6_

  - [~] 5.4 Modify `src/app/features/contact/contact.component.ts` — inject `SeoService`, call `setPage(CONTACT_SEO)` in constructor
    - _Requirements: 5.1–5.4_

  - [~] 5.5 Modify `src/app/features/who-we-are/who-we-are.component.ts` — inject `SeoService`, call `setPage(WHO_WE_ARE_SEO)` in constructor
    - _Requirements: 6.1–6.4_

  - [ ] 5.6 Modify `src/app/features/careers/careers.component.ts` — inject `SeoService`, call `setPage(CAREERS_SEO)` in constructor
    - _Requirements: 7.1–7.4_

  - [ ] 5.7 Modify `src/app/features/coming-soon/coming-soon.component.ts` — inject `SeoService`, call `setPage(COMING_SOON_SEO)` in constructor; `COMING_SOON_SEO` has no jsonLd so `setPage` will call `upsertRobotsNoIndex` via the noindex flag
    - Note: Coming Soon needs `noindex` — either add a `noIndex?: boolean` flag to `SeoConfig` and handle in `setPage`, or use a dedicated `setComingSoon()` method on `SeoService`
    - _Requirements: 8.1–8.3_

- [ ] 6. Checkpoint — Ensure all tests pass
  - Run `ng test --watch=false` and confirm all unit and property-based tests pass. Ask the user if any questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- `Meta.updateTag` is used throughout to prevent duplicate tags on SSR hydration
- The `id` attributes on canonical link and JSON-LD script elements enable stable DOM lookup without querying all elements
- Property tests require a fresh DOM state between runs to avoid state leakage — use `TestBed.resetTestingModule()` or recreate the service per run
