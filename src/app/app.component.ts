import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorNotificationComponent } from './core/error-notification/error-notification.component';
import { ErrorHandlerService } from './core/error-handler.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorNotificationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <router-outlet />
    @if (errorHandlerService.errorSignal()) {
      <app-error-notification />
    }
  `,
})
export class AppComponent {
  readonly errorHandlerService = inject(ErrorHandlerService);
}
