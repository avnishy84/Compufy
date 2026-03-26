import { SeoConfig } from '../models/seo.model';

export const HOME_SEO: SeoConfig = {
  title: 'Home',
  description:
    'Compufy Technology delivers custom web applications, digital solutions, and IT consulting — engineered for performance and built to scale your business.',
  canonicalPath: '/',
  ogType: 'website',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Compufy Technology',
    url: 'https://compufy.tech',
    logo: 'https://compufy.tech/logo.png',
  },
};

export const SERVICES_SEO: SeoConfig = {
  title: 'Services',
  description:
    'Explore Compufy Technology\'s services: web development, digital solutions, and P.I.T.C. — Product IT Consulting. Tailored tech for every business need.',
  canonicalPath: '/services',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Web Development',
        url: 'https://compufy.tech/services/web-development',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Digital Solutions',
        url: 'https://compufy.tech/services/digital-solutions',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'P.I.T.C. — Product IT Consulting',
        url: 'https://compufy.tech/services/pitc',
      },
    ],
  },
};

export const CONTACT_SEO: SeoConfig = {
  title: 'Contact Us',
  description:
    'Get in touch with Compufy Technology. Whether you have a project in mind or need expert IT advice, our team is ready to help you move forward.',
  canonicalPath: '/contact',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Compufy Technology',
    url: 'https://compufy.tech/contact',
  },
};

export const WHO_WE_ARE_SEO: SeoConfig = {
  title: 'Who We Are',
  description:
    'Meet the team behind Compufy Technology. We are passionate engineers and consultants committed to building innovative, reliable technology solutions for our clients.',
  canonicalPath: '/who-we-are',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Who We Are — Compufy Technology',
    url: 'https://compufy.tech/who-we-are',
  },
};

export const CAREERS_SEO: SeoConfig = {
  title: 'Careers',
  description:
    'Join Compufy Technology and help shape the future of tech. We are hiring talented engineers, consultants, and creatives who love solving hard problems.',
  canonicalPath: '/careers',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Careers at Compufy Technology',
    url: 'https://compufy.tech/careers',
    description:
      'Explore open roles and career opportunities at Compufy Technology.',
  },
};

export const COMING_SOON_SEO: SeoConfig = {
  title: 'Coming Soon',
  description: 'Something exciting is on the way. Stay tuned for updates from Compufy Technology.',
  canonicalPath: '/coming-soon',
  noIndex: true,
};
