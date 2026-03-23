import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should have 4 controls', () => {
    const controls = Object.keys(component.contactForm.controls);
    expect(controls.length).toBe(4);
    expect(controls).toContain('fullName');
    expect(controls).toContain('email');
    expect(controls).toContain('subject');
    expect(controls).toContain('message');
  });

  it('invalid submit should mark all controls as touched', () => {
    component.onSubmit();
    const controls = component.contactForm.controls;
    expect(controls.fullName.touched).toBeTrue();
    expect(controls.email.touched).toBeTrue();
    expect(controls.subject.touched).toBeTrue();
    expect(controls.message.touched).toBeTrue();
  });

  it('should not show success state initially', () => {
    expect(component.submitted()).toBeFalse();
  });
});
