import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('InputComponent', () => {
  let fixture: ComponentFixture<InputComponent>;

  function createFixture(control: FormControl) {
    TestBed.configureTestingModule({ imports: [InputComponent] });
    fixture = TestBed.createComponent(InputComponent);
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    return fixture;
  }

  it('should not show error when control is untouched and invalid', () => {
    const control = new FormControl('', Validators.required);
    createFixture(control);
    const error = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(error).toBeNull();
  });

  it('should show error when control is invalid and touched', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    createFixture(control);
    const error = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(error).not.toBeNull();
    expect(error.nativeElement.textContent.trim()).toBeTruthy();
  });

  it('should not show error when control is valid and touched', () => {
    const control = new FormControl('valid value', Validators.required);
    control.markAsTouched();
    createFixture(control);
    const error = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(error).toBeNull();
  });
});
