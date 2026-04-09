import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  schema?: object;
}

const BASE_URL = 'https://compufytech.web.app';

const PAGE_SEO: Record<string, SeoConfig> = {
  '/': {
    title: 'Compufy Technology — Software Company in Kanpur',
    description: 'Top software company in Kanpur, UP. Web, mobile & cloud solutions built to scale. Get a free consultation today.',
    keywords: 'software company in Kanpur, IT company Kanpur, web development Kanpur, digital solutions Kanpur, tech startup UP',
    canonical: `${BASE_URL}/`,
    schema: {
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
    keywords: 'web development services Kanpur, mobile app development UP, Angular development, cloud solutions India, custom software Kanpur',
    canonical: `${BASE_URL}/services`,
    schema: {
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
    keywords: 'IT company Kanpur, tech team Kanpur UP, software engineers Kanpur, startup Kanpur, about us',
    canonical: `${BASE_URL}/who-we-are`,
    schema: {
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
    keywords: 'hire software developer Kanpur, IT consulting Kanpur, contact tech company UP, get a quote Kanpur',
    canonical: `${BASE_URL}/contact`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Compufy Technology',
      url: `${BASE_URL}/contact`,
    },
  },
  '/careers': {
    title: 'Careers at Compufy Technology — Kanpur',
    description: 'Join Compufy Technology in Kanpur. Open roles for Angular, cloud & mobile developers. Build great products. Apply today.',
    keywords: 'software jobs Kanpur, developer jobs UP, tech careers Kanpur, Angular developer jobs, IT jobs Uttar Pradesh',
    canonical: `${BASE_URL}/careers`,
  },
  '/ai-approach': {
    title: 'AI-Powered Development — Compufy Technology',
    description: "Compufy Technology's AI-first approach to software in Kanpur. Smarter, faster, scalable digital products for modern businesses.",
    keywords: 'AI development Kanpur, AI consulting India, machine learning solutions UP, AI-powered software Kanpur',
    canonical: `${BASE_URL}/ai-approach`,
  },
};

// BreadcrumbList schema per route
const BREADCRUMBS: Record<string, Array<{ name: string; url: string }>> = {
  '/services':    [{ name: 'Home', url: BASE_URL }, { name: 'Services', url: `${BASE_URL}/services` }],
  '/who-we-are':  [{ name: 'Home', url: BASE_URL }, { name: 'Who We Are', url: `${BASE_URL}/who-we-are` }],
  '/contact':     [{ name: 'Home', url: BASE_URL }, { name: 'Contact', url: `${BASE_URL}/contact` }],
  '/careers':     [{ name: 'Home', url: BASE_URL }, { name: 'Careers', url: `${BASE_URL}/careers` }],
  '/ai-approach': [{ name: 'Home', url: BASE_URL }, { name: 'AI Approach', url: `${BASE_URL}/ai-approach` }],
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  init(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e) => {
      const url = (e as NavigationEnd).urlAfterRedirects.split('?')[0];
      const config = PAGE_SEO[url] ?? PAGE_SEO['/'];
      this.apply(url, config);
    });
  }

  private apply(url: string, config: SeoConfig): void {
    this.title.setTitle(config.title);

    this.meta.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: config.ogTitle ?? config.title });
    this.meta.updateTag({ property: 'og:description', content: config.ogDescription ?? config.description });
    this.meta.updateTag({ property: 'og:url', content: config.canonical ?? `${BASE_URL}${url}` });

    // Canonical
    this.setCanonical(config.canonical ?? `${BASE_URL}${url}`);

    // Structured data: page schema + breadcrumb
    this.setStructuredData(url, config.schema);
  }

  private setCanonical(url: string): void {
    if (!this.isBrowser) return;
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setStructuredData(url: string, pageSchema?: object): void {
    if (!this.isBrowser) return;
    // Remove previous injected schemas
    this.doc.querySelectorAll('script[data-seo="true"]').forEach(s => s.remove());

    const schemas: object[] = [];

    if (pageSchema) schemas.push(pageSchema);

    // BreadcrumbList
    const crumbs = BREADCRUMBS[url];
    if (crumbs) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: c.url,
        })),
      });
    }

    schemas.forEach(schema => {
      const script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'true');
      script.textContent = JSON.stringify(schema);
      this.doc.head.appendChild(script);
    });
  }
}
