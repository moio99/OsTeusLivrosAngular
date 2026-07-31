import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ListadoColeconsComponent } from './listado-colecons.component';
import { ColeconsService } from '../../../core/services/api/colecons.service';
import { LayoutService } from '../../../core/services/flow/layout.service';

describe('ListadoColeconsComponent', () => {
  let component: ListadoColeconsComponent;
  let fixture: ComponentFixture<ListadoColeconsComponent>;
  let coleconsServiceMock: jest.Mocked<ColeconsService>;
  let layoutServiceMock: jest.Mocked<LayoutService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    coleconsServiceMock = {
      getListadoCosLivros: jest.fn(),
      setListadoCosLivros: jest.fn(),
      borrar: jest.fn(),
    } as unknown as jest.Mocked<ColeconsService>;

    // default return so ngOnInit won't fail during detectChanges
    coleconsServiceMock.getListadoCosLivros.mockReturnValue(of({ data: [], meta: {} } as any));

    layoutServiceMock = {
      amosarInfo: jest.fn()
    } as unknown as jest.Mocked<LayoutService>;

    routerMock = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ListadoColeconsComponent],
      providers: [
        { provide: ColeconsService, useValue: coleconsServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoColeconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should load listado and call cache and show info', () => {
    const data = { data: [{ id: '1', nome: 'C1', quantidadeLivros: 0 }], meta: {} } as any;
    coleconsServiceMock.getListadoCosLivros.mockReturnValueOnce(of(data));

    component.ngOnInit();

    expect(coleconsServiceMock.getListadoCosLivros).toHaveBeenCalled();
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({ tipo: expect.any(Number), mensagem: expect.stringContaining('registros obtidos') }));
    expect(coleconsServiceMock.setListadoCosLivros).toHaveBeenCalledWith(data);
    expect(component.listadoDados()).toEqual(data.data);
  });

  it('ngOnInit should show error when service fails', () => {
    coleconsServiceMock.getListadoCosLivros.mockReturnValueOnce(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({
      tipo: expect.any(Number),
      mensagem: 'Nom se puiderom obter as coleçons.'
    }));
  });

  it('onBorrar should delete item when no livros and confirm true', () => {
    const initial = [{ id: '1', nome: 'C1', quantidadeLivros: 0 } as any];
    component.listadoDados.set(initial);

    (window as any).confirm = jest.fn().mockReturnValue(true);
    (global as any).confirm = (window as any).confirm;
    coleconsServiceMock.borrar.mockReturnValueOnce(of({ idResult: '1' } as any));

    component.onBorrar('1', 'C1', 0);

    expect(coleconsServiceMock.borrar).toHaveBeenCalledWith('1');
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({ tipo: expect.any(Number), mensagem: 'Coleçom borrada correctamente' }));
    expect(component.listadoDados()).toEqual([]);
  });

  it('onBorrar should show warning when livros > 0', () => {
    component.listadoDados.set([]);
    (window as any).alert = jest.fn();

    component.onBorrar('1', 'C1', 2);

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({ tipo: expect.any(Number), mensagem: expect.stringContaining('Nom se puede borrar') }));
    expect((window as any).alert).toHaveBeenCalled();
  });

  it('onIrPagina should navigate and clear messages', () => {
    component.onIrPagina('/colecom', '1');

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/colecom?id=1');
  });
});
