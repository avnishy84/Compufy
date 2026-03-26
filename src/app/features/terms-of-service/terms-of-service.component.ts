import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="min-h-screen bg-surface py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">

        <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p class="text-slate-500 text-sm mb-10">Last Updated: March 26, 2026</p>

        <p class="text-slate-300 mb-10 leading-relaxed">
          Welcome to Compufy Technology. By accessing our website or using our services,
          you agree to be bound by these terms.
        </p>

        <div class="space-y-10">

          <div>
            <h2 class="text-lg font-semibold text-white mb-3">1. Service Provision</h2>
            <p class="text-slate-400 text-sm leading-relaxed">
              Compufy Technology provides cloud-based IT and software solutions. We reserve the right
              to modify, suspend, or discontinue any part of the service with prior notice to active subscribers.
            </p>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-white mb-3">2. User Accounts</h2>
            <ul class="list-disc list-inside space-y-1 text-slate-400 text-sm">
              <li>Users must provide accurate, current, and complete information during registration.</li>
              <li>You are responsible for safeguarding your account credentials.</li>
              <li>Unauthorized access or sharing of licenses is strictly prohibited.</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-white mb-3">3. Intellectual Property</h2>
            <p class="text-slate-400 text-sm mb-3 leading-relaxed">
              All software, code, designs, and content on this platform are the exclusive property of
              Compufy Technology. You are granted a limited, non-exclusive, non-transferable license
              to use the service. You may not:
            </p>
            <ul class="list-disc list-inside space-y-1 text-slate-400 text-sm">
              <li>Reverse engineer or attempt to extract the source code.</li>
              <li>Use the service to build a competitive product.</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-white mb-3">4. Payment and Taxes</h2>
            <ul class="list-disc list-inside space-y-1 text-slate-400 text-sm">
              <li>Subscriptions are billed in advance on a monthly or annual basis.</li>
              <li>All fees are subject to Goods and Services Tax (GST) as per Indian law.</li>
              <li>Non-payment will result in account suspension after a 7-day grace period.</li>
            </ul>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-white mb-3">5. Limitation of Liability</h2>
            <p class="text-slate-400 text-sm leading-relaxed">
              To the maximum extent permitted by Indian law, Compufy Technology shall not be liable
              for any indirect, incidental, or consequential damages (including loss of data or profits)
              arising from the use of our service. Our total liability is capped at the amount paid by
              you in the 6 months preceding the claim.
            </p>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-white mb-3">6. Governing Law &amp; Jurisdiction</h2>
            <p class="text-slate-400 text-sm leading-relaxed">
              These terms are governed by and construed in accordance with the laws of India. Any disputes
              arising shall be subject to the exclusive jurisdiction of the courts located in
              Kanpur, Uttar Pradesh.
            </p>
          </div>

          <div>
            <h2 class="text-lg font-semibold text-white mb-3">7. Termination</h2>
            <p class="text-slate-400 text-sm leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice, if you breach
              these Terms of Service.
            </p>
          </div>

          <div class="bg-surface-card rounded-xl p-6 border border-white/10">
            <p class="text-slate-400 text-sm">
              Questions about these terms? Reach us at
              <a href="mailto:helpdesk@compufy.tech" class="text-brand-accent hover:underline ml-1">
                helpdesk&#64;compufy.tech
              </a>
            </p>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class TermsOfServiceComponent {}
