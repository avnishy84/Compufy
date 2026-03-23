// Feature: compufy-technology-website, Property 12: HTTP errors propagate to error signal
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import * as fc from 'fast-check';
import { httpErrorInterceptor } from './http-error.interceptor';
import { ErrorHandlerService } from './error-handler.service';

describe('HttpErrorInterceptor PBT', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let errorHandlerService: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    errorHandlerService = TestBed.inject(ErrorHandlerService);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  /**
   * **Validates: Requirements 12.1, 12.2**
   *
   * Property 12: HTTP errors propagate to error signal
   * For any HTTP response with a 4xx or 5xx status code, the HttpErrorInterceptor
   * should catch the error and the ErrorHandlerService.errorSignal should become
   * truthy with an AppError value containing the status code.
   */
  it('P12: any 4xx/5xx status code → errorSignal is truthy with that status code', () => {
    fc.assert(
      fc.property(fc.integer({ min: 400, max: 599 }), (statusCode) => {
        // Reset signal state before each run
        errorHandlerService.clearError();

        httpClient.get('/api/test').subscribe({ error: () => {} });

        httpMock
          .expectOne('/api/test')
          .flush('Error', { status: statusCode, statusText: 'Error' });

        const error = errorHandlerService.errorSignal();
        expect(error).not.toBeNull();
        expect(error!.statusCode).toBe(statusCode);
      }),
      { numRuns: 100 }
    );
  });
});
