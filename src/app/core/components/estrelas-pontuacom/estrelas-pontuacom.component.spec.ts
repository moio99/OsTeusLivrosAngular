import { EstrelasPontuacomComponent } from './estrelas-pontuacom.component';
import { TestBed } from '@angular/core/testing';

describe('EstrelasPontuacomComponent', () => {
  let component: EstrelasPontuacomComponent;

  beforeEach(() => {
    // Configurar el módulo de pruebas
    TestBed.configureTestingModule({
      //declarations: [EstrelasPontuacomComponent]  nom por que é standalone
      imports: [ EstrelasPontuacomComponent ],
    });

    // Crear una instancia del componente
    component = TestBed.createComponent(EstrelasPontuacomComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.cantidade).toBe(10);
    expect(component.estrelas.length).toBe(0);
    expect(component.numeroActual).toBe(0);
    expect(component.novaPontuacom).toBeUndefined();
    expect(component.estrelaSimulando).toBeUndefined();
  });

  it('should initialize estrelas correctly when pontuacom is provided', () => {
    component.pontuacom = 5;
    component.ngOnInit();

    expect(component.estrelas.length).toBe(19);
    expect(component.estrelas[0].marcada).toBe(false);
    expect(component.estrelas[10].marcada).toBe(false);
    expect(component.numeroActual).toBe(0);
  });

  it('should update numeroActual and estrelaSimulando on onSimulacom', () => {
    const estrelaDados = { numero: 3, marcada: true };
    component.onSimulacom(estrelaDados);

    expect(component.estrelaSimulando).toEqual(estrelaDados);
    expect(component.numeroActual).toBe(3);
  });

  it('should reset numeroActual to novaPontuacom when estrelaDados is undefined', () => {
    component.novaPontuacom = 7;
    component.onSimulacom(undefined);

    expect(component.numeroActual).toBe(7);
    expect(component.estrelaSimulando).toBeUndefined();
  });

  it('should update pontuacom and emit numero on onEstavelecerPontuacom', () => {
    const emitSpy = jest.spyOn(component.numero, 'emit');

    component.ngOnInit();

    component.onEstavelecerPontuacom(4);

    expect(component.novaPontuacom).toBe(4);
    expect(component.estrelas[0].marcada).toBe(true); // Primera estrella marcada
    expect(component.estrelas[8].marcada).toBe(false); // Estrella 4.5 no marcada
    expect(emitSpy).toHaveBeenCalledWith(4);
  });

  it('should handle pontuacom setter correctly', () => {
    component.pontuacom = 6;
    expect(component.novaPontuacom).toBe(6);
    expect(component.numeroActual).toBe(6);

    component.pontuacom = undefined;
    expect(component.novaPontuacom).toBeUndefined();
    expect(component.numeroActual).toBe(0);
  });
});
