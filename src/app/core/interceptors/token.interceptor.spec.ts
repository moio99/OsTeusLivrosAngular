import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { Observable } from 'rxjs';

describe('TokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('debería agregar los headers correctos a la solicitud', () => {
    const testUrl = '/api/test';
    const testData = { data: 'test' };

    httpClient.get(testUrl).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne(testUrl);

    // Verifica que los headers se hayan añadido correctamente
    expect(httpRequest.request.headers.has('usuarinho')).toBeTruthy();
    expect(httpRequest.request.headers.get('usuarinho')).toEqual('Lector01');

    expect(httpRequest.request.headers.has('rolroleiro')).toBeTruthy();
    expect(httpRequest.request.headers.get('rolroleiro')).toEqual('Usuario');

    expect(httpRequest.request.headers.has('authorization')).toBeTruthy();
    expect(httpRequest.request.headers.get('authorization')).toEqual('Bearer tocotom-tocotom-pom-pom');

    // Responde con datos simulados
    httpRequest.flush(testData);
  });
});
