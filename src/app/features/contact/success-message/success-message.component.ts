import { Component, ChangeDetectionStrategy } from '@angular/core';
import { successFade } from '../../../shared/animations/animations';

@Component({
  selector: 'app-success-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [successFade],
  template: `
    <div
      class="flex flex-col items-center gap-4 rounded-xl border border-green-500/30 bg-green-900/20 p-8 text-center"
      [@successFade]
    >
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-3xl">✓</div>
      <h3 class="text-xl font-semibold text-white">Message Sent!</h3>
      <p class="text-slate-400">Thank you for reaching out. We'll get back to you shortly.</p>
    </div>
  `,
})
export class SuccessMessageComponent {}
