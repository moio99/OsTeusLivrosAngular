import { OrdeColunaComponent } from './orde-coluna.component';
import { TestBed } from '@angular/core/testing';

describe('OrdeColunaComponent', () => {
  let component: OrdeColunaComponent;

  beforeEach(() => {
    // Configurar el módulo de pruebas
    TestBed.configureTestingModule({
      // declarations: [OrdeColunaComponent]  nom por que é standalone
      imports: [ OrdeColunaComponent ],
    });

    // Crear una instancia del componente
    component = TestBed.createComponent(OrdeColunaComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set valorInverso and call amosarResultado when inverso input changes', () => {
    const amosarResultadoSpy = jest.spyOn(component as any, 'amosarResultado');
    component.inverso = true;
    expect(component.valorInverso).toBe(true);
    expect(amosarResultadoSpy).toHaveBeenCalled();
  });

  it('should set valorInverso and call amosarResultado when inverso input changes', () => {
    const amosarResultadoSpy = jest.spyOn(component as any, 'amosarResultado');
    component.inverso = true;
    expect(component.valorInverso).toBe(true);
    expect(amosarResultadoSpy).toHaveBeenCalled();
  });

  it('should update caracter based on valorActual and valorInverso', () => {
    component.nome = 'columna';
    component.abcd = '↓';
    component.dcba = '↑';

    // caso 1: valorActual coincide con nome y valorInverso es true
    component.valorActual = 'columna';
    component.valorInverso = true;
    component['amosarResultado']();
    expect(component.caracter).toBe('↑');

    // caso 2: valorActual coincide con nome y valorInverso es false
    component.valorInverso = false;
    component['amosarResultado']();
    expect(component.caracter).toBe('↓');

    // caso 3: valorActual no coincide con nome
    component.valorActual = 'otraColumna';
    component['amosarResultado']();
    expect(component.caracter).toBe('');
  });
});
