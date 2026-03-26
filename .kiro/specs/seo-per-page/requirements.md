# Requirements Document

## Introduction

This feature adds comprehensive, per-page SEO to the Compufy Technology marketing website. Every routed page — Home, Services (list and detail), Contact, Who We Are, Careers, and Coming Soon — will receive unique, server-side-rendered `<title>`, meta description, Open Graph, Twitter Card, and canonical URL tags. Service detail pages will additionally carry JSON-LD structured data. The implementation uses Angular's built-in `Title` and `Meta` services together with a shared `SeoService`, ensuring all tags are injected during SSR so search engine crawlers and social media scrapers receive fully-populated HTML without executing JavaScript.

## Glossary

- **SeoService**: A singleton Angular service (`providedIn: 'root'`) responsible for setting all SEO-related document metadata on each navigation.
- **Title_Service**: Angular's built-in `Title` service (`@angular/platform-browser`) used to set `document.title`.
- **Meta_Service**: Angular's built-in `Meta` service (`@angular/platform-browser`) used to add, update, or remove `<meta>` tags.
- **Canonical_URL**: A `<link rel="canonical" href="...">` tag that declares the preferred URL for a page to prevent duplicate-content penalties.
- **Open_Graph_Tags**: `<meta property="og:*">` tags that control how a page appears when shared on social platforms (Facebook, LinkedIn, etc.).
- **Twitter_Card_Tags**: `<meta name="twitter:*">` tags that control how a page appears when shared on Twitter/X.
- **JSON-LD**: A `<script type="application/ld+json">` block containing structured data in Schema.org vocabulary, used by search engines to understand page content.
- **SSR**: Angular Server-Side Rendering — the Express server pre-renders each page to HTML before sending it to the client.
- **Page_Component**: Any routed Angular standalone component (HomeComponent, ServicesComponent, ServiceDetailsComponent, ContactComponent, WhoWeAreComponent, CareersComponent, ComingSoonComponent).
- **Base_URL**: The canonical origin of the site (e.g., `https://compufy.tech`), stored in the environment config.
- **SeoConfig**: A TypeScript interface describing the full set of SEO properties for a single page (title, description, OG fields, canonical path, JSON-LD payload).

---

## Requirements

### Requirement 1: Centralised SEO Service

**User Story:** As a developer, I want a single service that manages all SEO metadata, so that every page sets tags consistently and I never have to duplicate tag-management logic.

#### Acceptance Criteria

1. THE SeoService SHALL expose a `setPage(config: SeoConfig)` method that accepts a `SeoConfig` object and applies all metadata in a single call.
2. WHEN `setPage` is called, THE SeoService SHALL update the document title using Title_Service to the value `config.title + " | Compufy Technology"`.
3. WHEN `setPage` is called, THE SeoService SHALL upsert the `description` meta tag with `config.description`.
4. WHEN `setPage` is called, THE SeoService SHALL upsert all Open_Graph_Tags: `og:title`, `og:description`, `og:url`, `og:type`, `og:image`, and `og:site_name`.
5. WHEN `setPage` is called, THE SeoService SHALL upsert all Twitter_Card_Tags: `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image`.
6. WHEN `setPage` is called, THE SeoService SHALL set or replace the `<link rel="canonical">` element in `<head>` with the absolute URL formed by concatenating Base_URL and `config.canonicalPath`.
7. WHEN `config.jsonLd` is provided, THE SeoService SHALL inject a `<script type="application/ld+json">` element into `<head>` containing the serialised JSON-LD payload.
8. WHEN `config.jsonLd` is not provided, THE SeoService SHALL remove any previously injected JSON-LD `<script>` element from `<head>`.
9. THE SeoService SHALL be `providedIn: 'root'` so that a single instance is shared across the entire application.
10. THE SeoConfig interface SHALL include the fields: `title` (string), `description` (string), `canonicalPath` (string), `ogImage` (string), and optional `jsonLd` (object).

---

### Requirement 2: Home Page SEO

