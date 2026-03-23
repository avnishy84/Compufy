import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandlerService = inject(ErrorHandlerService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      errorHandlerService.handleHttpError(err);
      return throwError(() => err);
    })
  );
};
