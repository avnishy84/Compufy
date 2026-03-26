import { FounderProfile } from '../models/founder.model';

export const CO_FOUNDER_DATA: FounderProfile = {
  name: 'Abhishek',
  title: 'Founder & Head of Client Relations',
  location: 'Kanpur, India',
  role: 'Founder, Compufy Technology',
  summary:
    'Abhishek is the founding force behind Compufy Technology, bringing 8+ years of experience ' +
    'in client management, corporate strategy, and business development. He bridges the gap between ' +
    'business goals and technical delivery — ensuring every client feels heard, valued, and confident ' +
    'in the work we do together. His people-first approach has been central to building lasting partnerships ' +
    'and growing the company from the ground up.',

  skillCategories: [
    {
      label: 'Client Relations',
      skills: ['Account Management', 'Client Onboarding', 'Stakeholder Engagement', 'Retention Strategy'],
    },
    {
      label: 'Business Strategy',
      skills: ['Market Analysis', 'Business Development', 'Partnership Building', 'Growth Planning'],
    },
    {
      label: 'Operations',
      skills: ['Project Coordination', 'Vendor Management', 'Process Optimisation', 'Team Leadership'],
    },
    {
      label: 'Communication',
      skills: ['Proposal Writing', 'Presentations', 'Negotiation', 'Cross-functional Collaboration'],
    },
  ],

  experience: [
    {
      company: 'Compufy Technology',
      title: 'Founder & Head of Client Relations',
      location: 'Kanpur, India',
      dateRange: '2023 – Present',
      highlights: [
        'Co-founded Compufy Technology and established the client engagement model from scratch.',
        'Built and maintained relationships with 20+ SME clients across India, achieving a 90%+ retention rate.',
        'Defined service packaging, pricing strategy, and go-to-market approach for the consultancy.',
        'Coordinated cross-functional delivery between engineering, design, and client stakeholders.',
      ],
    },
    {
      company: 'Corporate Solutions Pvt. Ltd.',
      title: 'Senior Business Development Manager',
      location: 'Lucknow, India',
      dateRange: '2020 – 2023',
      highlights: [
        'Led a team of 6 business development executives, exceeding annual revenue targets by 25%.',
        'Negotiated and closed enterprise contracts worth ₹2Cr+ in total contract value.',
        'Developed strategic partnerships with regional technology vendors and service providers.',
      ],
    },
    {
      company: 'Nexus Consulting Group',
      title: 'Client Relations Executive',
      location: 'Kanpur, India',
      dateRange: '2017 – 2020',
      highlights: [
        'Managed a portfolio of 30+ corporate accounts across manufacturing and retail sectors.',
        'Reduced client churn by 35% through proactive engagement and quarterly business reviews.',
        'Collaborated with delivery teams to align project outcomes with client expectations.',
      ],
    },
  ],

  education: [
    {
      degree: 'Master of Business Administration (MBA)',
      institution: 'Chhatrapati Shahu Ji Maharaj University, Kanpur',
      yearRange: '2015 – 2017',
      score: '74.20%',
    },
    {
      degree: 'Bachelor of Commerce (B.Com)',
      institution: 'University of Lucknow',
      yearRange: '2012 – 2015',
      score: '68.80%',
    },
  ],
};
