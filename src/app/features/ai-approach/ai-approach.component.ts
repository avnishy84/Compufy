import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

interface AiPillar {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

interface WorkflowStep {
  step: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-ai-approach',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-surface">

      <!-- Background blobs -->
      <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-brand-primary/10 blur-3xl"></div>
        <div class="absolute top-1/2 right-0 h-80 w-80 rounded-full bg-brand-accent/10 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-brand-secondary/10 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-6xl px-6 py-20">

        <!-- ── Hero ── -->
        <section class="relative mb-20 overflow-hidden rounded-3xl border border-white/10 bg-surface-card text-center" style="min-height:340px;">
          <!-- Neural network canvas — fills the entire hero card -->
          <canvas #neuralCanvas style="position:absolute;top:0;left:0;width:100%;height:100%;" aria-hidden="true"></canvas>

          <!-- Content sits above the canvas -->
          <div class="relative z-10 px-8 py-20">
            <span class="mb-4 inline-block rounded-full border border-brand-accent/30 bg-brand-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-accent">
              AI-Powered Engineering
            </span>
            <h1 class="mb-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              How We Use AI to
              <span class="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent"> Build Better</span>
            </h1>
            <p class="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400">
              At Compufy Technology, AI and neural network agents aren't a buzzword — they're embedded into how we design, build, test, and deliver software every day. Here's exactly how.
            </p>
          </div>
        </section>

        <!-- ── Core Pillars ── -->
        <section class="mb-20">
          <div class="mb-10 text-center">
            <h2 class="text-2xl font-bold text-white sm:text-3xl">
              Our AI Pillars
            </h2>
            <p class="mt-3 text-slate-400">The four areas where AI directly improves what we ship.</p>
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            @for (pillar of pillars; track pillar.title) {
              <div class="rounded-2xl border border-white/10 bg-surface-card p-7 transition-colors hover:border-brand-accent/30">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent/10 text-2xl">
                  {{ pillar.icon }}
                </div>
                <h3 class="mb-2 text-lg font-bold text-white">{{ pillar.title }}</h3>
                <p class="mb-4 text-sm leading-relaxed text-slate-400">{{ pillar.description }}</p>
                <div class="flex flex-wrap gap-2">
                  @for (tag of pillar.tags; track tag) {
                    <span class="rounded-full border border-brand-accent/20 bg-brand-accent/5 px-2.5 py-0.5 text-xs font-medium text-brand-accent">
                      {{ tag }}
                    </span>
                  }
                </div>
              </div>
            }
          </div>
        </section>

        <!-- ── AI-Augmented Workflow ── -->
        <section class="mb-20">
          <div class="mb-10 text-center">
            <h2 class="text-2xl font-bold text-white sm:text-3xl">
              Our AI-Augmented Workflow
            </h2>
            <p class="mt-3 text-slate-400">Every phase of delivery is touched by intelligent tooling.</p>
          </div>

          <!-- Neural-link flow — SVG connector + step cards -->
          <div class="relative">

            <!-- SVG lines drawn between step nodes — desktop only -->
            <svg class="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" aria-hidden="true">
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stop-color="#22d3ee" stop-opacity="0.7"/>
                  <stop offset="100%" stop-color="#6366f1" stop-opacity="0.3"/>
                </linearGradient>
                <!-- Animated signal dot travelling down the line -->
                <circle id="sig" r="5" fill="#6366f1"/>
              </defs>

              <!-- Central spine: x=50%, from top node to bottom node -->
              <line x1="50%" y1="40" x2="50%" y2="calc(100% - 40px)"
                    stroke="url(#flowGrad)" stroke-width="1.5" stroke-dasharray="6 4">
                <animate attributeName="stroke-dashoffset" from="0" to="-20"
                         dur="1.2s" repeatCount="indefinite"/>
              </line>

