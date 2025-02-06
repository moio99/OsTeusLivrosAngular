import { TestBed } from '@angular/core/testing';
import {
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { of } from 'rxjs';
import { CarregandoInterceptor } from './carregando.interceptor';
import { CarregandoService } from '../services/tools/carregando.service';

describe('CarregandoInterceptor', () => {
  let interceptor: CarregandoInterceptor;
  let carregandoService: jest.Mocked<CarregandoService>;
  let httpHandler: jest.Mocked<HttpHandler>;

  beforeEach(() => {
    // Mockear el CarregandoService
    carregandoService = {
      amosar: jest.fn(),
      ocultar: jest.fn(),
    } as any;

    // Mockear el HttpHandler
    httpHandler = {
      handle: jest.fn().mockReturnValue(of(new HttpResponse({ status: 200 }))),
    } as any;

    // Configurar el interceptor
    TestBed.configureTestingModule({
      providers: [
        CarregandoInterceptor,
        { provide: CarregandoService, useValue: carregandoService },
      ],
    });

    interceptor = TestBed.inject(CarregandoInterceptor);
  });

  it('debería crear el interceptor', () => {
    expect(interceptor).toBeTruthy();
  });

  it('debería llamar a amosar() al iniciar una solicitud', () => {
    const req = new HttpRequest('GET', '/api/data');

    interceptor.intercept(req, httpHandler).subscribe();

    // Verificar que amosar() fue llamado
    expect(carregandoService.amosar).toHaveBeenCalled();
  });

  it('debería llamar a ocultar() al finalizar una solicitud', () => {
    const req = new HttpRequest('GET', '/api/data');

    interceptor.intercept(req, httpHandler).subscribe();

    // Verificar que ocultar() fue llamado
    expect(carregandoService.ocultar).toHaveBeenCalled();
  });

  it('debería manejar la solicitud HTTP correctamente', () => {
    const req = new HttpRequest('GET', '/api/data');
    const mockResponse = new HttpResponse({ status: 200 });

    httpHandler.handle.mockReturnValue(of(mockResponse));

    interceptor.intercept(req, httpHandler).subscribe((event) => {
      expect(event).toEqual(mockResponse); // Verificar que la respuesta es correcta
    });

    // Verificar que handle() fue llamado
    expect(httpHandler.handle).toHaveBeenCalledWith(req);
  });

  it('debería llamar a ocultar() incluso si la solicitud falla', () => {
    const req = new HttpRequest('GET', '/api/data');
    const mockError = new Error('Error en la solicitud');

    httpHandler.handle.mockReturnValue(of(new HttpResponse({ status: 500 })));

    interceptor.intercept(req, httpHandler).subscribe({
      error: () => {
        // Verificar que ocultar() fue llamado incluso en caso de error
        expect(carregandoService.ocultar).toHaveBeenCalled();
      },
    });
  });
});
