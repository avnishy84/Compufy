import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minLengthTrimmed(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').trim();
    if (value.length < minLength) {
      return { minLengthTrimmed: { requiredLength: minLength, actualLength: value.length } };
    }
    return null;
  };
}
