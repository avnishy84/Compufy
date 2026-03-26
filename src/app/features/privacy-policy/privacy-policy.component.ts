import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-screen bg-surface py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">

        <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p class="text-slate-500 text-sm mb-10">Last Updated: March 26, 2026</p>

        <p class="text-slate-300 mb-10 leading-relaxed">
          Compufy Technology ("we," "our," or "us") is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, and share personal data in compliance
          with the Digital Personal Data Protection (DPDP) Act, 2023 of India and other applicable laws.
        </p>

        <div class="space-y-10">

          <div>
            <h2 class="text-lg font-semibold text-white mb-3">1. Data We Collect</h2>
            <p class="text-slate-400 text-sm mb-3">We collect information to provide better services to our users:</p>
            <ul class="list-disc list-inside space-y-1 text-slate-400 text-sm">
              <li><span class="text-slate-300 font-medium">Identity Data:</span> Name, username, or similar identifier.</li>
              <li><span class="text-slate-300 font-medium">Contact Data:</span> Email address and telephone numbers.</li>
              <li><span class="text-slate-300 font-medium">Technical Data:</span> IP address, login data, browser type, and time zone setting.</li>
              <li><span class="text-slate-300 font-medium">Usage Data:</span> Information about how you use our platform and website.</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-white mb-3">2. Basis of Processing (Consent)</h2>
            <p class="text-slate-400 text-sm leading-relaxed">
              By using our services, you provide affirmative consent to process your data for the purposes
              of providing IT and SaaS solutions. You have the right to withdraw consent at any time by
              contacting our Consent Manager.
            </p>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-white mb-3">3. Purpose of Collection</h2>
            <p class="text-slate-400 text-sm mb-3">We use your data only for:</p>
            <ul class="list-disc list-inside space-y-1 text-slate-400 text-sm">
              <li>Providing and maintaining our Service.</li>
              <li>Processing payments and renewals.</li>
              <li>Complying with legal obligations under Indian law.</li>
              <li>Improving our platform security.</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-white mb-3">4. Data Principal Rights (India)</h2>
            <p class="text-slate-400 text-sm mb-3">Under the DPDP Act 2023, you have the following rights:</p>
            <ul class="list-disc list-inside space-y-1 text-slate-400 text-sm">
              <li><span class="text-slate-300 font-medium">Right to Access:</span> Request a summary of personal data being processed.</li>
              <li><span class="text-slate-300 font-medium">Right to Correction/Erasure:</span> Request updates or deletion of your data.</li>
              <li><span class="text-slate-300 font-medium">Right to Grievance Redressal:</span> Register a complaint regarding data processing.</li>
              <li><span class="text-slate-300 font-medium">Right to Nominate:</span> Nominate an individual to exercise your rights in case of death or incapacity.</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-white mb-3">5. Data Retention &amp; Storage</h2>
            <p class="text-slate-400 text-sm leading-relaxed">
              We retain personal data only for as long as necessary to fulfill the purposes for which it
              was collected. Data is stored on secure servers located in India.
            </p>
          </div>

          <div class="bg-surface-card rounded-xl p-6 border border-white/10">
            <h2 class="text-lg font-semibold text-white mb-3">6. Grievance Officer</h2>
            <p class="text-slate-400 text-sm mb-4">
              In accordance with the Information Technology Act and DPDP Act, the contact details
              of the Grievance Officer are:
            </p>
            <dl class="space-y-1 text-sm">
              <div class="flex gap-2">
                <dt class="text-slate-500 w-20 shrink-0">Email</dt>
                <dd>
                  <a href="mailto:compufykanpur@gmail.com"
                     class="text-brand-accent hover:underline">
                    compufykanpur&#64;gmail.com
                  </a>
                </dd>
              </div>
              <div class="flex gap-2">
                <dt class="text-slate-500 w-20 shrink-0">Address</dt>
                <dd class="text-slate-300">Kanpur, Uttar Pradesh, India</dd>
              </div>
            </dl>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class PrivacyPolicyComponent {}
