import { ServiceCategory } from '../models/service.model';

export const SERVICES_DATA: ServiceCategory[] = [
  {
    id: 'web-development',
    label: 'Web Development',
    services: [
      {
        id: 'web-1',
        title: 'Custom Web Applications',
        description: 'Tailor-made web applications built with modern frameworks, designed to scale with your business needs.',
        iconName: 'code-2',
        category: 'web-development',
      },
      {
        id: 'web-2',
        title: 'Responsive Website Design',
        description: 'Pixel-perfect, mobile-first websites that deliver a seamless experience across all devices and screen sizes.',
        iconName: 'layout-dashboard',
        category: 'web-development',
      },
      {
        id: 'web-3',
        title: 'Web App Development',
        description: 'Fast, offline-capable web apps with rich interactivity — installable on any device without an app store.',
        iconName: 'monitor',
        category: 'web-development',
      },
      {
        id: 'web-3b',
        title: 'Mobile App — Android & iOS',
        description: 'Cross-platform native mobile apps for Android and iOS, built for performance, smooth UX, and app store distribution.',
        iconName: 'smartphone',
        category: 'web-development',
      },
      {
        id: 'web-3c',
        title: 'Windows Desktop App',
        description: 'Modern Windows desktop applications with native OS integration, offline support, and enterprise-grade reliability.',
        iconName: 'app-window',
        category: 'web-development',
      },
      {
        id: 'web-4',
        title: 'API Development & Integration',
        description: 'Robust RESTful and GraphQL APIs that connect your services, third-party platforms, and data sources seamlessly.',
        iconName: 'globe',
        category: 'web-development',
      },
    ],
  },
  {
    id: 'digital-solutions',
    label: 'Digital Solutions',
    services: [
      {
        id: 'ds-1',
        title: 'SEO & Digital Marketing',
        description: 'Data-driven SEO strategies and digital marketing campaigns that increase visibility and drive qualified traffic.',
        iconName: 'search',
        category: 'digital-solutions',
      },
      {
        id: 'ds-2',
        title: 'Analytics & Business Intelligence',
        description: 'Turn raw data into actionable insights with custom dashboards, reporting pipelines, and BI integrations.',
        iconName: 'bar-chart',
        category: 'digital-solutions',
      },
      {
        id: 'ds-3',
        title: 'Cloud Infrastructure & DevOps',
        description: 'Scalable cloud architecture, CI/CD pipelines, and infrastructure-as-code to keep your deployments fast and reliable.',
        iconName: 'settings',
        category: 'digital-solutions',
      },
      {
        id: 'ds-4',
        title: 'Cybersecurity & Compliance',
        description: 'Comprehensive security audits, vulnerability assessments, and compliance frameworks to protect your digital assets.',
        iconName: 'shield',
        category: 'digital-solutions',
      },
    ],
  },
  {
    id: 'pitc',
    label: 'P.I.T.C. — Product IT Consulting',
    services: [
      {
        id: 'pitc-1',
        title: 'IT Strategy Consulting',
        description: 'Expert guidance on aligning your technology roadmap with business objectives for sustainable growth.',
        iconName: 'users',
        category: 'pitc',
      },
      {
        id: 'pitc-2',
        title: 'Digital Transformation',
        description: 'End-to-end transformation programs that modernize legacy systems and embed digital capabilities across your organization.',
        iconName: 'globe',
        category: 'pitc',
      },
      {
        id: 'pitc-3',
        title: 'Technology Audits & Reviews',
        description: 'In-depth assessments of your existing tech stack, processes, and team capabilities with clear improvement recommendations.',
        iconName: 'bar-chart',
        category: 'pitc',
      },
      {
        id: 'pitc-4',
        title: 'Vendor & Platform Selection',
        description: 'Impartial evaluation and selection of software vendors, cloud platforms, and tooling that best fit your requirements.',
        iconName: 'settings',
        category: 'pitc',
      },
    ],
  },
];
