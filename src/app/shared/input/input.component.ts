import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-1">
      @if (label()) {
        <label class="text-sm font-medium text-slate-300">{{ label() }}</label>
      }
      @if (type() === 'textarea') {
        <textarea
          [formControl]="control()"
          [placeholder]="placeholder()"
          rows="4"
          class="rounded-lg border border-slate-700 bg-surface-card px-3 py-2 text-white placeholder-slate-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        ></textarea>
      } @else {
        <input
          [type]="type()"
          [formControl]="control()"
          [placeholder]="placeholder()"
          class="rounded-lg border border-slate-700 bg-surface-card px-3 py-2 text-white placeholder-slate-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />
      }
      @if (control().invalid && control().touched) {
        <span class="text-xs text-red-400" role="alert">{{ errorMessage() }}</span>
      }
    </div>
  `,
})
export class InputComponent {
  label = input<string>('');
  control = input.required<FormControl>();
  type = input<string>('text');
  placeholder = input<string>('');

  errorMessage(): string {
    const errors = this.control().errors;
    if (!errors) return '';
    if (errors['required']) return 'This field is required.';
    if (errors['email']) return 'Please enter a valid email address.';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters required.`;
    if (errors['minLengthTrimmed']) return `Minimum ${errors['minLengthTrimmed'].requiredLength} characters required.`;
    return 'Invalid value.';
  }
}
