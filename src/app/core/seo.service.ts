import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';
import { SeoConfig } from '../data/models/seo.model';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly siteUrl: string;

  private static readonly SITE_NAME = 'Compufy Technology';
  private static readonly DEFAULT_IMAGE = '/og-default.png';
  private static readonly JSON_LD_ID = 'seo-json-ld';
  private static readonly CANONICAL_ID = 'seo-canonical';

  constructor() {
    const url = (environment as Record<string, unknown>)['siteUrl'];
    if (typeof url !== 'string' || !url) {
      console.warn('[SeoService] environment.siteUrl is not defined; canonical URLs will be relative.');
      this.siteUrl = '';
    } else {
      this.siteUrl = url;
    }
  }

  setPage(config: SeoConfig): void {
    this.removeRobotsNoIndex();

    // Title
    this.titleService.setTitle(`${config.title} | ${SeoService.SITE_NAME}`);

    const ogImage = config.ogImage ?? SeoService.DEFAULT_IMAGE;
    const ogType = config.ogType ?? 'website';
    const canonicalUrl = this.siteUrl + config.canonicalPath;

    // Meta description
    this.meta.updateTag({ name: 'description', content: config.description });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:type', content: ogType });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:site_name', content: SeoService.SITE_NAME });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });

    // Canonical
    this.upsertCanonical(canonicalUrl);

    // JSON-LD
    if (config.jsonLd) {
      this.upsertJsonLd(config.jsonLd);
    } else {
      this.removeJsonLd();
    }

    // noIndex flag
    if (config.noIndex) {
      this.upsertRobotsNoIndex();
    }
  }

  setPageNotFound(label: string): void {
    this.titleService.setTitle(`${label} | ${SeoService.SITE_NAME}`);
    this.upsertRobotsNoIndex();
  }

  private upsertCanonical(href: string): void {
    let link = this.doc.getElementById(SeoService.CANONICAL_ID) as HTMLLinkElement | null;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('id', SeoService.CANONICAL_ID);
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private upsertJsonLd(payload: Record<string, unknown>): void {
    try {
      const json = JSON.stringify(payload);
      let script = this.doc.getElementById(SeoService.JSON_LD_ID) as HTMLScriptElement | null;
      if (!script) {
        script = this.doc.createElement('script');
        script.setAttribute('id', SeoService.JSON_LD_ID);
        script.setAttribute('type', 'application/ld+json');
        this.doc.head.appendChild(script);
      }
      script.textContent = json;
    } catch (e) {
      console.error('[SeoService] Failed to serialise JSON-LD payload', e);
    }
  }

  private removeJsonLd(): void {
    const script = this.doc.getElementById(SeoService.JSON_LD_ID);
    script?.parentNode?.removeChild(script);
  }

  private upsertRobotsNoIndex(): void {
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  private removeRobotsNoIndex(): void {
    this.meta.removeTag('name="robots"');
  }
}
