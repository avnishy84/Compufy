import { TestBed } from '@angular/core/testing';
import { AppErrorHandler } from './app-error-handler';
import { ErrorHandlerService } from './error-handler.service';

describe('AppErrorHandler', () => {
  let handler: AppErrorHandler;
  let errorHandlerService: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppErrorHandler],
    });
    handler = TestBed.inject(AppErrorHandler);
    errorHandlerService = TestBed.inject(ErrorHandlerService);
  });

  it('should call setError on unhandled Error', () => {
    const spy = spyOn(errorHandlerService, 'setError');
    handler.handleError(new Error('Something broke'));
    expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ message: 'Something broke' }));
  });

  it('should call setError on unhandled string error', () => {
    const spy = spyOn(errorHandlerService, 'setError');
    handler.handleError('string error');
    expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ message: 'string error' }));
  });
});
