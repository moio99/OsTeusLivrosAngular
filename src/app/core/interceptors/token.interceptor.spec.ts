import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { tokenInterceptor } from './token.interceptor'; // Axusta a ruta do teu ficheiro
import { AuthService } from '../services/flow/auth.service';

describe('tokenInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(() => {
    // 1. Crear un mock do AuthService para controlar o que devolve en cada test
    authServiceMock = {
      getToken: jest.fn(),
      getUsuarioLogado: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        // Inxectar o mock en lugar do servizo real
        { provide: AuthService, useValue: authServiceMock },
        // Configurar HttpClient cos interceptores funcionais
        provideHttpClient(withInterceptors([tokenInterceptor])),
        // Provedor necesario para usar HttpTestingController
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificar que non queden peticións HTTP sen responder entre test e test
    httpMock.verify();
  });

  it('debe engadir as cabeceiras se hai token e usuario logueado', () => {
    // Configurar o mock para que simule un usuario conectado
    authServiceMock.getToken.mockReturnValue('meu-token-jwt');
    authServiceMock.getUsuarioLogado.mockReturnValue({ nome: 'André', id: 42, idioma: 3 });

    // Facer unha petición HTTP de proba
    httpClient.get('/api/datos').subscribe();

    // Interceptar a petición simulada
    const req = httpMock.expectOne('/api/datos');

    // Verificar que as cabeceiras modificadas se engadiron correctamente
    expect(req.request.headers.get('usuarinho')).toBe('André');
    expect(req.request.headers.get('rolroleiro')).toBe('42'); // Comproba que se pasou a String
    expect(req.request.headers.get('authorization')).toBe('Bearer meu-token-jwt');

    // Responder á petición para pechar o fluxo
    req.flush({});
  });

  it('NON debe modificar as cabeceiras se o token é undefined', () => {
    // Caso: Usuario non autenticado
    authServiceMock.getToken.mockReturnValue(undefined);
    authServiceMock.getUsuarioLogado.mockReturnValue(undefined);

    httpClient.get('/api/datos').subscribe();

    const req = httpMock.expectOne('/api/datos');

    // Verificar que ningunha das cabeceiras especiais existe na petición
    expect(req.request.headers.has('usuarinho')).toBeFalsy();
    expect(req.request.headers.has('rolroleiro')).toBeFalsy();
    expect(req.request.headers.has('authorization')).toBeFalsy();

    req.flush({});
  });

  it('NON debe modificar as cabeceiras se o token existe pero o usuario é undefined', () => {
    // Caso estraño/inconsistente: hai token pero non obxecto de usuario
    authServiceMock.getToken.mockReturnValue('meu-token-jwt');
    authServiceMock.getUsuarioLogado.mockReturnValue(undefined);

    httpClient.get('/api/datos').subscribe();

    const req = httpMock.expectOne('/api/datos');

    expect(req.request.headers.has('authorization')).toBeFalsy();

    req.flush({});
  });
});
