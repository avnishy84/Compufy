import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/input/input.component';
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form()" (ngSubmit)="submitForm.emit()" class="flex flex-col gap-5">
      <app-input
        label="Full Name"
        [control]="getControl('fullName')"
        placeholder="Your full name"
      />
      <app-input
        label="Email Address"
        [control]="getControl('email')"
        type="email"
        placeholder="your@email.com"
      />
      <app-input
        label="Subject"
        [control]="getControl('subject')"
        placeholder="How can we help?"
      />
      <app-input
        label="Message"
        [control]="getControl('message')"
        type="textarea"
        placeholder="Tell us more..."
      />
      <app-button type="submit" variant="primary" size="lg">
        Send Message
      </app-button>
    </form>
  `,
})
export class ContactFormComponent {
  form = input.required<FormGroup>();
  submitForm = output<void>();

  getControl(name: string): FormControl {
    return this.form().get(name) as FormControl;
  }
}
