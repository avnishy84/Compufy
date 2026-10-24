import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { SeoConfig } from '../data/models/seo.model';

const SITE_NAME = 'Compufy Technology';
const BASE_URL  = 'https://compufytech.web.app';
const DEFAULT_OG_IMAGE = '/og-default.png';

const PAGE_SEO: Record<string, SeoConfig> = {
  '/': {
    title: 'Compufy Technology — Software Company in Kanpur',
    description: 'Top software company in Kanpur, UP. Web, mobile & cloud solutions built to scale. Get a free consultation today.',
    canonicalPath: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Compufy Technology',
      url: BASE_URL,
      logo: `${BASE_URL}/favicon.webp`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kanpur',
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'compufykanpur@gmail.com',
        contactType: 'customer service',
      },
      sameAs: [],
    },
  },
  '/services': {
    title: 'Web & Mobile App Development Services — Kanpur',
    description: 'Custom web, mobile & cloud development services in Kanpur. Angular, React Native & AWS experts. Get a quote today.',
    canonicalPath: '/services',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Software Development Services',
      provider: {
        '@type': 'Organization',
        name: 'Compufy Technology',
        address: { '@type': 'PostalAddress', addressLocality: 'Kanpur', addressRegion: 'Uttar Pradesh' },
      },
      areaServed: { '@type': 'City', name: 'Kanpur' },
      serviceType: ['Web Development', 'Mobile App Development', 'Cloud Solutions', 'Digital Marketing'],
    },
  },
  '/who-we-are': {
    title: 'About Compufy Technology — IT Firm in Kanpur',
    description: 'Meet the Kanpur-based team behind Compufy Technology. Engineering modern digital solutions for businesses across India.',
    canonicalPath: '/who-we-are',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Compufy Technology',
      url: `${BASE_URL}/who-we-are`,
      description: 'Kanpur-based software engineering firm specializing in web, mobile and cloud solutions.',
    },
  },
  '/contact': {
    title: 'Contact Compufy Technology — Kanpur, UP',
    description: 'Reach Compufy Technology in Kanpur, UP. Get a free project quote for web, mobile or cloud development. We respond within 24h.',
    canonicalPath: '/contact',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Compufy Technology',
      url: `${BASE_URL}/contact`,
    },
  },
  '/careers': {
    title: 'Careers at Compufy Technology — Kanpur',
    description: 'Join Compufy Technology in Kanpur. Open roles for Angular, cloud & mobile developers. Build great products. Apply today.',
    canonicalPath: '/careers',
  },
  '/ai-approach': {
    title: 'AI-Powered Development — Compufy Technology',
    description: "Compufy Technology's AI-first approach to software in Kanpur. Smarter, faster, scalable digital products for modern businesses.",
    canonicalPath: '/ai-approach',
  },
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleSvc = inject(Title);
  private readonly meta     = inject(Meta);
  private readonly router   = inject(Router);
  private readonly doc      = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ── Router-driven init (used by AppComponent) ──────────────────────────────

  init(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e) => {
      const url = (e as NavigationEnd).urlAfterRedirects.split('?')[0];
      const config = PAGE_SEO[url] ?? PAGE_SEO['/'];
      this.setPage(config);
    });
  }

  // ── Public imperative API (used directly by components & specs) ─────────────

  /**
   * Apply a full SEO configuration to the current page.
   * Sets title, meta description, OG tags, Twitter Card tags, canonical link,
   * robots tag, and optional JSON-LD structured data.
   */
  setPage(config: SeoConfig): void {
    // Title
    this.titleSvc.setTitle(`${config.title} | ${SITE_NAME}`);

    // Meta description
    this.meta.updateTag({ name: 'description', content: config.description });

    // Robots — remove any previous noindex, then set if needed
    this.meta.removeTag('name="robots"');
    if (config.noIndex) {
      this.meta.addTag({ name: 'robots', content: 'noindex, nofollow' });
    }

    const ogImage = config.ogImage ?? DEFAULT_OG_IMAGE;
    const ogType  = config.ogType  ?? 'website';
    const canonicalUrl = `${BASE_URL}${config.canonicalPath}`;

    // Open Graph
    this.meta.updateTag({ property: 'og:title',       content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:type',        content: ogType });
    this.meta.updateTag({ property: 'og:image',       content: ogImage });
    this.meta.updateTag({ property: 'og:url',         content: canonicalUrl });
    this.meta.updateTag({ property: 'og:site_name',   content: SITE_NAME });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card',        content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title',       content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image',       content: ogImage });

    // Canonical link element
    this.setCanonical(canonicalUrl);

    // JSON-LD structured data
    this.setJsonLd(config.jsonLd);
  }

  /**
   * Set a 404-style page: title with suffix + noindex robots tag.
   * Clears any JSON-LD and canonical link.
   */
  setPageNotFound(label: string): void {
    this.titleSvc.setTitle(`${label} | ${SITE_NAME}`);
    this.meta.removeTag('name="robots"');
    this.meta.addTag({ name: 'robots', content: 'noindex, nofollow' });
    // Clear canonical & JSON-LD for 404 pages
    this.doc.getElementById('seo-canonical')?.remove();
    this.setJsonLd(undefined);
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private setCanonical(url: string): void {
    let link = this.doc.getElementById('seo-canonical') as HTMLLinkElement | null;
    if (!link) {
      link = this.doc.createElement('link');
      link.id = 'seo-canonical';
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(schema: Record<string, unknown> | undefined): void {
    // Remove any previously injected JSON-LD script
    this.doc.getElementById('seo-json-ld')?.remove();

    if (!schema) return;

    const script = this.doc.createElement('script');
    script.id   = 'seo-json-ld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    this.doc.head.appendChild(script);
  }
}
