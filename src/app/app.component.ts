import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ErrorNotificationComponent } from './core/error-notification/error-notification.component';
import { ErrorHandlerService } from './core/error-handler.service';
import { FooterComponent } from './shared/footer/footer.component';
import { RocketGameOverlayComponent } from './features/rocket-game/rocket-game-overlay.component';
import { LucideAngularModule } from 'lucide-angular';
import { GameStateService } from './features/rocket-game/game-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ErrorNotificationComponent, FooterComponent, RocketGameOverlayComponent, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-surface-glass backdrop-blur-glass border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a routerLink="/" class="text-white font-bold text-lg">Compufy Technology</a>
        <div class="flex items-center gap-3">
          <!-- Nav links: desktop only -->
          <div class="hidden sm:flex items-center gap-6">
            <a routerLink="/" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}"
               class="text-slate-300 hover:text-white transition-colors text-sm font-medium">Home</a>
            <a routerLink="/services" routerLinkActive="active-link"
               class="text-slate-300 hover:text-white transition-colors text-sm font-medium">Services</a>
            <a routerLink="/ai-approach" routerLinkActive="active-link"
               class="text-slate-300 hover:text-white transition-colors text-sm font-medium">AI Approach</a>
            <a routerLink="/who-we-are" routerLinkActive="active-link"
               class="text-slate-300 hover:text-white transition-colors text-sm font-medium">Who We Are</a>
            <a routerLink="/contact" routerLinkActive="active-link"
               class="text-slate-300 hover:text-white transition-colors text-sm font-medium">Contact</a>
            <a routerLink="/careers" routerLinkActive="active-link"
               class="text-slate-300 hover:text-white transition-colors text-sm font-medium">Careers</a>
          </div>
          <!-- Game button: always visible -->
          <button
            id="game-trigger"
            type="button"
            [title]="gameState.active() ? 'Exit game (Esc)' : 'Launch rocket game'"
            [attr.aria-label]="gameState.active() ? 'Exit rocket game' : 'Launch rocket game'"
            [class]="gameState.active()
              ? 'flex items-center gap-1.5 rounded-full border border-red-500/60 bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-400 transition-all duration-200 hover:border-red-400 hover:bg-red-500/25 hover:text-red-300'
              : 'flex items-center gap-1.5 rounded-full border border-brand-primary/40 bg-brand-primary/10 px-3 py-1.5 text-xs font-medium text-brand-primary transition-all duration-200 hover:border-brand-primary/70 hover:bg-brand-primary/20 hover:text-white'"
          >
            @if (gameState.active()) {
              <lucide-icon name="x" [size]="14" />
              <span class="hidden sm:inline">Exit Game</span>
            } @else {
              <lucide-icon name="gamepad-2" [size]="14" />
              <span class="hidden sm:inline">Play</span>
            }
          </button>
        </div>
      </div>
    </nav>
    <div class="pt-16 flex flex-col min-h-screen">
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>
    @if (errorHandlerService.errorSignal()) {
      <app-error-notification />
    }
    <app-rocket-game-overlay />
  `,
  styles: [`
    .active-link {
      @apply text-brand-primary;
    }
  `],
})
export class AppComponent {
  readonly errorHandlerService = inject(ErrorHandlerService);
  readonly gameState = inject(GameStateService);
}
