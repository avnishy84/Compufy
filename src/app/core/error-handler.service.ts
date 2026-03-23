import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppError } from '../data/models/error.model';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  readonly errorSignal = signal<AppError | null>(null);

  handleHttpError(err: HttpErrorResponse): void {
    this.setError({
      message: err.message || 'An HTTP error occurred',
      statusCode: err.status,
      timestamp: new Date(),
    });
  }

  setError(error: AppError): void {
    this.errorSignal.set(error);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
