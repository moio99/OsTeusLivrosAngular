import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment, environments } from '../../../../../environments/environment';
import { Estrela } from '../estrelas-pontuacom.interface';
import { EstrelaComponent } from './estrela.component';

describe('EstrelaComponent', () => {
  let component: EstrelaComponent;
  let fixture: ComponentFixture<EstrelaComponent>;
  let ambienteOrixinal: environments;

  beforeEach(async () => {
    ambienteOrixinal = environment.whereIAm;
    await TestBed.configureTestingModule({
      imports: [EstrelaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstrelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    environment.whereIAm = ambienteOrixinal;
  });

  it('debería crear o compoñente e amosar os valores por defecto', () => {
    expect(component).toBeTruthy();
    expect(component.numero()).toBe(-1);
    expect(component.imagemOriginal()).toBe(component.estrelaBranca);
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe(component.estrelaBranca);
    expect(fixture.nativeElement.querySelector('img').getAttribute('alt')).toBe('-1');
  });

  it('debería amosar a estrela vermella cando a puntuación seleccionada a abrangue', () => {
    fixture.componentRef.setInput('numero', 3);
    fixture.componentRef.setInput('estavelecerNovaPontuacom', 3);
    fixture.detectChanges();

    expect(component.imagemOriginal()).toBe(component.estrelaVermelha);
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe(component.estrelaVermelha);
  });

  it('debería amosar a estrela branca cando a puntuación seleccionada non a abrangue', () => {
    fixture.componentRef.setInput('numero', 4);
    fixture.componentRef.setInput('estavelecerNovaPontuacom', 3.5);
    fixture.detectChanges();

    expect(component.imagemOriginal()).toBe(component.estrelaBranca);
    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe(component.estrelaBranca);
  });

  it('debería previsualizar a puntuación simulada e recuperar a imaxe orixinal ao limpala', () => {
    fixture.componentRef.setInput('numero', 4);
    fixture.componentRef.setInput('estavelecerNovaPontuacom', 2);
    fixture.detectChanges();

    const simulacion: Estrela = { numero: 4.5, marcada: true };
    fixture.componentRef.setInput('simulandoPontuacom', simulacion);
    fixture.detectChanges();
    expect(component.imagemAmosar()).toBe(component.estrelaVermelha);

    fixture.componentRef.setInput('simulandoPontuacom', undefined);
    fixture.detectChanges();
    expect(component.imagemAmosar()).toBe(component.estrelaBranca);
  });

  it('debería aplicar a clase de imaxe ás estrelas de puntuación media', () => {
    fixture.componentRef.setInput('numero', 2.5);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img').classList).toContain('imagem');
  });

  it('debería emitir a estrela ao pasar o rato por riba dela', () => {
    const emitSpy = jest.spyOn(component.simulacomEvent, 'emit');
    fixture.componentRef.setInput('numero', 3);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.imagem-estrela')
      .dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    expect(emitSpy).toHaveBeenCalledWith({ numero: 3, marcada: true });
  });

  it('non debería emitir unha simulación para o número por defecto', () => {
    const emitSpy = jest.spyOn(component.simulacomEvent, 'emit');
    fixture.nativeElement.querySelector('.imagem-estrela')
      .dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('debería emitir undefined ao retirar o rato', () => {
    const emitSpy = jest.spyOn(component.simulacomEvent, 'emit');
    fixture.nativeElement.querySelector('.imagem-estrela')
      .dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));

    expect(emitSpy).toHaveBeenCalledWith(undefined);
  });

  it('debería emitir a puntuación ao facer clic na estrela', () => {
    const emitSpy = jest.spyOn(component.estavelecerPontuacomEvent, 'emit');
    fixture.componentRef.setInput('numero', 5);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.imagem-estrela')
      .dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(emitSpy).toHaveBeenCalledWith(5);
  });

  it('non debería emitir eventos en ambientes que non están permitidos', () => {
    const simulacomSpy = jest.spyOn(component.simulacomEvent, 'emit');
    const pontuacomSpy = jest.spyOn(component.estavelecerPontuacomEvent, 'emit');
    environment.whereIAm = environments.pro;
    fixture.componentRef.setInput('numero', 5);
    fixture.detectChanges();

    const elemento = fixture.nativeElement.querySelector('.imagem-estrela');
    elemento.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    elemento.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    elemento.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(simulacomSpy).not.toHaveBeenCalled();
    expect(pontuacomSpy).not.toHaveBeenCalled();
  });
});
