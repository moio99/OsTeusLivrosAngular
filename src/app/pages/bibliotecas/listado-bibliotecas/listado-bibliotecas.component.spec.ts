import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ListadoBibliotecasComponent } from './listado-bibliotecas.component';
import { BibliotecasService } from '../../../core/services/api/bibliotecas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { ListadoBibliotecas } from '../../../core/models/listado-bibliotecas.interface';

describe('ListadoBibliotecasComponent', () => {
  let component: ListadoBibliotecasComponent;
  let fixture: ComponentFixture<ListadoBibliotecasComponent>;
  let bibliotecasServiceMock: jest.Mocked<BibliotecasService>;
  let layoutServiceMock: jest.Mocked<LayoutService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    bibliotecasServiceMock = {
      getListadoCosLivros: jest.fn(),
      setListadoCosLivros: jest.fn(),
      borrar: jest.fn(),
    } as unknown as jest.Mocked<BibliotecasService>;

    // default return so ngOnInit won't fail during detectChanges
    bibliotecasServiceMock.getListadoCosLivros.mockReturnValue(of({ data: [], meta: {} } as any));

    layoutServiceMock = {
      amosarInfo: jest.fn()
    } as unknown as jest.Mocked<LayoutService>;

    routerMock = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ListadoBibliotecasComponent],
      providers: [
        { provide: BibliotecasService, useValue: bibliotecasServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoBibliotecasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should load listado and call cache and show info', () => {
    const data = { data: [{ id: '1', nome: 'B1', quantidadeLivros: 0 }], meta: {} } as any;
    bibliotecasServiceMock.getListadoCosLivros.mockReturnValueOnce(of(data));

    component.ngOnInit();

    expect(bibliotecasServiceMock.getListadoCosLivros).toHaveBeenCalled();
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({ tipo: expect.any(Number), mensagem: expect.stringContaining('registros obtidos') }));
    expect(bibliotecasServiceMock.setListadoCosLivros).toHaveBeenCalledWith(data);
    expect(component.listadoDados()).toEqual(data.data);
  });

  it('ngOnInit should show error when service fails', () => {
    bibliotecasServiceMock.getListadoCosLivros.mockReturnValueOnce(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({
      tipo: expect.any(Number),
      mensagem: 'Nom se puiderom obter as bibliotecas.'
    }));
  });

  it('onBorrar should delete item when no livros and confirm true', () => {
    const initial = [{ id: '1', nome: 'B1', quantidadeLivros: 0 } as any];
    component.listadoDados.set(initial);

    (window as any).confirm = jest.fn().mockReturnValue(true);
    (global as any).confirm = (window as any).confirm;
    bibliotecasServiceMock.borrar.mockReturnValueOnce(of({ idResult: '1' } as any));

    component.onBorrar('1', 'B1', 0);

    expect(bibliotecasServiceMock.borrar).toHaveBeenCalledWith('1');
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({ tipo: expect.any(Number), mensagem: 'Biblioteca borrada correctamente' }));
    expect(component.listadoDados()).toEqual([]);
  });

  it('onBorrar should show warning when livros > 0', () => {
    component.listadoDados.set([]);
    (window as any).alert = jest.fn();

    component.onBorrar('1', 'B1', 2);

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({ tipo: expect.any(Number), mensagem: expect.stringContaining('Nom se puede borrar') }));
    expect((window as any).alert).toHaveBeenCalled();
  });

  it('onIrPagina should navigate and clear messages', () => {
    component.onIrPagina('/biblioteca', '1');

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/biblioteca?id=1');
  });
});
