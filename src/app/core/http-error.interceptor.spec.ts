import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { httpErrorInterceptor } from './http-error.interceptor';
import { ErrorHandlerService } from './error-handler.service';

describe('HttpErrorInterceptor', () => {
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

  afterEach(() => httpMock.verify());

  it('should pass through 2xx responses without setting error signal', () => {
    httpClient.get('/api/test').subscribe();
    httpMock.expectOne('/api/test').flush({ data: 'ok' });
    expect(errorHandlerService.errorSignal()).toBeNull();
  });

  it('should catch 404 and set error signal', () => {
    httpClient.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush('Not Found', { status: 404, statusText: 'Not Found' });
    expect(errorHandlerService.errorSignal()).not.toBeNull();
    expect(errorHandlerService.errorSignal()!.statusCode).toBe(404);
  });

  it('should catch 500 and set error signal', () => {
    httpClient.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    expect(errorHandlerService.errorSignal()).not.toBeNull();
    expect(errorHandlerService.errorSignal()!.statusCode).toBe(500);
  });
});
