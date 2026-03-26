import * as fc from 'fast-check';
import { TestBed } from '@angular/core/testing';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from './seo.service';
import { SeoConfig } from '../data/models/seo.model';
import { SERVICES_BY_SLUG } from '../data/static/services.data';

/** Remove DOM elements injected by SeoService between property runs */
function cleanupDom(doc: Document, meta: Meta): void {
  doc.getElementById('seo-canonical')?.remove();
  doc.getElementById('seo-json-ld')?.remove();
  meta.removeTag('name="robots"');
}

/**
 * Printable ASCII strings — avoids null bytes and control characters that
 * the browser's document.title setter silently strips, which would cause
 * title round-trip comparisons to fail spuriously.
 */
const printableAscii = (minLength = 0) =>
  fc.string({ minLength, unit: 'grapheme-ascii' })
    .filter(s => !/[\x00-\x1f\x7f]/.test(s));

describe('SeoService PBT', () => {
  let service: SeoService;
  let meta: Meta;
  let title: Title;
  let doc: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
    service = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
    title = TestBed.inject(Title);
    doc = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    cleanupDom(doc, meta);
    TestBed.resetTestingModule();
  });

  // ── Property 1: Title suffix invariant ──────────────────────────────────
  // Feature: seo-per-page, Property 1
  // Validates: Requirements 1.2
  it('P1: for any non-empty title, document title equals config.title + " | Compufy Technology"', () => {
    // The browser's document.title setter normalises whitespace:
    // - leading/trailing spaces are trimmed
    // - consecutive internal spaces are collapsed to one
    // Constrain the generator to titles that are already normalised so the
    // round-trip comparison is exact.
    const normalisedTitle = printableAscii(1).filter(
      s => s === s.trim() && !s.includes('  ')
    );

    fc.assert(
      fc.property(
        fc.record({
          title: normalisedTitle,
          description: printableAscii(),
          canonicalPath: printableAscii(),
        }),
        (config: SeoConfig) => {
          cleanupDom(doc, meta);
          service.setPage(config);
          const result = title.getTitle();
          const expected = `${config.title} | Compufy Technology`;
          expect(result).toBe(expected);
          return result === expected;
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── Property 2: All meta tags are set after setPage ──────────────────────
  // Feature: seo-per-page, Property 2
  // Validates: Requirements 1.3, 1.4, 1.5
  it('P2: for any SeoConfig, all required meta tags have non-empty content after setPage', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: printableAscii(1),
          description: printableAscii(1),
          canonicalPath: printableAscii(),
        }),
        (config: SeoConfig) => {
          cleanupDom(doc, meta);
          service.setPage(config);

          const requiredSelectors = [
            'name="description"',
            'property="og:title"',
            'property="og:description"',
            'property="og:url"',
            'property="og:type"',
            'property="og:image"',
            'property="og:site_name"',
            'name="twitter:card"',
            'name="twitter:title"',
            'name="twitter:description"',
            'name="twitter:image"',
          ];

          const allPresent = requiredSelectors.every(selector => {
            const tag = meta.getTag(selector);
            return tag !== null && tag.content.length > 0;
          });

          expect(allPresent).toBeTrue();
          return allPresent;
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── Property 3: Canonical URL formation ─────────────────────────────────
  // Feature: seo-per-page, Property 3
  // Validates: Requirements 1.6, 10.2
  it('P3: for any canonicalPath, canonical href equals siteUrl + config.canonicalPath', () => {
    const siteUrl = 'http://localhost:4200'; // from environment.ts

    fc.assert(
      fc.property(
        fc.record({
          title: printableAscii(1),
          description: printableAscii(),
          canonicalPath: printableAscii(),
        }),
        (config: SeoConfig) => {
          cleanupDom(doc, meta);
          service.setPage(config);

          const canonical = doc.getElementById('seo-canonical') as HTMLLinkElement | null;
          expect(canonical).not.toBeNull();
          if (!canonical) return false;

          const href = canonical.getAttribute('href') ?? '';
          const expected = siteUrl + config.canonicalPath;
          expect(href).toBe(expected);
          return href === expected;
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── Property 4: JSON-LD round-trip ───────────────────────────────────────
  // Feature: seo-per-page, Property 4
  // Validates: Requirements 1.7, 1.8
  it('P4: setPage with jsonLd injects script; setPage without jsonLd removes it', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: printableAscii(1),
          description: printableAscii(),
          canonicalPath: printableAscii(),
          jsonLd: fc.object(),
        }),
        (config: SeoConfig) => {
          cleanupDom(doc, meta);

          // Call with jsonLd — script must be present
          service.setPage(config);
          const scriptAfterWith = doc.getElementById('seo-json-ld');
          expect(scriptAfterWith).not.toBeNull();
          if (!scriptAfterWith) return false;

          // Call without jsonLd — script must be removed
          const configWithoutJsonLd: SeoConfig = {
            title: config.title,
            description: config.description,
            canonicalPath: config.canonicalPath,
          };
          service.setPage(configWithoutJsonLd);
          const scriptAfterWithout = doc.getElementById('seo-json-ld');
          expect(scriptAfterWithout).toBeNull();
          return scriptAfterWithout === null;
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── Property 5: Service detail SEO derived from data ────────────────────
  // Feature: seo-per-page, Property 5
  // Validates: Requirements 4.1, 4.2, 4.3
  it('P5: for any valid slug, service SEO config produces correct title, description, and canonical', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SERVICES_BY_SLUG.keys()),
        (slug: string) => {
          cleanupDom(doc, meta);

          const svc = SERVICES_BY_SLUG.get(slug)!;
          const truncatedDesc = (svc.overview ?? svc.description).slice(0, 160);
          const config: SeoConfig = {
            title: svc.title,
            description: truncatedDesc,
            canonicalPath: '/services/' + svc.slug,
          };

          service.setPage(config);

          // Title must contain service title
          const pageTitle = title.getTitle();
          expect(pageTitle).toContain(svc.title);

          // Meta description must equal the truncated overview
          const descTag = meta.getTag('name="description"');
          expect(descTag).not.toBeNull();
          expect(descTag?.content).toBe(truncatedDesc);

          // Canonical must end with /services/<slug>
          const canonical = doc.getElementById('seo-canonical') as HTMLLinkElement | null;
          expect(canonical).not.toBeNull();
          const href = canonical?.getAttribute('href') ?? '';
          expect(href).toContain('/services/' + svc.slug);

          return (
            pageTitle.includes(svc.title) &&
            descTag?.content === truncatedDesc &&
            href.endsWith('/services/' + svc.slug)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── Property 6: noindex set and removed correctly ────────────────────────
  // Feature: seo-per-page, Property 6
  // Validates: Requirements 4.5, 4.6, 8.2, 8.3
  it('P6: noIndex:true sets robots tag; subsequent setPage without noIndex removes it', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: printableAscii(1),
          description: printableAscii(),
          canonicalPath: printableAscii(),
        }),
        (config: SeoConfig) => {
          cleanupDom(doc, meta);

          // Set with noIndex: true — robots tag must be present
          service.setPage({ ...config, noIndex: true });
          const robotsTag = meta.getTag('name="robots"');
          expect(robotsTag).not.toBeNull();
          expect(robotsTag?.content).toBe('noindex, nofollow');
          if (!robotsTag || robotsTag.content !== 'noindex, nofollow') return false;

          // Set without noIndex — robots tag must be removed
          service.setPage({ ...config, noIndex: false });
          const robotsAfter = meta.getTag('name="robots"');
          expect(robotsAfter).toBeNull();
          return robotsAfter === null;
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── Property 7: No duplicate meta tags ──────────────────────────────────
  // Feature: seo-per-page, Property 7
  // Validates: Requirements 9.3
  it('P7: calling setPage twice produces the same meta tag count as calling it once', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: printableAscii(1),
          description: printableAscii(1),
          canonicalPath: printableAscii(),
        }),
        (config: SeoConfig) => {
          cleanupDom(doc, meta);

          service.setPage(config);
          const countAfterFirst = doc.head.querySelectorAll('meta').length;

          service.setPage(config);
          const countAfterSecond = doc.head.querySelectorAll('meta').length;

          expect(countAfterSecond).toBe(countAfterFirst);
          return countAfterSecond === countAfterFirst;
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── Property 8: Default OG image fallback ───────────────────────────────
  // Feature: seo-per-page, Property 8
  // Validates: Requirements 11.2
  it('P8: when ogImage is undefined, og:image and twitter:image equal "/og-default.png"', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: printableAscii(1),
          description: printableAscii(),
          canonicalPath: printableAscii(),
          // deliberately no ogImage field
        }),
        (config: SeoConfig) => {
          cleanupDom(doc, meta);
          service.setPage(config);

          const ogImage = meta.getTag('property="og:image"')?.content;
          const twitterImage = meta.getTag('name="twitter:image"')?.content;

          expect(ogImage).toBe('/og-default.png');
          expect(twitterImage).toBe('/og-default.png');
          return ogImage === '/og-default.png' && twitterImage === '/og-default.png';
        }
      ),
      { numRuns: 100 }
    );
  });
});
