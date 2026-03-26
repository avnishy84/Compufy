import { TestBed } from '@angular/core/testing';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from './seo.service';
import { SeoConfig } from '../data/models/seo.model';

const FULL_CONFIG: SeoConfig = {
  title: 'Test Page',
  description: 'A test description for the page.',
  canonicalPath: '/test',
  ogImage: 'https://example.com/image.png',
  ogType: 'article',
  jsonLd: { '@type': 'WebPage', name: 'Test Page' },
};

const MINIMAL_CONFIG: SeoConfig = {
  title: 'Minimal Page',
  description: 'Minimal description.',
  canonicalPath: '/minimal',
};

describe('SeoService', () => {
  let service: SeoService;
  let meta: Meta;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
    service = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
    document = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    // Clean up DOM elements injected by the service
    document.getElementById('seo-canonical')?.remove();
    document.getElementById('seo-json-ld')?.remove();
    meta.removeTag('name="robots"');
  });

  // ── Test 1: setPage sets document title with suffix ──────────────────────
  it('setPage with full config sets document title with " | Compufy Technology" suffix', () => {
    service.setPage(FULL_CONFIG);
    const title = TestBed.inject(Title);
    expect(title.getTitle()).toBe('Test Page | Compufy Technology');
  });

  // ── Test 2: setPage sets meta description ───────────────────────────────
  it('setPage sets meta description', () => {
    service.setPage(FULL_CONFIG);
    const tag = meta.getTag('name="description"');
    expect(tag).toBeTruthy();
    expect(tag!.content).toBe('A test description for the page.');
  });

  // ── Test 3: setPage sets all OG tags ────────────────────────────────────
  it('setPage sets all Open Graph tags', () => {
    service.setPage(FULL_CONFIG);

    expect(meta.getTag('property="og:title"')?.content).toBe('Test Page');
    expect(meta.getTag('property="og:description"')?.content).toBe('A test description for the page.');
    expect(meta.getTag('property="og:type"')?.content).toBe('article');
    expect(meta.getTag('property="og:image"')?.content).toBe('https://example.com/image.png');
    expect(meta.getTag('property="og:site_name"')?.content).toBe('Compufy Technology');

    const ogUrl = meta.getTag('property="og:url"')?.content ?? '';
    expect(ogUrl).toContain('/test');
  });

  // ── Test 4: setPage sets all Twitter tags ───────────────────────────────
  it('setPage sets all Twitter Card tags', () => {
    service.setPage(FULL_CONFIG);

    expect(meta.getTag('name="twitter:card"')?.content).toBe('summary_large_image');
    expect(meta.getTag('name="twitter:title"')?.content).toBe('Test Page');
    expect(meta.getTag('name="twitter:description"')?.content).toBe('A test description for the page.');
    expect(meta.getTag('name="twitter:image"')?.content).toBe('https://example.com/image.png');
  });

  // ── Test 5: setPage sets canonical link href ─────────────────────────────
  it('setPage sets canonical link href to siteUrl + canonicalPath', () => {
    service.setPage(FULL_CONFIG);
    const canonical = document.getElementById('seo-canonical') as HTMLLinkElement | null;
    expect(canonical).toBeTruthy();
    expect(canonical!.getAttribute('rel')).toBe('canonical');
    const href = canonical!.getAttribute('href') ?? '';
    expect(href).toContain('/test');
  });

  // ── Test 6: setPage with ogImage omitted uses default ───────────────────
  it('setPage with ogImage omitted uses default /og-default.png for og:image and twitter:image', () => {
    service.setPage(MINIMAL_CONFIG);

    expect(meta.getTag('property="og:image"')?.content).toBe('/og-default.png');
    expect(meta.getTag('name="twitter:image"')?.content).toBe('/og-default.png');
  });

  // ── Test 7: setPage with jsonLd injects script ───────────────────────────
  it('setPage with jsonLd injects a script[type="application/ld+json"] in head', () => {
    service.setPage(FULL_CONFIG);
    const script = document.getElementById('seo-json-ld') as HTMLScriptElement | null;
    expect(script).toBeTruthy();
    expect(script!.getAttribute('type')).toBe('application/ld+json');
    const parsed = JSON.parse(script!.textContent ?? '{}');
    expect(parsed['@type']).toBe('WebPage');
  });

  // ── Test 8: second setPage without jsonLd removes the script ─────────────
  it('second setPage call without jsonLd removes the previously injected JSON-LD script', () => {
    service.setPage(FULL_CONFIG);
    expect(document.getElementById('seo-json-ld')).toBeTruthy();

    service.setPage(MINIMAL_CONFIG);
    expect(document.getElementById('seo-json-ld')).toBeNull();
  });

  // ── Test 9: setPageNotFound sets title and noindex ───────────────────────
  it('setPageNotFound sets title with suffix and sets robots to "noindex, nofollow"', () => {
    service.setPageNotFound('Service Not Found');
    const title = TestBed.inject(Title);
    expect(title.getTitle()).toBe('Service Not Found | Compufy Technology');
    expect(meta.getTag('name="robots"')?.content).toBe('noindex, nofollow');
  });

  // ── Test 10: setPage after setPageNotFound removes robots noindex ─────────
  it('setPage after setPageNotFound removes the robots noindex tag', () => {
    service.setPageNotFound('Service Not Found');
    expect(meta.getTag('name="robots"')).toBeTruthy();

    service.setPage(MINIMAL_CONFIG);
    expect(meta.getTag('name="robots"')).toBeNull();
  });

  // ── Test 11: setPage with noIndex: true sets robots ──────────────────────
  it('setPage with noIndex: true sets robots to "noindex, nofollow"', () => {
    service.setPage({ ...MINIMAL_CONFIG, noIndex: true });
    expect(meta.getTag('name="robots"')?.content).toBe('noindex, nofollow');
  });

  // ── Test 12: calling setPage twice does not produce duplicate meta tags ───
  it('calling setPage twice does not produce duplicate meta tags', () => {
    service.setPage(FULL_CONFIG);
    const countAfterFirst = document.head.querySelectorAll('meta').length;

    service.setPage({ ...FULL_CONFIG, title: 'Updated Page', description: 'Updated description.' });
    const countAfterSecond = document.head.querySelectorAll('meta').length;

    expect(countAfterSecond).toBe(countAfterFirst);
  });
});
