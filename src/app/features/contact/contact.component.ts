import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { SuccessMessageComponent } from './success-message/success-message.component';
import { HttpService } from '../../core/http.service';
import { API_ENDPOINTS } from '../../data/constants/api.constants';
import { minLengthTrimmed } from './validators';
import { scrollReveal } from '../../shared/animations/animations';
import { SeoService } from '../../core/seo.service';

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
          <app-contact-form [form]="contactForm" (submitForm)="onSubmit()" />
        }
      </div>
    </main>
  `,
})
export class ContactComponent {
  private readonly httpService = inject(HttpService);
  readonly submitted = signal(false);

  constructor() {
    inject(SeoService).update({
      title: 'Contact Us',
      description: 'Get in touch with Compufy Technology. Send us a message about your SaaS project, IT consulting needs, or digital transformation goals.',
      url: 'https://compufytech.web.app/contact',
    });
  }

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
    this.httpService.post(API_ENDPOINTS.CONTACT_SUBMIT, this.contactForm.value).subscribe({
      next: () => this.submitted.set(true),
      error: () => { /* error handled by interceptor */ },
    });
  }
}
