import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ListadoGenerosComponent } from './listado-generos.component';
import { GenerosService } from '../../../core/services/api/generos.service';
import { LayoutService } from '../../../core/services/flow/layout.service';

describe('ListadoGenerosComponent', () => {
  let component: ListadoGenerosComponent;
  let fixture: ComponentFixture<ListadoGenerosComponent>;
  let generosServiceMock: jest.Mocked<GenerosService>;
  let layoutServiceMock: jest.Mocked<LayoutService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    generosServiceMock = {
      getListadoCosLivros: jest.fn(),
      setListadoCosLivros: jest.fn(),
      borrar: jest.fn(),
    } as unknown as jest.Mocked<GenerosService>;

    // default return so ngOnInit won't fail during detectChanges
    generosServiceMock.getListadoCosLivros.mockReturnValue(of({ data: [], meta: {} } as any));

    layoutServiceMock = {
      amosarInfo: jest.fn()
    } as unknown as jest.Mocked<LayoutService>;

    routerMock = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ListadoGenerosComponent],
      providers: [
        { provide: GenerosService, useValue: generosServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoGenerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should load listado and call cache and show info', () => {
    const data = { data: [
      { id: '1', nome: 'G1', quantidadeLivros: 0, quantidadeLidos: 0 },
    ], meta: {} } as any;
    generosServiceMock.getListadoCosLivros.mockReturnValueOnce(of(data));

    component.ngOnInit();

    expect(generosServiceMock.getListadoCosLivros).toHaveBeenCalled();
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({ tipo: expect.any(Number), mensagem: expect.stringContaining('registros obtidos') }));
    expect(generosServiceMock.setListadoCosLivros).toHaveBeenCalledWith(data);
    expect(component.listadoDados()).toEqual(data.data);
  });

  it('ngOnInit should show error when service fails', () => {
    generosServiceMock.getListadoCosLivros.mockReturnValueOnce(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({
      tipo: expect.any(Number),
      mensagem: 'Nom se puiderom obter as editoriais.'
    }));
  });

  it('onBorrar should delete item when no livros and confirm true', () => {
    const initial = [{ id: '1', nome: 'G1', quantidadeLivros: 0 } as any];
    component.listadoDados.set(initial);

    (window as any).confirm = jest.fn().mockReturnValue(true);
    (global as any).confirm = (window as any).confirm;
    generosServiceMock.borrar.mockReturnValueOnce(of({ idResult: '1' } as any));

    component.onBorrar('1', 'G1', 0);

    expect(generosServiceMock.borrar).toHaveBeenCalledWith('1');
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({ tipo: expect.any(Number), mensagem: 'Género borrada correctamente' }));
    expect(component.listadoDados()).toEqual([]);
  });

  it('onBorrar should show warning when livros > 0', () => {
    component.listadoDados.set([]);
    (window as any).alert = jest.fn();

    component.onBorrar('1', 'G1', 2);

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({ tipo: expect.any(Number), mensagem: expect.stringContaining('Nom se puede borrar') }));
    expect((window as any).alert).toHaveBeenCalled();
  });

  it('ordeAlfabetico should sort by nome', () => {
    const initial = [
      { id: '1', nome: 'b', quantidadeLivros: 1, quantidadeLidos: 0 } as any,
      { id: '2', nome: 'a', quantidadeLivros: 2, quantidadeLidos: 1 } as any,
      { id: '3', nome: 'c', quantidadeLivros: 0, quantidadeLidos: 0 } as any,
    ];
    component.listadoDados.set(initial);

    component.ordeAlfabetico();

    // first call toggles `inverso` to true (component starts with tipoOrdeacom == nomeAlfabetico)
    expect(component.listadoDados().map(x => x.nome)).toEqual(['c','b','a']);

    component.ordeAlfabetico(); // toggle inverso -> ascending
    expect(component.listadoDados().map(x => x.nome)).toEqual(['a','b','c']);
  });

  it('ordeNumeroLivros should sort by quantidadeLivros', () => {
    const initial = [
      { id: '1', nome: 'b', quantidadeLivros: 1, quantidadeLidos: 0 } as any,
      { id: '2', nome: 'a', quantidadeLivros: 3, quantidadeLidos: 1 } as any,
      { id: '3', nome: 'c', quantidadeLivros: 2, quantidadeLidos: 0 } as any,
    ];
    component.listadoDados.set(initial);

    component.ordeNumeroLivros();
    expect(component.listadoDados().map(x => x.quantidadeLivros)).toEqual([1,2,3]);

    component.ordeNumeroLivros();
    expect(component.listadoDados().map(x => x.quantidadeLivros)).toEqual([3,2,1]);
  });

  it('ordeNumeroLivrosLidos should sort by quantidadeLidos', () => {
    const initial = [
      { id: '1', nome: 'b', quantidadeLivros: 1, quantidadeLidos: 5 } as any,
      { id: '2', nome: 'a', quantidadeLivros: 3, quantidadeLidos: 1 } as any,
      { id: '3', nome: 'c', quantidadeLivros: 2, quantidadeLidos: 2 } as any,
    ];
    component.listadoDados.set(initial);

    component.ordeNumeroLivrosLidos();
    expect(component.listadoDados().map(x => x.quantidadeLidos)).toEqual([1,2,5]);

    component.ordeNumeroLivrosLidos();
    expect(component.listadoDados().map(x => x.quantidadeLidos)).toEqual([5,2,1]);
  });

  it('onIrPagina should navigate and clear messages', () => {
    component.onIrPagina('/genero', '1');

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/genero?id=1');
  });
});
