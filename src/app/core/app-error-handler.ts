import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly errorHandlerService = inject(ErrorHandlerService);

  handleError(error: unknown): void {
    console.error('Unhandled error:', error);
    this.errorHandlerService.setError({
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date(),
    });
  }
}
