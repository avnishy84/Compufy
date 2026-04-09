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
                <h2 class="mb-1 text-2xl font-extrabold text-white sm:text-3xl">{{ founder.title }}</h2>
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
