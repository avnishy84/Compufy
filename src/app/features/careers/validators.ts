import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function pdfOnly(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;
    if (file instanceof File && file.type !== 'application/pdf') {
      return { pdfOnly: true };
    }
    return null;
  };
}

export function maxFileSize(bytes: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;
    if (file instanceof File && file.size > bytes) {
      return { maxFileSize: { max: bytes, actual: file.size } };
    }
    return null;
  };
}
