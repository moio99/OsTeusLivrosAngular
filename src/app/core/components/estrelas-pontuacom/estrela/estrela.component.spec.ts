import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstrelaComponent } from './estrela.component';
import { Estrela } from '../estrelas-pontuacom.interface';

describe('EstrelaComponent', () => {
  let component: EstrelaComponent;
  let fixture: ComponentFixture<EstrelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // declarations: [EstrelaComponent]     nom por que é standalone
      imports: [ EstrelaComponent ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstrelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update imagemAmosar when simulandoPontuacom changes', () => {
    const estrelaData: Estrela = { numero: 3, marcada: true };

    // Test when dadosSM is defined and numero is greater than or equal to component numero
    component.numero = 2;
    component.simulandoPontuacom = estrelaData;
    expect(component.imagemAmosar).toBe(component.estrelaVermelha);

    // Test when dadosSM is defined and numero is less than component numero
    component.numero = 4;
    component.simulandoPontuacom = estrelaData;
    expect(component.imagemAmosar).toBe(component.estrelaBranca);

    // Test when dadosSM is undefined
    component.simulandoPontuacom = undefined;
    expect(component.imagemAmosar).toBe(component.imagemOriginal);
  });

  it('should update imagemOriginal and imagemAmosar when estavelecerNonovaPontuacom changes', () => {
    // Test when novoNumero is defined and greater than or equal to component numero
    component.numero = 2;
    component.estavelecerNonovaPontuacom = 3;
    expect(component.imagemOriginal).toBe(component.estrelaVermelha);
    expect(component.imagemAmosar).toBe(component.estrelaVermelha);

    // Test when novoNumero is defined and less than component numero
    component.numero = 4;
    component.estavelecerNonovaPontuacom = 3;
    expect(component.imagemOriginal).toBe(component.estrelaBranca);
    expect(component.imagemAmosar).toBe(component.estrelaBranca);

    // Test when novoNumero is undefined
    component.estavelecerNonovaPontuacom = undefined;
    expect(component.imagemOriginal).toBe(component.estrelaBranca);
    expect(component.imagemAmosar).toBe(component.estrelaBranca);
  });

  it('should emit simulacomEvent on entrouORato', () => {
    const emitSpy = jest.spyOn(component.simulacomEvent, 'emit');

    component.numero = 3;
    component.entrouORato();
    expect(emitSpy).toHaveBeenCalledWith({ numero: 3, marcada: true });

    component.numero = -1;
    component.entrouORato();
    expect(emitSpy).not.toHaveBeenCalledWith({ numero: -1, marcada: true });
  });

  it('should emit simulacomEvent with undefined on saiuORato', () => {
    const emitSpy = jest.spyOn(component.simulacomEvent, 'emit');
    component.saiuORato();
    expect(emitSpy).toHaveBeenCalledWith(undefined);
  });

  it('should emit estavelecerPontuacomEvent on ratoPicou', () => {
    const emitSpy = jest.spyOn(component.estavelecerPontuacomEvent, 'emit');
    component.numero = 5;
    component.ratoPicou();
    expect(emitSpy).toHaveBeenCalledWith(5);
  });
});


/* import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstrelaComponent } from './estrela.component';

describe('EstrelaComponent', () => {
  let component: EstrelaComponent;
  let fixture: ComponentFixture<EstrelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstrelaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstrelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 */
