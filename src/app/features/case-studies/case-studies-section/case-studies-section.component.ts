import {
  Component, ChangeDetectionStrategy, signal, computed,
  inject, PLATFORM_ID, OnInit, OnDestroy, ElementRef, AfterViewInit
} from '@angular/core';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CLIENT_PROJECTS_DATA } from '../../../data/static/client-projects.data';
import { ClientProject } from '../../../data/models/client-project.model';

@Component({
  selector: 'app-case-studies-section',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (clients().length) {
      <section class="bg-surface px-6 py-20">
        <div class="mx-auto max-w-6xl">
          <p class="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-brand-accent">
            Trusted By
          </p>
          <h2 class="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
            Clients We
            <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              Work For
            </span>
          </h2>
          <p class="mx-auto mb-14 max-w-xl text-center text-slate-400">
            Businesses that trust us to build and scale their digital products.
          </p>

          <!-- Carousel -->
          <div class="relative" #carouselEl>
            <div class="overflow-hidden">
              <!-- Track: [clones-before] [real items] [clones-after] -->
              <div
                class="flex"
                [style.transition]="transitioning() ? 'transform 500ms ease-in-out' : 'none'"
                [style.transform]="'translateX(-' + offset() + '%)'">

                <!-- Leading clones (last N items) -->
                @for (client of leadingClones(); track 'lead-' + client.id) {
                  <div [style.width]="cardWidth()" class="flex-shrink-0 px-3">
                    <ng-container *ngTemplateOutlet="card; context: { $implicit: client }"></ng-container>
                  </div>
                }

                <!-- Real items -->
                @for (client of clients(); track client.id) {
                  <div [style.width]="cardWidth()" class="flex-shrink-0 px-3">
                    <ng-container *ngTemplateOutlet="card; context: { $implicit: client }"></ng-container>
                  </div>
                }

                <!-- Trailing clones (first N items) -->
                @for (client of trailingClones(); track 'trail-' + client.id) {
                  <div [style.width]="cardWidth()" class="flex-shrink-0 px-3">
                    <ng-container *ngTemplateOutlet="card; context: { $implicit: client }"></ng-container>
                  </div>
                }
              </div>
            </div>

            <!-- Prev -->
            <button
              (click)="prev()"
              class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-card text-slate-400 transition-all hover:border-brand-primary/40 hover:text-white z-10"
              aria-label="Previous project"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <!-- Next -->
            <button
              (click)="next()"
              class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-card text-slate-400 transition-all hover:border-brand-primary/40 hover:text-white z-10"
              aria-label="Next project"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Dot indicators -->
          <div class="mt-8 flex justify-center gap-2">
            @for (client of clients(); track client.id; let i = $index) {
              <button
                (click)="goTo(i)"
                [class]="i === activeIndex()
                  ? 'h-2 w-6 rounded-full bg-brand-primary transition-all duration-300'
                  : 'h-2 w-2 rounded-full bg-slate-600 transition-all duration-300 hover:bg-slate-400'"
                [attr.aria-label]="'Go to ' + client.name"
              ></button>
            }
          </div>
        </div>
      </section>

      <!-- Card template -->
      <ng-template #card let-client>
        <div class="h-full rounded-2xl border border-white/5 bg-surface-card p-6 backdrop-blur-glass transition-all duration-200 hover:border-brand-primary/40 hover:shadow-lg hover:shadow-brand-primary/10 flex flex-col gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden bg-white text-sm font-bold text-brand-accent flex-shrink-0">
            @if (client.logoUrl) {
              <img [src]="client.logoUrl" [alt]="client.name + ' logo'" class="h-full w-full object-contain p-2" />
            } @else {
              <span class="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-primary/30 to-brand-accent/20">
                {{ client.initials }}
              </span>
            }
          </div>
          <div class="flex-1">
            <p class="mb-0.5 text-xs font-medium uppercase tracking-wider text-slate-500">{{ client.industry }}</p>
            <h3 class="mb-2 text-lg font-semibold text-white">{{ client.name }}</h3>
            <p class="text-sm text-slate-400 leading-relaxed line-clamp-3">{{ client.tagline }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            @for (tag of client.techTags.slice(0, 3); track tag) {
              <span class="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-accent">{{ tag }}</span>
            }
          </div>
          <a
            [routerLink]="['/clients', client.slug]"
            class="text-sm font-medium text-brand-primary hover:text-brand-accent transition-colors duration-200"
          >
            View Project →
          </a>
        </div>
      </ng-template>
    }
  `,
})
export class CaseStudiesSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly el = inject(ElementRef);

  readonly clients = signal<ClientProject[]>(CLIENT_PROJECTS_DATA);

  // perPage: 3 on desktop, 1 on mobile
  readonly perPage = signal(1);
  readonly cardWidth = computed(() => `${100 / this.perPage()}%`);

  // Leading clones = last perPage items; trailing clones = first perPage items
  readonly leadingClones = computed(() => {
    const n = this.perPage();
    return this.clients().slice(-n);
  });
  readonly trailingClones = computed(() => {
    const n = this.perPage();
    return this.clients().slice(0, n);
  });

  // rawIndex: 0-based position in the full track (clones + real + clones)
  // Starts at perPage so we're showing the first real item
  readonly rawIndex = signal(0);

  readonly activeIndex = computed(() => {
    const n = this.clients().length;
    const p = this.perPage();
    const r = this.rawIndex();
    // real items start at index p in the track
    const realIdx = r - p;
    return ((realIdx % n) + n) % n;
  });

  readonly offset = computed(() => (this.rawIndex() / this.perPage()) * 100);

  readonly transitioning = signal(true);

  private autoTimer: ReturnType<typeof setInterval> | null = null;
  private resizeObserver: ResizeObserver | null = null;

  ngOnInit(): void {
    if (this.isBrowser) {
      this.autoTimer = setInterval(() => this.next(), 4000);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    const updatePerPage = (width: number) => {
      const newPer = width >= 1024 ? 3 : width >= 640 ? 2 : 1;
      if (newPer !== this.perPage()) {
        this.perPage.set(newPer);
        // Reset to first real item
        this.transitioning.set(false);
        this.rawIndex.set(newPer);
      }
    };
    const section = this.el.nativeElement.querySelector('section');
    if (section) {
      updatePerPage(section.offsetWidth);
      this.resizeObserver = new ResizeObserver(entries => {
        updatePerPage(entries[0].contentRect.width);
      });
      this.resizeObserver.observe(section);
    }
    // Set initial rawIndex after perPage is known
    this.rawIndex.set(this.perPage());
  }

  ngOnDestroy(): void {
    if (this.autoTimer) clearInterval(this.autoTimer);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  next(): void {
    this.transitioning.set(true);
    this.rawIndex.update(i => i + 1);
    const n = this.clients().length;
    const p = this.perPage();
    // If we've slid into the trailing clones zone
    if (this.rawIndex() > n) {
      setTimeout(() => {
        this.transitioning.set(false);
        this.rawIndex.set(p);
      }, 500);
    }
  }

  prev(): void {
    this.transitioning.set(true);
    this.rawIndex.update(i => i - 1);
    const p = this.perPage();
    const n = this.clients().length;
    // If we've slid into the leading clones zone
    if (this.rawIndex() < p) {
      setTimeout(() => {
        this.transitioning.set(false);
        this.rawIndex.set(n);
      }, 500);
    }
  }

  goTo(index: number): void {
    this.transitioning.set(true);
    this.rawIndex.set(index + this.perPage());
  }
}
