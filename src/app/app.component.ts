import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ErrorNotificationComponent } from './core/error-notification/error-notification.component';
import { ErrorHandlerService } from './core/error-handler.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ErrorNotificationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-surface-glass backdrop-blur-glass border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a routerLink="/" class="text-white font-bold text-lg">Compufy</a>
        <div class="hidden sm:flex items-center gap-6">
          <a routerLink="/" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}"
             class="text-slate-300 hover:text-white transition-colors text-sm font-medium">Home</a>
          <a routerLink="/services" routerLinkActive="active-link"
             class="text-slate-300 hover:text-white transition-colors text-sm font-medium">Services</a>
          <a routerLink="/who-we-are" routerLinkActive="active-link"
             class="text-slate-300 hover:text-white transition-colors text-sm font-medium">Who We Are</a>
          <a routerLink="/contact" routerLinkActive="active-link"
             class="text-slate-300 hover:text-white transition-colors text-sm font-medium">Contact</a>
        </div>
      </div>
    </nav>
    <div class="pt-16">
      <router-outlet />
    </div>
    @if (errorHandlerService.errorSignal()) {
      <app-error-notification />
    }
  `,
  styles: [`
    .active-link {
      @apply text-brand-primary;
    }
  `],
})
export class AppComponent {
  readonly errorHandlerService = inject(ErrorHandlerService);
}
