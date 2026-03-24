import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { SuccessMessageComponent } from './success-message/success-message.component';
import { EmailService } from '../../core/email.service';
import { minLengthTrimmed } from './validators';
import { scrollReveal } from '../../shared/animations/animations';

interface ContactFormControls {
  fullName: FormControl<string | null>;
  email: FormControl<string | null>;
  subject: FormControl<string | null>;
  message: FormControl<string | null>;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, ContactFormComponent, SuccessMessageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scrollReveal],
  template: `
    <main class="min-h-screen bg-surface px-6 py-20">
      <div class="mx-auto max-w-2xl" [@scrollReveal]>
        <h1 class="mb-4 text-4xl font-bold text-white">Get In Touch</h1>
        <p class="mb-10 text-slate-400">
          Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
        @if (submitted()) {
          <app-success-message />
        } @else {
          @if (submitError()) {
            <div class="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
              {{ submitError() }}
            </div>
          }
          <app-contact-form [form]="contactForm" [submitting]="submitting()" (submitForm)="onSubmit()" />
        }
      </div>
    </main>
  `,
})
export class ContactComponent {
  private readonly emailService = inject(EmailService);
  readonly submitted = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly contactForm = new FormGroup<ContactFormControls>({
    fullName: new FormControl('', [minLengthTrimmed(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    const { fullName, email, subject, message } = this.contactForm.value;
    this.submitting.set(true);
    this.submitError.set(null);
    this.emailService
      .sendContactEmail({
        fullName: fullName ?? '',
        email: email ?? '',
        subject: subject ?? '',
        message: message ?? '',
      })
      .then(() => {
        this.submitted.set(true);
        this.contactForm.reset();
      })
      .catch(() => {
        this.submitError.set('Failed to send message. Please try again.');
      })
      .finally(() => {
        this.submitting.set(false);
      });
  }
}