              <!-- Animated pulse travelling down the spine -->
              <circle r="5" fill="#22d3ee" opacity="0.9">
                <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#spinePathDef"/>
                </animateMotion>
              </circle>
            </svg>

            <!-- Hidden path for animateMotion reference -->
            <svg class="absolute" style="width:0;height:0;overflow:hidden" aria-hidden="true">
              <path id="spinePathDef" d="M 0 0 L 0 1000"/>
            </svg>

            <div class="flex flex-col gap-0">
              @for (step of workflowSteps; track step.step; let i = $index; let last = $last) {
                <!-- Step card -->
                <div class="relative flex items-start gap-6 lg:gap-0">

                  <!-- Left half (odd) / Right half (even) on desktop -->
                  <div [class]="i % 2 === 0
                    ? 'lg:w-1/2 lg:pr-16 lg:text-right w-full'
                    : 'lg:w-1/2 lg:pl-16 lg:ml-auto w-full'">
                    <div class="rounded-2xl border border-white/10 bg-surface-card p-6 transition-all duration-300 hover:border-brand-accent/40 hover:shadow-[0_0_24px_rgba(34,211,238,0.08)]">
                      <div [class]="i % 2 === 0
                        ? 'flex items-center gap-3 mb-3 lg:flex-row-reverse'
                        : 'flex items-center gap-3 mb-3'">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-accent/40 bg-brand-accent/10 text-xs font-bold text-brand-accent">
                          {{ step.step }}
                        </div>
                        <h3 class="text-base font-bold text-white">{{ step.title }}</h3>
                      </div>
                      <p class="text-sm leading-relaxed text-slate-400">{{ step.description }}</p>
                    </div>
                  </div>

                  <!-- Centre node dot (desktop) -->
                  <div class="absolute left-1/2 top-8 hidden -translate-x-1/2 lg:flex flex-col items-center">
                    <div class="relative flex h-5 w-5 items-center justify-center">
                      <!-- Outer pulse ring -->
                      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-30"></span>
                      <span class="relative inline-flex h-3 w-3 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                    </div>
                  </div>

                </div>

                <!-- Connector between steps (not after last) -->
                @if (!last) {
                  <div class="relative my-0 flex justify-center lg:h-12">
                    <!-- Glowing vertical connector line -->
                    <div class="w-px bg-gradient-to-b from-brand-accent/60 to-brand-primary/30 lg:h-full h-8 relative overflow-hidden">
                      <!-- Travelling signal -->
                      <div class="absolute top-0 left-0 w-full h-3 bg-gradient-to-b from-brand-accent to-transparent rounded-full"
                           style="animation: slideDown 1.8s ease-in-out infinite; animation-delay: {{ i * 0.36 }}s">
                      </div>
                    </div>
                  </div>
                }
              }
            </div>
          </div>
        </section>

        <!-- ── Neural Network Agents ── -->
        <section class="mb-20">
          <div class="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-8 sm:p-12">
            <div class="mb-8 text-center">
              <h2 class="text-2xl font-bold text-white sm:text-3xl">Neural Network Agents in Practice</h2>
              <p class="mt-3 text-slate-400 max-w-2xl mx-auto">
                We deploy specialised AI agents that operate autonomously within our development pipeline — each trained or prompted for a specific role.
              </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-3">
              @for (agent of agents; track agent.name) {
                <div class="rounded-xl border border-white/10 bg-surface-card p-5">
                  <p class="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-primary">{{ agent.role }}</p>
                  <h4 class="mb-2 text-base font-bold text-white">{{ agent.name }}</h4>
                  <p class="text-sm leading-relaxed text-slate-400">{{ agent.description }}</p>
                </div>
              }
            </div>
          </div>
        </section>