**User Story:** As a marketing stakeholder, I want the Home page to have optimised SEO metadata, so that it ranks well for Compufy Technology's brand and core value proposition.

#### Acceptance Criteria

1. WHEN the Home page is navigated to, THE SeoService SHALL set the title to `"Home | Compufy Technology"`.
2. WHEN the Home page is navigated to, THE SeoService SHALL set the meta description to a value that describes Compufy Technology's core offering in 150–160 characters.
3. WHEN the Home page is navigated to, THE SeoService SHALL set `og:type` to `"website"`.
4. WHEN the Home page is navigated to, THE SeoService SHALL set the canonical URL to `Base_URL + "/"`.
5. WHEN the Home page is navigated to, THE SeoService SHALL inject a JSON-LD block of type `Organization` containing the company name, URL, and logo.

---

### Requirement 3: Services List Page SEO

**User Story:** As a marketing stakeholder, I want the Services list page to have SEO metadata that communicates the breadth of Compufy Technology's offerings, so that it attracts visitors searching for technology services.

#### Acceptance Criteria

1. WHEN the Services list page is navigated to, THE SeoService SHALL set the title to `"Services | Compufy Technology"`.
2. WHEN the Services list page is navigated to, THE SeoService SHALL set the meta description to a value that summarises the service categories in 150–160 characters.
3. WHEN the Services list page is navigated to, THE SeoService SHALL set the canonical URL to `Base_URL + "/services"`.
4. WHEN the Services list page is navigated to, THE SeoService SHALL inject a JSON-LD block of type `ItemList` enumerating each service category as a `ListItem`.

---

### Requirement 4: Service Detail Page SEO

**User Story:** As a marketing stakeholder, I want each individual service detail page to have unique SEO metadata derived from the service's own data, so that each service can rank independently in search results.

#### Acceptance Criteria

1. WHEN a service detail page is navigated to with a valid slug, THE SeoService SHALL set the title to `"<service.title> | Compufy Technology"`.
2. WHEN a service detail page is navigated to with a valid slug, THE SeoService SHALL set the meta description to the service's `overview` field, truncated to 160 characters if necessary.
3. WHEN a service detail page is navigated to with a valid slug, THE SeoService SHALL set the canonical URL to `Base_URL + "/services/" + service.slug`.
4. WHEN a service detail page is navigated to with a valid slug, THE SeoService SHALL inject a JSON-LD block of type `Service` containing the service name, description, and provider organisation.
5. WHEN a service detail page is navigated to with an invalid slug (service not found), THE SeoService SHALL set the title to `"Service Not Found | Compufy Technology"` and set the meta `robots` tag to `"noindex, nofollow"`.
6. WHEN navigating away from a service detail page, THE SeoService SHALL remove the `robots` noindex tag if it was previously set.

---

### Requirement 5: Contact Page SEO

**User Story:** As a marketing stakeholder, I want the Contact page to have SEO metadata that encourages visitors to reach out, so that it converts search traffic into enquiries.

#### Acceptance Criteria

1. WHEN the Contact page is navigated to, THE SeoService SHALL set the title to `"Contact Us | Compufy Technology"`.
2. WHEN the Contact page is navigated to, THE SeoService SHALL set the meta description to a value that invites visitors to get in touch, in 150–160 characters.
3. WHEN the Contact page is navigated to, THE SeoService SHALL set the canonical URL to `Base_URL + "/contact"`.
4. WHEN the Contact page is navigated to, THE SeoService SHALL inject a JSON-LD block of type `ContactPage` referencing the organisation.

---

### Requirement 6: Who We Are Page SEO

**User Story:** As a marketing stakeholder, I want the Who We Are page to have SEO metadata that highlights the team and company story, so that it builds trust with visitors who research the company before engaging.

#### Acceptance Criteria

