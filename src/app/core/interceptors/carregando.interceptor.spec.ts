import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { carregandoInterceptor } from './carregando.interceptor'; // Axusta a ruta do teu ficheiro
import { CarregandoService } from '../services/tools/carregando.service';

describe('carregandoInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let carregandoServiceMock: jest.Mocked<CarregandoService>;

  beforeEach(() => {
    // 1. Crear un mock do CarregandoService con Jest
    carregandoServiceMock = {
      amosar: jest.fn(),
      ocultar: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        // Substituír o servizo real polo noso mock controlado
        { provide: CarregandoService, useValue: carregandoServiceMock },
        // Configurar HttpClient co interceptor funcional de carga
        provideHttpClient(withInterceptors([carregandoInterceptor])),
        // Provedor para simular e controlar as respostas HTTP
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Asegurar que non quedan peticións pendentes
    httpMock.verify();
  });

  it('debe chamar a amosar() ao iniciar a petición e a ocultar() ao finalizar con éxito', () => {
    // 1. Lanzamos a petición HTTP (é asíncrona, polo que aínda non se completou)
    httpClient.get('/api/test').subscribe();

    // VERIFICACIÓN 1: O spinner debe amosarse de inmediato
    expect(carregandoServiceMock.amosar).toHaveBeenCalledTimes(1);
    // O spinner NON debe ocultarse aínda porque a petición segue en curso
    expect(carregandoServiceMock.ocultar).not.toHaveBeenCalled();

    // 2. Simulamos que o servidor responde con éxito (completa a petición)
    const req = httpMock.expectOne('/api/test');
    req.flush({ data: 'ok' });

    // VERIFICACIÓN 2: Unha vez completada, finalize debe chamar a ocultar()
    expect(carregandoServiceMock.ocultar).toHaveBeenCalledTimes(1);
  });

  it('debe chamar a ocultar() tamén se a petición falla con un erro', () => {
    // 1. Lanzamos a petición (manexamos o erro no subscribe para que o test non falle)
    httpClient.get('/api/test-error').subscribe({
      error: () => {}
    });

    // O spinner amósase ao arrincar
    expect(carregandoServiceMock.amosar).toHaveBeenCalledTimes(1);
    expect(carregandoServiceMock.ocultar).not.toHaveBeenCalled();

    // 2. Simulamos un erro de rede ou de servidor (500 Internal Server Error)
    const req = httpMock.expectOne('/api/test-error');
    req.flush('Erro no servidor', { status: 500, statusText: 'Server Error' });

    // VERIFICACIÓN: O operador finalize debe asegurar que ocultar() se executa igual
    expect(carregandoServiceMock.ocultar).toHaveBeenCalledTimes(1);
  });
});
