import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Estrela } from './estrelas-pontuacom.interface';
import { EstrelaComponent } from './estrela/estrela.component';
import { EstrelasPontuacomComponent } from './estrelas-pontuacom.component';

describe('EstrelasPontuacomComponent', () => {
  let component: EstrelasPontuacomComponent;
  let fixture: ComponentFixture<EstrelasPontuacomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstrelasPontuacomComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstrelasPontuacomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear e amosar dez estrelas enteiras e nove medias', () => {
    expect(component).toBeTruthy();
    expect(component.estrelas()).toHaveLength(19);
    expect(fixture.debugElement.queryAll(By.directive(EstrelaComponent))).toHaveLength(19);
    expect(fixture.nativeElement.querySelector('.bloco-numero').textContent.trim()).toBe('0');
  });

  it('debería crear os valores das estrelas enteiras e medias en orde', () => {
    expect(component.estrelas().map((estrela) => estrela.numero)).toEqual([
      1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5,
      6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10,
    ]);
  });

  it('debería inicializar a puntuación seleccionada co valor da entrada pontuacom', () => {
    fixture.componentRef.setInput('pontuacom', 3.5);
    fixture.detectChanges();

    expect(component.novaPontuacom()).toBe(3.5);
    expect(component.numeroActual()).toBe(3.5);
    expect(component.estrelas().filter((estrela) => estrela.marcada).map((estrela) => estrela.numero))
      .toEqual([1, 1.5, 2, 2.5, 3, 3.5]);
    expect(fixture.nativeElement.querySelector('.bloco-numero').textContent.trim()).toBe('3.5');
  });

  it('debería actualizar a puntuación seleccionada cando cambia a entrada pontuacom', () => {
    fixture.componentRef.setInput('pontuacom', 2);
    fixture.detectChanges();
    component.onEstavelecerPontuacom(8);

    fixture.componentRef.setInput('pontuacom', 4.5);
    fixture.detectChanges();

    expect(component.novaPontuacom()).toBe(4.5);
    expect(component.numeroActual()).toBe(4.5);
  });

  it('debería previsualizar a puntuación durante a simulación e restaurala ao limpala', () => {
    fixture.componentRef.setInput('pontuacom', 2);
    fixture.detectChanges();

    const estrelaSimulada: Estrela = { numero: 4.5, marcada: true };
    component.onSimulacom(estrelaSimulada);
    fixture.detectChanges();

    expect(component.numeroActual()).toBe(4.5);
    expect(fixture.nativeElement.querySelector('.bloco-numero').textContent.trim()).toBe('4.5');
    expect(component.estrelas().filter((estrela) => estrela.marcada).map((estrela) => estrela.numero))
      .toEqual([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5]);

    component.onSimulacom(undefined);
    fixture.detectChanges();

    expect(component.numeroActual()).toBe(2);
    expect(fixture.nativeElement.querySelector('.bloco-numero').textContent.trim()).toBe('2');
  });

  it('debería actualizar e emitir a puntuación seleccionada ao seleccionar unha estrela filla', () => {
    const emitSpy = jest.spyOn(component.numero, 'emit');
    const primeiraEstrela = fixture.debugElement.query(By.directive(EstrelaComponent))
      .componentInstance as EstrelaComponent;

    primeiraEstrela.estavelecerPontuacomEvent.emit(6.5);
    fixture.detectChanges();

    expect(component.novaPontuacom()).toBe(6.5);
    expect(component.numeroActual()).toBe(6.5);
    expect(emitSpy).toHaveBeenCalledWith(6.5);
  });
});
