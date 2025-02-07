import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdeColunaComponent } from './orde-coluna.component';

describe('OrdeColunaComponent', () => {
  let component: OrdeColunaComponent;
  let fixture: ComponentFixture<OrdeColunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdeColunaComponent], // Importar el componente standalone
    }).compileComponents();

    fixture = TestBed.createComponent(OrdeColunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener valores iniciales correctos', () => {
    expect(component.abcd).toBe('↓');
    expect(component.dcba).toBe('↑');
    expect(component.nome).toBe('');
    expect(component.caracter).toBe('');
  });

  it('debería actualizar caracter cuando actual coincide con nome y inverso es false', () => {
    component.nome = 'columna1';
    component.actual = 'columna1'; // Llamar al setter de actual
    component.inverso = false; // Llamar al setter de inverso

    expect(component.caracter).toBe('↓');
  });

  it('debería actualizar caracter cuando actual coincide con nome y inverso es true', () => {
    component.nome = 'columna1';
    component.actual = 'columna1'; // Llamar al setter de actual
    component.inverso = true; // Llamar al setter de inverso

    expect(component.caracter).toBe('↑');
  });

  it('debería limpiar caracter cuando actual no coincide con nome', () => {
    component.nome = 'columna1';
    component.actual = 'columna2'; // Llamar al setter de actual
    component.inverso = false; // Llamar al setter de inverso

    expect(component.caracter).toBe('');
  });

  it('debería manejar cambios en actual e inverso correctamente', () => {
    component.nome = 'columna1';

    // Cambiar actual e inverso
    component.actual = 'columna1';
    component.inverso = true;
    expect(component.caracter).toBe('↑');

    // Cambiar solo inverso
    component.inverso = false;
    expect(component.caracter).toBe('↓');

    // Cambiar actual a un valor que no coincide
    component.actual = 'columna2';
    expect(component.caracter).toBe('');
  });
});
