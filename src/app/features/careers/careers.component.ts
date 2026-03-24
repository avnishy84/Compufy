import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmailService } from '../../core/email.service';
import { COMPANY_VALUES, WHY_JOIN_ITEMS } from '../../data/static/careers.data';
import { CompanyValue, WhyJoinItem } from '../../data/models/careers.model';
import { minLengthTrimmed } from '../contact/validators';
import { pdfOnly, maxFileSize } from './validators';

interface CareersFormControls {
  fullName: FormControl<string | null>;
  designation: FormControl<string | null>;
  yearsOfExperience: FormControl<number | null>;
  resume: FormControl<File | null>;
}

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-screen bg-surface">

      <!-- Background blobs -->
      <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand-primary/10 blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-brand-secondary/10 blur-3xl"></div>
        <div class="absolute top-1/2 right-0 h-64 w-64 rounded-full bg-brand-accent/10 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-6xl px-6 py-20">

        <!-- Hero -->
        <section class="mb-20 text-center">
          <span class="mb-4 inline-block rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-primary">
            Careers
          </span>
          <h1 class="mb-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Build the Future
            <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent"> With Us</span>
          </h1>
          <p class="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400">
            Join a team of passionate engineers and consultants who care deeply about craft, collaboration, and delivering real value.
          </p>
        </section>

        <!-- Values Section -->
        <section class="mb-20">
          <div class="mb-10 text-center">
            <h2 class="text-2xl font-bold text-white sm:text-3xl">
              <span class="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">Our Values</span>
            </h2>
            <p class="mt-3 text-slate-400">The principles that guide everything we do.</p>
          </div>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (value of companyValues; track value.title) {
              <div class="rounded-2xl border border-white/10 bg-surface-card p-6">
                <div class="mb-3 h-1 w-10 rounded-full"
                  [class.bg-brand-primary]="value.accentColor === 'brand-primary'"
                  [class.bg-brand-secondary]="value.accentColor === 'brand-secondary'"
                  [class.bg-brand-accent]="value.accentColor === 'brand-accent'">
                </div>
                <h3 class="mb-2 text-base font-bold text-white">{{ value.title }}</h3>
                <p class="text-sm leading-relaxed text-slate-400">{{ value.description }}</p>
              </div>
            }
          </div>
        </section>

        <!-- Why Join Section -->
        <section class="mb-20">
          <div class="mb-10 text-center">
            <h2 class="text-2xl font-bold text-white sm:text-3xl">
              <span class="bg-gradient-to-r from-brand-secondary to-brand-accent bg-clip-text text-transparent">Why Join Compufy?</span>
            </h2>
            <p class="mt-3 text-slate-400">What makes us a great place to grow your career.</p>
          </div>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (item of whyJoinItems; track item.title) {
              <div class="rounded-2xl border border-white/10 bg-surface-card p-6">
                <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-secondary/10 text-xl">
                  {{ item.icon }}
                </div>
                <h3 class="mb-2 text-base font-bold text-white">{{ item.title }}</h3>
                <p class="text-sm leading-relaxed text-slate-400">{{ item.description }}</p>
              </div>
            }
          </div>
        </section>

        <!-- Application Form -->
        <section class="mx-auto max-w-2xl">
          <div class="mb-8 text-center">
            <h2 class="text-2xl font-bold text-white sm:text-3xl">Apply Now</h2>
            <p class="mt-3 text-slate-400">Ready to join us? Send us your details and we'll be in touch.</p>
          </div>

          @if (submitted()) {
            <div class="rounded-2xl border border-brand-accent/30 bg-brand-accent/10 p-10 text-center">
              <div class="mb-4 text-4xl">🎉</div>
              <h3 class="mb-2 text-xl font-bold text-white">Application Received!</h3>
              <p class="text-slate-400">Thank you for applying. We'll review your application and get back to you soon.</p>
            </div>
          } @else {
            <div class="rounded-2xl border border-white/10 bg-surface-card p-8">
              @if (submitError()) {
                <div class="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
                  {{ submitError() }}
                </div>
              }
              <form [formGroup]="applicationForm" (ngSubmit)="onSubmit()" novalidate>
                <!-- Full Name -->
                <div class="mb-5">
                  <label for="fullName" class="mb-1.5 block text-sm font-medium text-slate-300">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    formControlName="fullName"
                    aria-describedby="fullName-error"
                    class="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50"
                    placeholder="Your full name"
                  />
                  @if (applicationForm.controls.fullName.invalid && applicationForm.controls.fullName.touched) {
                    <p id="fullName-error" class="mt-1.5 text-xs text-red-400">
                      @if (applicationForm.controls.fullName.hasError('required')) {
                        Full name is required
                      } @else if (applicationForm.controls.fullName.hasError('minLengthTrimmed')) {
                        Name must be at least 2 characters
                      }
                    </p>
                  }
                </div>

                <!-- Designation -->
                <div class="mb-5">
                  <label for="designation" class="mb-1.5 block text-sm font-medium text-slate-300">Designation</label>
                  <input
                    id="designation"
                    type="text"
                    formControlName="designation"
                    aria-describedby="designation-error"
                    class="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50"
                    placeholder="Role you are applying for"
                  />
                  @if (applicationForm.controls.designation.invalid && applicationForm.controls.designation.touched) {
                    <p id="designation-error" class="mt-1.5 text-xs text-red-400">
                      Designation is required
                    </p>
                  }
                </div>

                <!-- Years of Experience -->
                <div class="mb-5">
                  <label for="yearsOfExperience" class="mb-1.5 block text-sm font-medium text-slate-300">Years of Experience</label>
                  <input
                    id="yearsOfExperience"
                    type="number"
                    formControlName="yearsOfExperience"
                    aria-describedby="yearsOfExperience-error"
                    class="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50"
                    placeholder="0"
                    min="0"
                    max="50"
                  />
                  @if (applicationForm.controls.yearsOfExperience.invalid && applicationForm.controls.yearsOfExperience.touched) {
                    <p id="yearsOfExperience-error" class="mt-1.5 text-xs text-red-400">
                      @if (applicationForm.controls.yearsOfExperience.hasError('required')) {
                        Years of experience is required
                      } @else {
                        Please enter a valid number of years (0–50)
                      }
                    </p>
                  }
                </div>

                <!-- Resume Upload -->
                <div class="mb-8">
                  <label for="resume" class="mb-1.5 block text-sm font-medium text-slate-300">Resume (PDF only, max 2 MB)</label>
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    aria-describedby="resume-error"
                    class="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm text-slate-400 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-brand-primary/20 file:px-3 file:py-1 file:text-xs file:font-medium file:text-brand-primary focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50"
                    (change)="onFileChange($event)"
                  />
                  @if (selectedFileName()) {
                    <p class="mt-1.5 text-xs text-slate-400">Selected: {{ selectedFileName() }}</p>
                  }
                  @if (applicationForm.controls.resume.invalid && applicationForm.controls.resume.touched) {
                    <p id="resume-error" class="mt-1.5 text-xs text-red-400">
                      @if (applicationForm.controls.resume.hasError('required')) {
                        Resume is required
                      } @else if (applicationForm.controls.resume.hasError('pdfOnly')) {
                        Only PDF files are accepted
                      } @else if (applicationForm.controls.resume.hasError('maxFileSize')) {
                        File size must not exceed 2 MB
                      }
                    </p>
                  }
                </div>

                <button
                  type="submit"
                  [disabled]="submitting()"
                  aria-label="Submit job application"
                  class="w-full rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {{ submitting() ? 'Submitting…' : 'Submit Application' }}
                </button>
              </form>
            </div>
          }
        </section>

      </div>
    </main>
  `,
})
export class CareersComponent {
  private readonly emailService = inject(EmailService);

  companyValues: CompanyValue[] = COMPANY_VALUES;
  whyJoinItems: WhyJoinItem[] = WHY_JOIN_ITEMS;

  readonly submitted = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly applicationForm = new FormGroup<CareersFormControls>({
    fullName: new FormControl<string | null>(null, [Validators.required, minLengthTrimmed(2)]),
    designation: new FormControl<string | null>(null, [Validators.required]),
    yearsOfExperience: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(50)]),
    resume: new FormControl<File | null>(null, [Validators.required, pdfOnly(), maxFileSize(2 * 1024 * 1024)]),
  });

  readonly selectedFileName = computed(() => {
    const file = this.applicationForm.controls.resume.value;
    return file instanceof File ? file.name : null;
  });

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.applicationForm.controls.resume.setValue(file);
    this.applicationForm.controls.resume.markAsTouched();
  }

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }
    const { fullName, designation, yearsOfExperience, resume } = this.applicationForm.value;
    this.submitting.set(true);
    this.submitError.set(null);
    this.emailService
      .sendCareersEmail({
        fullName: fullName ?? '',
        designation: designation ?? '',
        yearsOfExperience: yearsOfExperience ?? 0,
        resume: resume as File,
      })
      .then(() => {
        this.submitted.set(true);
        this.applicationForm.reset();
      })
      .catch(() => {
        this.submitError.set('Something went wrong. Please try again.');
      })
      .finally(() => {
        this.submitting.set(false);
      });
  }
}
