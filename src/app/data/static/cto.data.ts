import { FounderProfile } from '../models/founder.model';

export const FOUNDER_DATA: FounderProfile = {
  name: 'Avnish Yadav',
  title: 'Chief Technology Officer',
  location: 'India',
  role: 'CTO, Compufy Technology',
  summary:
    'Avnish Yadav is a full-stack software engineer with extensive experience ' +
    'designing and delivering scalable standalone software, web applications, cloud-native solutions, and ' +
    'enterprise integrations. As CTO of Compufy Technology, he leads the technical vision and ' +
    'engineering execution — ensuring every product is built for performance, reliability, and scale.',

  skillCategories: [
    {
      label: 'Languages',
      skills: ['TypeScript', 'JavaScript', 'Python', 'C#', 'SQL', 'HTML5', 'CSS3'],
    },
    {
      label: 'Frameworks',
      skills: ['Angular', 'React', 'Node.js', 'Express', 'ASP.NET Core', 'NestJS'],
    },
    {
      label: 'Databases',
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase Firestore', 'Redis'],
    },
    {
      label: 'Cloud / DevOps',
      skills: ['Google Cloud Platform', 'Firebase', 'Docker', 'GitHub Actions', 'Nginx'],
    },
    {
      label: 'Tools',
      skills: ['Git', 'VS Code', 'Postman', 'Figma', 'Jira', 'Linux'],
    },
  ],

  experience: [
    {
      company: 'Compufy Technology',
      title: 'Founder & Lead Engineer',
      location: 'India (Remote)',
      dateRange: '2023 – Present',
      highlights: [
        'Founded and bootstrapped a technology consultancy delivering full-stack web and cloud solutions to SME clients.',
        'Architected Angular 18 + Firebase SSR platform serving multiple client marketing sites with sub-second TTFB.',
        'Established CI/CD pipelines using GitHub Actions and Google Cloud Run, reducing deployment time by 70%.',
        'Led end-to-end product delivery from requirements gathering through production release for 10+ projects.',
      ],
    },
    {
      company: 'TechNova Solutions',
      title: 'Senior Software Engineer',
      location: 'Pune, India',
      dateRange: '2021 – 2023',
      highlights: [
        'Developed and maintained enterprise Angular applications consumed by 50,000+ daily active users.',
        'Migrated legacy REST APIs to GraphQL, cutting average payload size by 40%.',
        'Mentored a team of 4 junior engineers through code reviews, pair programming, and technical workshops.',
        'Integrated third-party payment gateways (Razorpay, Stripe) and reduced checkout drop-off by 18%.',
      ],
    },
    {
      company: 'Infosys Limited',
      title: 'Software Engineer',
      location: 'Bengaluru, India',
      dateRange: '2019 – 2021',
      highlights: [
        'Built RESTful microservices in ASP.NET Core for a global banking client, handling 2M+ transactions per day.',
        'Implemented automated unit and integration test suites achieving 85% code coverage.',
        'Collaborated with cross-functional teams across India and the UK in an Agile/Scrum environment.',
      ],
    },
  ],

  education: [
    {
      degree: 'Master of Computer Applications (MCA)',
      institution: 'Symbiosis Institute of Computer Studies and Research, Pune',
      yearRange: '2017 – 2019',
      score: '78.40%',
    },
    {
      degree: 'Bachelor of Science in Computer Science (B.Sc. CS)',
      institution: 'University of Mumbai',
      yearRange: '2014 – 2017',
      score: '72.60%',
    },
  ],
};
