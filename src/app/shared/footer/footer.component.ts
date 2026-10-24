import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-surface border-t border-white/10 mt-auto" style="min-height:320px">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <!-- Brand -->
          <div class="col-span-1 sm:col-span-2 lg:col-span-1">
            <a routerLink="/" class="text-white font-bold text-lg">Compufy Technology</a>
            <p class="mt-3 text-slate-400 text-sm leading-relaxed">
              Engineering modern web, mobile, and cloud solutions built to scale.
            </p>
          </div>

          <!-- Company -->
          <div>
            <h3 class="text-white text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul class="space-y-2">
              <li><a routerLink="/who-we-are" class="text-slate-400 hover:text-white text-sm transition-colors">Who We Are</a></li>
              <li><a routerLink="/services" class="text-slate-400 hover:text-white text-sm transition-colors">Services</a></li>
              <li><a routerLink="/careers" class="text-slate-400 hover:text-white text-sm transition-colors">Careers</a></li>
              <li><a routerLink="/ai-approach" class="text-slate-400 hover:text-white text-sm transition-colors">AI Approach</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-white text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
            <ul class="space-y-2">
              <li><a routerLink="/contact" class="text-slate-400 hover:text-white text-sm transition-colors">Contact Us</a></li>
              <li>
                <a href="mailto:compufykanpur@gmail.com"
                   class="text-slate-400 hover:text-brand-accent text-sm transition-colors">
                  compufykanpur&#64;gmail.com
                </a>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="text-white text-sm font-semibold uppercase tracking-wider mb-4">Legal</h3>
            <ul class="space-y-2">
              <li><a routerLink="/privacy-policy" class="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
              <li><a routerLink="/terms-of-service" class="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        <div class="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-slate-500 text-xs">
            &copy; {{ year }} Compufy Technology. All rights reserved.
          </p>

          <!-- Easter egg: subtle gamepad icon — navigates to the 404 game page -->
          <a
            routerLink="/404-game"
            title="🎮"
            class="group flex h-7 w-7 items-center justify-center rounded-lg text-slate-700 transition-all duration-300 hover:text-slate-400 hover:scale-110"
            aria-label="Easter egg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
            </svg>
          </a>
        </div>

      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
