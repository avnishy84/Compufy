import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Lightbulb, Users, Zap, Eye, TrendingUp, LucideIconData } from 'lucide-angular';
import { FOUNDER_DATA } from '../../data/static/cto.data';
import { FounderProfile } from '../../data/models/founder.model';

interface MissionVisionCard {
  type: 'mission' | 'vision';
  heading: string;
  text: string;
  accentColor: 'brand-primary' | 'brand-accent';
}

interface CoreValue {
  label: string;
  icon: LucideIconData;
}

interface AchievementStat {
  value: string;
  label: string;
}

interface TeamMember {
  title: string;        // role title (card heading)
  name: string;
  badge: string;        // short badge label, e.g. "VP"
  initial: string;      // avatar letter
  summary: string;
  tags: string[];
  // Tailwind class fragments for this member's unique accent color
  avatarClass: string;  // border + bg + text for avatar circle
  badgeClass: string;   // border + bg + text for role badge
  tagClass: string;     // border + bg + text for tag pills
}

@Component({
  selector: 'app-who-we-are',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-surface">

      <!-- Background blobs -->
      <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand-primary/10 blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-brand-accent/10 blur-3xl"></div>
        <div class="absolute top-1/2 right-0 h-64 w-64 rounded-full bg-brand-secondary/10 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-6xl px-6 py-20">

        <!-- ── Page Hero ── -->
        <section class="mb-20 text-center">
          <span class="mb-4 inline-block rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-primary">
            Who We Are
          </span>
          <h1 class="mb-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Built by Builders,
            <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent"> For Builders</span>
          </h1>
          <p class="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400">
            Compufy Technology is a tight-knit team of engineers and consultants who care deeply about craft, collaboration, and delivering real value to every client we work with.
          </p>
        </section>

        <!-- ── Our Story ── -->
        <section class="mb-20">
          <div class="mb-8 text-center">
            <h2 class="text-2xl font-bold sm:text-3xl">
              <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                Our Story
              </span>
            </h2>
          </div>
          <p class="mx-auto max-w-3xl text-center text-lg leading-relaxed text-slate-300">
            Compufy Technology was founded with a vision to bridge the gap between innovative ideas and scalable digital solutions. What started as a passion for building meaningful software has evolved into a mission-driven team focused on delivering real business impact.
          </p>
        </section>

        <!-- ── Mission & Vision ── -->
        <section class="mb-20">
          <div class="mb-10 text-center">
            <h2 class="text-2xl font-bold sm:text-3xl">
              <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                Mission &amp; Vision
              </span>
            </h2>
          </div>
          <div class="grid gap-6 grid-cols-1 sm:grid-cols-2">
            @for (card of missionVisionCards; track card.type) {
              <div class="rounded-2xl border border-white/10 bg-surface-card p-8 transition-all duration-150 hover:border-brand-primary/40 hover:bg-surface-card/80">
                <h3 class="mb-3 text-xl font-bold text-white">{{ card.heading }}</h3>
                <p class="leading-relaxed text-slate-300">{{ card.text }}</p>
              </div>
            }
          </div>
        </section>

        <!-- ── Core Values ── -->
        <section class="mb-20">
          <div class="mb-10 text-center">
            <h2 class="text-2xl font-bold sm:text-3xl">
              <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                Core Values
              </span>
            </h2>
          </div>
          <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            @for (value of coreValues; track value.label) {
              <div class="rounded-2xl border border-white/10 bg-surface-card p-6 transition-all duration-150 hover:border-brand-primary/40 hover:bg-surface-card/80">
                <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10">
                  <lucide-icon [img]="value.icon" [size]="20" class="text-brand-primary"></lucide-icon>
                </div>
                <p class="text-base font-semibold text-white">{{ value.label }}</p>
              </div>
            }
          </div>
        </section>

        <!-- ── What Makes Us Different ── -->
        <section class="mb-20">
          <div class="mb-10 text-center">
            <h2 class="text-2xl font-bold sm:text-3xl">
              <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                What Makes Us Different
              </span>
            </h2>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            @for (item of differentiators; track item) {
              <div class="flex items-start gap-4 rounded-2xl border border-white/10 bg-surface-card p-6 transition-all duration-150 hover:border-brand-primary/40 hover:bg-surface-card/80">
                <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-xs font-bold text-brand-primary">✓</span>
                <p class="leading-relaxed text-slate-300">{{ item }}</p>
              </div>
            }
          </div>
        </section>

        <!-- ── Our Expertise ── -->
        <section class="mb-20">
          <div class="mb-10 text-center">
            <h2 class="text-2xl font-bold sm:text-3xl">
              <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                Our Expertise
              </span>
            </h2>
          </div>
          <div class="flex flex-wrap justify-center gap-3">
            @for (tag of expertiseTags; track tag) {
              <span class="rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-2 text-sm font-medium text-brand-primary">
                {{ tag }}
              </span>
            }
          </div>
        </section>

        <!-- ── Founder Card ── -->
        <section class="mb-20">
          <div class="rounded-2xl border border-white/10 bg-surface-card p-8 transition-all duration-150 hover:border-white/20 sm:p-12">
            <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">

              <!-- Avatar -->
              <div class="flex shrink-0 justify-center lg:justify-start">
                <div class="relative">
                  <div class="flex h-28 w-28 items-center justify-center rounded-full border-2 border-brand-secondary/40 bg-brand-secondary/10 text-4xl font-extrabold text-brand-secondary sm:h-36 sm:w-36 sm:text-5xl">
                    A
                  </div>
                  <span class="absolute -bottom-2 -right-2 rounded-full border border-brand-secondary/30 bg-brand-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-brand-secondary">
                    Founder
                  </span>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 text-center lg:text-left">
                <h2 class="mb-1 text-2xl font-extrabold text-white sm:text-3xl">Founder &amp; Client Relations</h2>
                <p class="mb-4 text-base font-medium text-slate-400">Abhishek</p>
                <p class="mb-6 max-w-2xl leading-relaxed text-slate-300">
                  A visionary with 8+ years in client management and corporate relationship building, Abhishek brings the strategic and interpersonal depth that turns great engineering into lasting partnerships. He bridges the gap between business goals and technical delivery — ensuring every client feels heard, valued, and confident in the work we do together.
                </p>

                <!-- Expertise badges -->
                <div class="flex flex-wrap justify-center gap-2 lg:justify-start">
                  @for (tag of coFounderExpertise; track tag) {
                    <span class="rounded-full border border-brand-secondary/20 bg-brand-secondary/10 px-3 py-1 text-sm font-medium text-brand-secondary">
                      {{ tag }}
                    </span>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── CTO Card ── -->
        <section class="mb-20">
          <div class="rounded-2xl border border-white/10 bg-surface-card p-8 transition-all duration-150 hover:border-white/20 sm:p-12">
            <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">

              <!-- Avatar -->
              <div class="flex shrink-0 justify-center lg:justify-start">
                <div class="relative">
                  <div class="flex h-28 w-28 items-center justify-center rounded-full border-2 border-brand-primary/40 bg-brand-primary/10 text-4xl font-extrabold text-brand-primary sm:h-36 sm:w-36 sm:text-5xl">
                    {{ founder.name.charAt(0) }}
                  </div>
                  <span class="absolute -bottom-2 -right-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-2.5 py-0.5 text-xs font-semibold text-brand-accent">
                    CTO
                  </span>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 text-center lg:text-left">
                <div class="mb-1 flex items-center justify-center gap-3 lg:justify-start">
                  <h2 class="text-2xl font-extrabold text-white sm:text-3xl">{{ founder.title }}</h2>
                  @if (founder.linkedInUrl) {
                    <a
                      [href]="founder.linkedInUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      [attr.aria-label]="founder.name + ' on LinkedIn'"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-all duration-150 hover:border-white/20 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                      </svg>
                    </a>
                  }
                </div>
                <p class="mb-4 text-base font-medium text-slate-400">{{ founder.name }}</p>
                <p class="mb-6 max-w-2xl leading-relaxed text-slate-300">{{ founder.summary }}</p>

                <!-- Expertise badges -->
                <div class="flex flex-wrap justify-center gap-2 lg:justify-start">
                  @for (category of founder.skillCategories; track category.label) {
                    <span class="rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-1 text-sm font-medium text-brand-primary">
                      {{ category.label }}
                    </span>
                  } @empty {
                    <span class="text-sm text-slate-400">No expertise areas listed.</span>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Additional Team Members ── -->
        @for (member of teamMembers; track member.name) {
          <section class="mb-20">
            <div class="rounded-2xl border border-white/10 bg-surface-card p-8 transition-all duration-150 hover:border-white/20 sm:p-12">
              <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">

                <!-- Avatar -->
                <div class="flex shrink-0 justify-center lg:justify-start">
                  <div class="relative">
                    <div class="flex h-28 w-28 items-center justify-center rounded-full border-2 text-4xl font-extrabold sm:h-36 sm:w-36 sm:text-5xl" [class]="member.avatarClass">
                      {{ member.initial }}
                    </div>
                    <span class="absolute -bottom-2 -right-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold" [class]="member.badgeClass">
                      {{ member.badge }}
                    </span>
                  </div>
                </div>

                <!-- Info -->
                <div class="flex-1 text-center lg:text-left">
                  <h2 class="mb-1 text-2xl font-extrabold text-white sm:text-3xl">{{ member.title }}</h2>
                  <p class="mb-4 text-base font-medium text-slate-400">{{ member.name }}</p>
                  <p class="mb-6 max-w-2xl leading-relaxed text-slate-300">{{ member.summary }}</p>

                  <!-- Expertise badges -->
                  <div class="flex flex-wrap justify-center gap-2 lg:justify-start">
                    @for (tag of member.tags; track tag) {
                      <span class="rounded-full border px-3 py-1 text-sm font-medium" [class]="member.tagClass">
                        {{ tag }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </section>
        }

        <!-- ── The Team With Us ── -->
        <section class="mb-20">
          <div class="mx-auto max-w-[700px] rounded-2xl border border-white/5 bg-surface-card/50 px-8 py-10 text-center">
            <div class="mx-auto mb-5 h-px w-16 rounded-full bg-gradient-to-r from-brand-secondary to-brand-accent"></div>
            <h3 class="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-300">The Team With Us</h3>
            <p class="leading-relaxed text-slate-400">
              Behind every delivery is a dedicated group of engineers, designers, testers and support specialists who work quietly behind the scenes. Their craft, care and consistency power the growth of Compufy's partners, one successful project at a time.
            </p>
          </div>
        </section>

        <!-- ── How We Work ── -->
        <section class="mb-20">
          <div class="mb-10 text-center">
            <h2 class="text-2xl font-bold sm:text-3xl">
              <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                How We Work
              </span>
            </h2>
            <p class="mt-3 text-slate-400">Collaboration is at the core of everything we do.</p>
          </div>

          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (value of teamValues; track value.title) {
              <div class="rounded-2xl border border-white/10 bg-surface-card p-6">
                <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-xl">
                  {{ value.icon }}
                </div>
                <h3 class="mb-2 text-base font-bold text-white">{{ value.title }}</h3>
                <p class="text-sm leading-relaxed text-slate-400">{{ value.description }}</p>
              </div>
            }
          </div>
        </section>

        <!-- ── Team Philosophy ── -->
        <section class="mb-20">
          <div class="mb-8 text-center">
            <h2 class="text-2xl font-bold sm:text-3xl">
              <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                Team Philosophy
              </span>
            </h2>
          </div>
          <div class="rounded-2xl border-l-4 border-brand-accent bg-brand-accent/5 px-8 py-8">
            <p class="mx-auto max-w-3xl text-center text-lg italic leading-relaxed text-slate-300">
              "We believe great products come from collaboration, curiosity, and continuous learning. At Compufy, we don't just build software — we solve problems."
            </p>
          </div>
        </section>

        <!-- ── Achievements ── -->
        <section class="mb-20">
          <div class="mb-10 text-center">
            <h2 class="text-2xl font-bold sm:text-3xl">
              <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                Achievements
              </span>
            </h2>
          </div>
          <div class="grid gap-6 grid-cols-2 lg:grid-cols-4">
            @for (stat of achievements; track stat.label) {
              <div class="rounded-2xl border border-white/10 bg-surface-card p-6 text-center transition-all duration-150 hover:border-brand-primary/40 hover:bg-surface-card/80">
                <p class="mb-1 text-3xl font-extrabold text-white">{{ stat.value }}</p>
                <p class="text-sm text-slate-400">{{ stat.label }}</p>
              </div>
            }
          </div>
        </section>

        <!-- ── CTA ── -->
        <section class="text-center">
          <div class="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 px-8 py-12">
            <h2 class="mb-6 text-2xl font-bold text-white sm:text-3xl">Have an idea? Let's build it together.</h2>
            <a
              routerLink="/contact"
              class="inline-block rounded-xl bg-brand-primary px-8 py-3 text-sm font-semibold text-white transition-all duration-150 hover:opacity-90"
            >
              Contact Us
            </a>
          </div>
        </section>

      </div>
    </main>
  `,
})
export class WhoWeAreComponent {
  readonly founder: FounderProfile = FOUNDER_DATA;

  readonly missionVisionCards: MissionVisionCard[] = [
    {
      type: 'mission',
      heading: 'Our Mission',
      text: 'To build scalable, efficient, and future-ready technology solutions that empower businesses.',
      accentColor: 'brand-primary',
    },
    {
      type: 'vision',
      heading: 'Our Vision',
      text: 'To become a trusted technology partner for startups and enterprises globally.',
      accentColor: 'brand-accent',
    },
  ];

  readonly coreValues: CoreValue[] = [
    { label: 'Innovation First',        icon: Lightbulb  },
    { label: 'Client-Centric Approach', icon: Users      },
    { label: 'Performance & Quality',   icon: Zap        },
    { label: 'Transparency',            icon: Eye        },
    { label: 'Continuous Growth',       icon: TrendingUp },
  ];

  readonly differentiators: string[] = [
    'Focus on real-world scalable solutions',
    'Strong blend of business and technology thinking',
    'Fast execution with startup mindset',
    'Clean, maintainable, future-proof architecture',
  ];

  readonly expertiseTags: string[] = [
    'Full Stack Development',
    'Cloud & DevOps',
    'AI & Automation',
    'System Design & Architecture',
    'Performance Optimization',
  ];

  readonly achievements: AchievementStat[] = [
    { value: '50+', label: 'Projects Delivered'  },
    { value: '30+', label: 'Technologies Used'   },
    { value: '40+', label: 'Happy Clients'       },
    { value: '5+',  label: 'Years of Experience' },
  ];

  readonly teamMembers: TeamMember[] = [
    {
      title: 'Senior Project Manager & Vice President',
      name: 'David Grace',
      badge: 'VP',
      initial: 'D',
      summary:
        'David Grace is Senior Project Manager and Vice President of the firm, with excellent experience ' +
        'across both software development and project management. He bridges delivery and engineering, ' +
        'keeping projects on scope, on schedule, and tightly aligned with client goals.',
      tags: [
        'Project Management',
        'Delivery Leadership',
        'Software Development',
        'Agile Delivery',
        'Risk & Scope Management',
        'Team Coordination',
      ],
      avatarClass: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400',
      badgeClass: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400',
      tagClass: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-400',
    },
    {
      title: 'AI & AI Agents Expert',
      name: 'Stephen Durnin',
      badge: 'AI',
      initial: 'S',
      summary:
        'Stephen Durnin specializes in AI and AI agents, designing, building, and deploying intelligent, ' +
        'agent-driven solutions. He automates complex workflows and brings practical, production-ready AI ' +
        'into client products.',
      tags: ['AI Agents', 'Agentic Workflows', 'LLM Applications', 'AI Strategy', 'Automation'],
      avatarClass: 'border-amber-400/40 bg-amber-400/10 text-amber-400',
      badgeClass: 'border-amber-400/30 bg-amber-400/10 text-amber-400',
      tagClass: 'border-amber-400/20 bg-amber-400/10 text-amber-400',
    },
    {
      title: 'Training & Emerging Technology Lead',
      name: 'Anton Martyniuk',
      badge: 'Training',
      initial: 'A',
      summary:
        'Anton Martyniuk is a Software Architect and Microsoft MVP, and the founder of AntonDevTips — a ' +
        'platform that helps .NET developers reach Senior and Architect level. He leads training and ' +
        'emerging-technology management so the team and clients stay ahead on .NET and new technology.',
      tags: ['.NET', 'Software Architecture', 'Developer Training', 'Emerging Tech', 'Microsoft MVP'],
      avatarClass: 'border-rose-400/40 bg-rose-400/10 text-rose-400',
      badgeClass: 'border-rose-400/30 bg-rose-400/10 text-rose-400',
      tagClass: 'border-rose-400/20 bg-rose-400/10 text-rose-400',
    },
  ];

  readonly coFounderExpertise = [
    'Client Management',
    'Corporate Relations',
    'Business Strategy',
    'Stakeholder Engagement',
    'Partnership Development',
  ];

  readonly teamValues = [
    {
      icon: '🤝',
      title: 'Client-First Mindset',
      description: 'We treat every client engagement as a partnership. Your goals drive our decisions from day one.',
    },
    {
      icon: '🔍',
      title: 'Deep Technical Expertise',
      description: 'From architecture to deployment, we bring hands-on experience across the full stack to every project.',
    },
    {
      icon: '🔄',
      title: 'Iterative Delivery',
      description: 'We ship in short cycles, gather feedback early, and adapt quickly — so you always know where things stand.',
    },
    {
      icon: '💬',
      title: 'Transparent Communication',
      description: 'No black boxes. We keep you in the loop with clear updates, honest timelines, and open conversations.',
    },
    {
      icon: '⚡',
      title: 'Speed Without Compromise',
      description: 'We move fast but never cut corners on quality, security, or maintainability.',
    },
    {
      icon: '🌱',
      title: 'Long-Term Thinking',
      description: 'We build solutions that scale with your business, not just ones that solve today\'s problem.',
    },
  ];
}
