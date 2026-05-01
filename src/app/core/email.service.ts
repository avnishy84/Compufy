import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment';

export interface ContactEmailParams {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface CareersEmailParams {
  fullName: string;
  email: string;
  designation: string;
  yearsOfExperience: number;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly serviceId = environment.emailjs.serviceId;
  private readonly publicKey = environment.emailjs.publicKey;

  constructor() {
    if (this.isBrowser) {
      emailjs.init({ publicKey: this.publicKey });
    }
  }

  sendContactEmail(params: ContactEmailParams): Promise<void> {
    if (!this.isBrowser) {
      console.log('SSR: Skipping contact email send');
      return Promise.resolve();
    }
    return emailjs
      .send(
        this.serviceId,
        environment.emailjs.contactTemplateId,
        {
          from_name: params.fullName,
          from_email: params.email,
          subject: params.subject,
          message: params.message,
        },
        { publicKey: this.publicKey }
      )
      .then(() => undefined);
  }

  async sendCareersEmail(params: CareersEmailParams): Promise<void> {
    if (!this.isBrowser) {
      console.log('SSR: Skipping careers email send');
      return Promise.resolve();
    }
    await emailjs.send(
      this.serviceId,
      environment.emailjs.careersTemplateId,
      {
        from_name: params.fullName,
        from_email: params.email,
        designation: params.designation,
        years_of_experience: params.yearsOfExperience,
      },
      { publicKey: this.publicKey }
    );
  }
}
