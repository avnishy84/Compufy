import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ErrorHandlerService } from '../error-handler.service';

@Component({
  selector: 'app-error-notification',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (errorHandlerService.errorSignal(); as error) {
      <div class="fixed top-4 right-4 z-50 max-w-sm rounded-lg border border-red-500/30 bg-red-900/80 p-4 text-white shadow-lg backdrop-blur-glass" role="alert">
        <div class="flex items-start justify-between gap-3">
          <p class="text-sm">{{ error.message }}</p>
          <button
            (click)="dismiss()"
            class="shrink-0 text-red-300 hover:text-white"
            aria-label="Dismiss error"
          >✕</button>
        </div>
      </div>
    }
  `,
})
export class ErrorNotificationComponent {
  readonly errorHandlerService = inject(ErrorHandlerService);

  dismiss(): void {
    this.errorHandlerService.clearError();
  }
}
