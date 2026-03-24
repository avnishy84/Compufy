import { Injectable } from '@angular/core';
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
  private readonly serviceId = environment.emailjs.serviceId;
  private readonly publicKey = environment.emailjs.publicKey;

  constructor() {
    emailjs.init({ publicKey: this.publicKey });
  }

  sendContactEmail(params: ContactEmailParams): Promise<void> {
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
