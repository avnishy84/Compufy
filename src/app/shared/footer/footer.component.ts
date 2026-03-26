import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-surface border-t border-white/10 mt-auto">
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
          
        </div>

      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
