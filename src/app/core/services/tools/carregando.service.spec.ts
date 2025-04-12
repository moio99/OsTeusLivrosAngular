import { CarregandoService } from './carregando.service';

describe('CarregandoService', () => {
  let service: CarregandoService;

  beforeEach(() => {
    // Configurar el servicio
    service = new CarregandoService();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería tener un valor inicial de false en carregando$', (done) => {
    // Suscribirse al observable para verificar su valor
    service.carregando$.subscribe((valor) => {
      expect(valor).toBe(false); // Verificar que el valor inicial es false
      done();
    });
  });

  it('debería cambiar carregando$ a true cuando se llama a amosar()', (done) => {
    // Llamar al método amosar
    service.amosar();

    // Suscribirse al observable para verificar su valor
    service.carregando$.subscribe((valor) => {
      expect(valor).toBe(true); // Verificar que el valor es true
      done();
    });
  });

  it('debería cambiar carregando$ a false cuando se llama a ocultar()', (done) => {
    // Primero, cambiar el valor a true.
    service.amosar();

    // Luego, llamar al método ocultar
    service.ocultar();

    // Suscribirse al observable para verificar su valor
    service.carregando$.subscribe((valor) => {
      expect(valor).toBe(false); // Verificar que el valor es false
      done();
    });
  });
});
