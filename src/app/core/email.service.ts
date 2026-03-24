import { Injectable, inject } from '@angular/core';
import emailjs from '@emailjs/browser';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { environment } from '../../environments/environment';
import { FirebaseService } from './firebase.service';

export interface ContactEmailParams {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface CareersEmailParams {
  fullName: string;
  designation: string;
  yearsOfExperience: number;
  resume: File;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  private readonly firebaseService = inject(FirebaseService);
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
    // Upload resume to Firebase Storage and get a download URL
    const storage = getStorage(this.firebaseService.app);
    const timestamp = Date.now();
    const resumeRef = ref(storage, `resumes/${timestamp}_${params.resume.name}`);
    await uploadBytes(resumeRef, params.resume);
    const resumeUrl = await getDownloadURL(resumeRef);

    await emailjs.send(
      this.serviceId,
      environment.emailjs.careersTemplateId,
      {
        from_name: params.fullName,
        designation: params.designation,
        years_of_experience: params.yearsOfExperience,
        resume_name: params.resume.name,
        resume_url: resumeUrl,
      },
      { publicKey: this.publicKey }
    );
  }
}