1. WHEN the Who We Are page is navigated to, THE SeoService SHALL set the title to `"Who We Are | Compufy Technology"`.
2. WHEN the Who We Are page is navigated to, THE SeoService SHALL set the meta description to a value that introduces the founding team and company ethos in 150–160 characters.
3. WHEN the Who We Are page is navigated to, THE SeoService SHALL set the canonical URL to `Base_URL + "/who-we-are"`.
4. WHEN the Who We Are page is navigated to, THE SeoService SHALL inject a JSON-LD block of type `AboutPage` referencing the organisation.

---

### Requirement 7: Careers Page SEO

**User Story:** As a marketing stakeholder, I want the Careers page to have SEO metadata that attracts job seekers, so that open positions are discoverable through search engines.

#### Acceptance Criteria

1. WHEN the Careers page is navigated to, THE SeoService SHALL set the title to `"Careers | Compufy Technology"`.
2. WHEN the Careers page is navigated to, THE SeoService SHALL set the meta description to a value that communicates the company's hiring intent in 150–160 characters.
3. WHEN the Careers page is navigated to, THE SeoService SHALL set the canonical URL to `Base_URL + "/careers"`.
4. WHEN the Careers page is navigated to, THE SeoService SHALL inject a JSON-LD block of type `JobPosting` or `WebPage` appropriate to the page content.

---

### Requirement 8: Coming Soon Page SEO

**User Story:** As a marketing stakeholder, I want the Coming Soon page to be excluded from search engine indexing, so that placeholder content does not appear in search results and dilute the site's SEO authority.

#### Acceptance Criteria

1. WHEN the Coming Soon page is navigated to, THE SeoService SHALL set the title to `"Coming Soon | Compufy Technology"`.
2. WHEN the Coming Soon page is navigated to, THE SeoService SHALL set the meta `robots` tag to `"noindex, nofollow"`.
3. WHEN navigating away from the Coming Soon page, THE SeoService SHALL remove the `robots` noindex tag so subsequent pages are indexable.

---

### Requirement 9: SSR Compatibility

**User Story:** As a developer, I want all SEO tags to be present in the server-rendered HTML, so that search engine crawlers and social media scrapers receive complete metadata without executing JavaScript.

#### Acceptance Criteria

1. WHEN a page is rendered on the server via Angular SSR, THE SeoService SHALL set all metadata tags before the HTTP response is sent to the client.
2. THE SeoService SHALL use Angular's `DOCUMENT` injection token rather than direct `window` or `document` globals, so that it operates correctly in both browser and server environments.
3. WHEN the browser hydrates the SSR-rendered page, THE SeoService SHALL not produce duplicate meta tags; existing tags SHALL be updated in place using Meta_Service's `updateTag` method.
4. THE SeoService SHALL be compatible with Angular's `TransferState` mechanism so that metadata set during SSR is not redundantly re-applied on the client when the state is already present.

---

### Requirement 10: Base URL Configuration

**User Story:** As a developer, I want the canonical base URL to be driven by environment configuration, so that development, staging, and production environments each use the correct origin without code changes.

#### Acceptance Criteria

1. THE environment config SHALL include a `siteUrl` field containing the absolute base URL for each environment (e.g., `"https://compufy.tech"` for production, `"http://localhost:4200"` for development).
2. THE SeoService SHALL read `siteUrl` from the injected environment config to construct all canonical and Open Graph URLs.
3. IF `siteUrl` is not defined in the environment config, THEN THE SeoService SHALL fall back to an empty string and log a warning to the console.

---

### Requirement 11: Default OG Image

**User Story:** As a marketing stakeholder, I want every page to have a fallback Open Graph image, so that social media shares always display a branded preview even when no page-specific image is defined.

#### Acceptance Criteria

1. THE SeoService SHALL define a default OG image path pointing to a static asset in the `public/` directory (e.g., `/og-default.png`).
2. WHEN `config.ogImage` is not provided in a `SeoConfig`, THE SeoService SHALL use the default OG image path for `og:image` and `twitter:image`.
3. THE default OG image SHALL be a static file present in the `public/` directory so that it is served as a static asset by the Express SSR server.
