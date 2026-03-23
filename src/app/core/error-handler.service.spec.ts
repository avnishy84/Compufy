import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService } from './error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have null errorSignal initially', () => {
    expect(service.errorSignal()).toBeNull();
  });

  it('setError() should set the error signal', () => {
    const error = { message: 'Test error', timestamp: new Date() };
    service.setError(error);
    expect(service.errorSignal()).toEqual(error);
  });

  it('clearError() should reset the error signal to null', () => {
    service.setError({ message: 'Test error', timestamp: new Date() });
    service.clearError();
    expect(service.errorSignal()).toBeNull();
  });

  it('handleHttpError() should set error signal with status code', () => {
    const httpError = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
    service.handleHttpError(httpError);
    const err = service.errorSignal();
    expect(err).not.toBeNull();
    expect(err!.statusCode).toBe(404);
  });
});
