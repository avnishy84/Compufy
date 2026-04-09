import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-demo-unavailable',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="flex min-h-screen items-center justify-center bg-surface px-6 py-20">
      <div class="mx-auto max-w-lg text-center">

        <!-- Icon -->
        <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-accent/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <h1 class="mb-3 text-2xl font-bold text-white sm:text-3xl">
          Live Demo Unavailable
        </h1>

        <p class="mb-2 text-slate-400 leading-relaxed">
          The live demo for this project is not publicly accessible in accordance with the client's privacy policy.
        </p>
        <p class="mb-10 text-slate-500 text-sm leading-relaxed">
          The client has requested that their product not be publicly demonstrated. We respect their confidentiality requirements.
        </p>

        <a
          routerLink="/"
          class="inline-flex items-center gap-2 rounded-xl bg-brand-primary/10 px-6 py-3 text-sm font-medium text-brand-accent transition-colors duration-200 hover:bg-brand-primary/20"
        >
          ← Back to Home
        </a>

      </div>
    </main>
  `,
})
export class DemoUnavailableComponent {}
