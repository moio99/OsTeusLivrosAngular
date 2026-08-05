import { TestBed } from '@angular/core/testing';
import { CarregandoService } from './carregando.service'; // Axusta a ruta do ficheiro
import { take } from 'rxjs/operators';

describe('CarregandoService', () => {
  let service: CarregandoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarregandoService]
    });
    service = TestBed.inject(CarregandoService);
  });

  it('debe iniciarse co estado en false', (done) => {
    // Verificamos o valor inicial do Observable
    service.carregando$.pipe(take(1)).subscribe((estado) => {
      expect(estado).toBeFalsy();
      done();
    });
  });

  it('debe cambiar o estado a true ao chamar a amosar()', (done) => {
    service.amosar();

    service.carregando$.pipe(take(1)).subscribe((estado) => {
      expect(estado).toBeTruthy();
      done();
    });
  });

  it('debe manter o estado en true se hai varias peticións e só emitir unha vez', () => {
    // Creamos un espía (spy) sobre o método next do Subject interno para contar as emisións.
    // Como carregandoSubject é privado, accedemos a el de forma indirecta escoitando o observable.
    const valoresEmitidos: boolean[] = [];
    const sub = service.carregando$.subscribe(val => valoresEmitidos.push(val));

    // Estado inicial xa engadiu 'false' ao array (valoresEmitidos = [false])

    service.amosar(); // Petición 1: Pasa a true (valoresEmitidos = [false, true])
    service.amosar(); // Petición 2: Non debe emitir nada novo porque xa está a true
    service.amosar(); // Petición 3: Tampouco debe emitir

    // Verificamos que só se emitiu o 'true' da primeira petición
    expect(valoresEmitidos).toEqual([false, true]);

    sub.unsubscribe();
  });

  it('debe ocultar o spinner só cando TODAS as peticións rematen', () => {
    const valoresEmitidos: boolean[] = [];
    const sub = service.carregando$.subscribe(val => valoresEmitidos.push(val));

    // Simulamos 2 peticións simultáneas
    service.amosar(); // Petición 1 activa o spinner
    service.amosar(); // Petición 2 mantén o spinner

    // Simulamos que remata a primeira petición
    service.ocultar();
    // O spinner DEBE seguir activo (true) porque queda 1 petición pendente
    expect(valoresEmitidos[valoresEmitidos.length - 1]).toBeTruthy();

    // Simulamos que remata a segunda petición
    service.ocultar();
    // Agora que o contador chegou a 0, o último valor debe ser false
    expect(valoresEmitidos[valoresEmitidos.length - 1]).toBeFalsy();
    expect(valoresEmitidos).toEqual([false, true, false]);

    sub.unsubscribe();
  });

  it('debe protexer o contador contra valores negativos se se chama a ocultar() de máis', (done) => {
    // Chamamos a ocultar sen ter ningunha petición activa
    service.ocultar();
    service.ocultar();

    // O estado debe seguir sendo false e o contador interno reseteado a 0
    service.carregando$.pipe(take(1)).subscribe((estado) => {
      expect(estado).toBeFalsy();
    });

    // Se despois disto entra unha petición nova, debe funcionar correctamente desde cero
    service.amosar();
    service.carregando$.pipe(take(1)).subscribe((estado) => {
      expect(estado).toBeTruthy();
      done();
    });
  });
});