        <!-- ── Outcomes ── -->
        <section class="mb-20">
          <div class="mb-10 text-center">
            <h2 class="text-2xl font-bold text-white sm:text-3xl">What This Means for You</h2>
            <p class="mt-3 text-slate-400">Tangible outcomes our clients experience.</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @for (outcome of outcomes; track outcome.label) {
              <div class="rounded-2xl border border-white/10 bg-surface-card p-6 text-center">
                <p class="mb-1 text-3xl font-extrabold text-brand-accent">{{ outcome.value }}</p>
                <p class="text-sm font-semibold text-white">{{ outcome.label }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ outcome.detail }}</p>
              </div>
            }
          </div>
        </section>

        <!-- ── CTA ── -->
        <section class="text-center">
          <div class="rounded-2xl border border-brand-accent/20 bg-brand-accent/5 px-8 py-12">
            <h2 class="mb-3 text-2xl font-bold text-white sm:text-3xl">Want AI working for your project?</h2>
            <p class="mb-6 text-slate-400">Let's talk about how we can bring intelligent automation to your next build.</p>
            <a
              routerLink="/contact"
              class="inline-block rounded-xl bg-brand-accent px-8 py-3 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90"
            >
              Start a Conversation
            </a>
          </div>
        </section>

      </div>
    </main>
  `,
})
export class AiApproachComponent implements AfterViewInit, OnDestroy {
  @ViewChild('neuralCanvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private animId = 0;
  private frame = 0;
  private nodes: Array<{ x: number; y: number; vx: number; vy: number; r: number; p: number; ps: number }> = [];

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const canvas = this.canvasRef.nativeElement;
    const section = canvas.parentElement!;
    // Set canvas pixel dimensions to match the rendered section
    const sync = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    };
    sync();
    // Seed nodes after we have real dimensions
    this.nodes = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: 2 + Math.random() * 2,
      p: Math.random() * Math.PI * 2,
      ps: 0.02 + Math.random() * 0.02,
    }));
    window.addEventListener('resize', sync);
    this.loop(canvas.getContext('2d')!, canvas);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
  }

  private loop(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const MAX = 140;
    const tick = () => {
      this.animId = requestAnimationFrame(tick);
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);
      this.frame++;

      for (const n of this.nodes) {
        n.x += n.vx; n.y += n.vy; n.p += n.ps;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      // Edges
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const a = this.nodes[i], b = this.nodes[j];
          const d = Math.hypot(b.x - a.x, b.y - a.y);
          if (d < MAX) {
            const alpha = (1 - d / MAX) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Nodes with glow
      for (const n of this.nodes) {
        const glow = 0.6 + 0.4 * Math.sin(n.p);
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5 * glow);
        g.addColorStop(0, `rgba(34,211,238,${0.6 * glow})`);
        g.addColorStop(1, 'rgba(34,211,238,0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5 * glow, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * glow, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${0.95 * glow})`;
        ctx.fill();
      }

      // Travelling signal every 60 frames
      if (this.frame % 60 === 0) {
        const pairs: Array<[typeof this.nodes[0], typeof this.nodes[0]]> = [];
        for (let i = 0; i < this.nodes.length; i++) {
          for (let j = i + 1; j < this.nodes.length; j++) {
            if (Math.hypot(this.nodes[j].x - this.nodes[i].x, this.nodes[j].y - this.nodes[i].y) < MAX) {
              pairs.push([this.nodes[i], this.nodes[j]]);
            }
          }
        }
        if (pairs.length) {
          const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
          let t = 0;
          const pulse = () => {
            t += 0.04;
            if (t > 1) return;
            requestAnimationFrame(pulse);
            ctx.beginPath();
            ctx.arc(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(99,102,241,0.9)';
            ctx.fill();
          };
          pulse();
        }
      }
    };
    tick();
  }

  readonly pillars: AiPillar[] = [
    {
      icon: '🧠',
      title: 'AI-Assisted Code Generation',
      description:
        'We use large language model agents to scaffold boilerplate, generate typed interfaces from API contracts, and suggest implementation patterns — letting engineers focus on architecture and business logic rather than repetitive code.',
      tags: ['LLM Agents', 'Code Scaffolding', 'TypeScript', 'API Contracts'],
    },
    {
      icon: '🔍',
      title: 'Automated Code Review & Quality',
      description:
        'Neural agents run alongside our CI pipeline to flag security vulnerabilities, detect anti-patterns, and enforce coding standards before a human reviewer ever sees the PR. Issues are caught earlier and fixed faster.',
      tags: ['Static Analysis', 'Security Scanning', 'CI/CD', 'Code Standards'],
    },
    {
      icon: '⚡',
      title: 'Intelligent Test Generation',
      description:
        'We use AI to generate property-based and unit test cases from function signatures and business rules. This dramatically increases coverage without proportionally increasing the time engineers spend writing tests.',
      tags: ['Property-Based Testing', 'Test Coverage', 'Jasmine', 'fast-check'],
    },
    {
      icon: '📊',
      title: 'Process Optimisation & Analytics',
      description:
        'AI agents analyse sprint velocity, deployment frequency, and incident patterns to surface bottlenecks in our delivery process. We act on data, not gut feel, to continuously improve how we work.',
      tags: ['Sprint Analytics', 'Deployment Metrics', 'Incident Analysis', 'Continuous Improvement'],
    },
  ];

  readonly workflowSteps: WorkflowStep[] = [
    {
      step: '01',
      title: 'Requirements Analysis',
      description:
        'AI agents parse client briefs and user stories to identify ambiguities, suggest missing acceptance criteria, and flag conflicting requirements before a single line of code is written.',
    },
    {
      step: '02',
      title: 'Architecture & Design',
      description:
        'We use AI-assisted diagramming and design review tools to evaluate proposed architectures against known patterns, scalability constraints, and security best practices.',
    },
    {
      step: '03',
      title: 'Development',
      description:
        'Engineers work alongside AI pair-programming agents that suggest completions, generate boilerplate, and surface relevant documentation — reducing context-switching and accelerating implementation.',
    },
    {
      step: '04',
      title: 'Testing & QA',
      description:
        'Automated agents generate test cases, run regression suites, and produce coverage reports. Neural models flag areas of the codebase with historically high defect rates for extra scrutiny.',
    },
    {
      step: '05',
      title: 'Deployment & Monitoring',
      description:
        'Post-deployment, AI monitors application health, detects anomalies in real time, and can trigger automated rollbacks or alert the team before users are impacted.',
    },
  ];

  readonly agents = [
    {
      role: 'Code Agent',
      name: 'Scaffold & Generate',
      description: 'Converts specs and interface definitions into typed, linted TypeScript code ready for review.',
    },
    {
      role: 'Review Agent',
      name: 'Analyse & Critique',
      description: 'Reads every pull request and surfaces security issues, complexity hotspots, and style violations.',
    },
    {
      role: 'Test Agent',
      name: 'Cover & Verify',
      description: 'Generates property-based and unit tests from function signatures, targeting edge cases humans miss.',
    },
    {
      role: 'Ops Agent',
      name: 'Monitor & Alert',
      description: 'Watches production metrics and logs, correlating anomalies with recent deployments automatically.',
    },
    {
      role: 'Planning Agent',
      name: 'Estimate & Prioritise',
      description: 'Analyses historical velocity data to produce more accurate sprint estimates and risk flags.',
    },
    {
      role: 'Docs Agent',
      name: 'Document & Explain',
      description: 'Keeps API documentation and inline comments in sync with code changes as they land.',
    },
  ];

  readonly outcomes = [
    { value: '40%', label: 'Faster Delivery', detail: 'Average reduction in time-to-production' },
    { value: '3×', label: 'Test Coverage', detail: 'More test cases generated per engineer-hour' },
    { value: '60%', label: 'Fewer Bugs', detail: 'Defects caught before reaching production' },
    { value: '90%', label: 'Client Satisfaction', detail: 'Retention rate across all engagements' },
  ];
}
