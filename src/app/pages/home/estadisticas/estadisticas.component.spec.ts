import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EstadisticasComponent } from './estadisticas.component';
import { EstadisticasService } from '../../../core/services/api/estadisticas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { GraficosService } from '../../../core/services/api/graficos.service';
import { EstadisticasTipo, InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';

describe('EstadisticasComponent', () => {
  let component: EstadisticasComponent;
  let fixture: ComponentFixture<EstadisticasComponent>;
  let estadisticasServiceMock: jest.Mocked<EstadisticasService>;
  let layoutServiceMock: jest.Mocked<LayoutService>;
  let graficosServiceMock: jest.Mocked<GraficosService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    // Creamos mocks para los servicios
    estadisticasServiceMock = {
      getEstadisticas: jest.fn().mockReturnValue(of({ data: [{
        id: 1,
        nome: 'GAL',
        quantidade: 2,
        quantidadepaginas: 200,
        quantidadeRelecturas: 0}] })), // Valor por defecto (puedes ajustarlo según tus necesidades)
    } as any;

    layoutServiceMock = {
      amosarInfo: jest.fn(),
      unsubscribe: jest.fn()
    } as any;

    graficosServiceMock = {
      getGraficosPaginasPorIdiomaEAno: jest.fn(),
    } as any;

    routerMock = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      //declarations: [EstadisticasComponent],    Isto nom vale porque é standalone
      providers: [
        { provide: EstadisticasService, useValue: estadisticasServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: GraficosService, useValue: graficosServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and obtain statistics on ngOnInit', () => {
    const mockIdiomasData = { data: [{ nome: 'Inglés', quantidade: 5 }] };
    const mockAnosData = { data: [{ nome: '2020', quantidade: 10 }] };
    const mockGenerosData = { data: [{ nome: 'Ficción', quantidade: 15 }] };

    estadisticasServiceMock.getEstadisticas
      .mockReturnValueOnce(of(mockIdiomasData))
      .mockReturnValueOnce(of(mockAnosData))
      .mockReturnValueOnce(of(mockGenerosData));

    component.ngOnInit();

    expect(estadisticasServiceMock.getEstadisticas).toHaveBeenCalledTimes(3);
    expect(component.idiomasSignal()).toEqual(mockIdiomasData.data);
    expect(component.anosSignal()).toEqual(mockAnosData.data);
    expect(component.generosSignal()).toEqual(mockGenerosData.data);
  });

  it('should call unsubscribe on ngOnDestroy if layoutService exists', () => {
    component.ngOnDestroy();
    expect(layoutServiceMock.unsubscribe).toHaveBeenCalled();
  });

  it('should not throw an error if layoutService is undefined on ngOnDestroy', () => {
    // Simular que layoutService es undefined
    (component as any).layoutService = undefined;
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should handle error when obtaining idiomas statistics', () => {
    const errorResponse = { message: 'Error al obtener estadísticas' };
    // Simulando que getEstadisticas devuelve un observable que lanza un error
    estadisticasServiceMock.getEstadisticas.mockReturnValueOnce(throwError(() => errorResponse));

    component.ngOnInit(); // Llama a ngOnInit para activar la obtención de datos

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Erro,
      mensagem: 'Nom se puiderom obter as estadísticas por idiomas.',
    });
  });

  it('should handle error when obtaining anos statistics', () => {
    const errorResponse = { message: 'Error al obtener estadísticas' };
    estadisticasServiceMock.getEstadisticas
      .mockReturnValueOnce(of({ data: [] }))
      .mockReturnValueOnce(throwError(errorResponse));

    component.ngOnInit();

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Erro,
      mensagem: 'Nom se puiderom obter as estadísticas por anos.',
    });
  });

  it('Debe obter os valores do serviço', () => {
    estadisticasServiceMock.getEstadisticas
      .mockReturnValueOnce(of({ data: [] }));

    component.ngOnInit();

    expect(component.generosSignal()).toEqual([{id: 1,
      nome: 'GAL',
      quantidade: 2,
      quantidadepaginas: 200,
      quantidadeRelecturas: 0}]);
  });

  it('SIGNAL, debe cambiar a ordeaçom da quantidade dos anos correctamente', () => {
    const mockAnos = [{ id: 1, nome: '2021', quantidade: 5, quantidadepaginas: 110, quantidadeRelecturas: 0 },
      { id: 2, nome: '2020', quantidade: 10, quantidadepaginas: 350, quantidadeRelecturas: 0 }];
    component.anosSignal.set(mockAnos);
    component.setOrdeAnos();

    expect(component.inversoAnos).toBe(false);
    expect(component.tipoOrdeacomAnos).toBe(component.ordeAnos);
    expect(component.anosSignal()).toEqual(mockAnos.sort((a, b) => a.nome.localeCompare(b.nome)));
  });

  it('should scroll to the specified element', () => {
    const elementId = 'test-element';

    // Crear un elemento ficticio para el DOM
    const mockElement = document.createElement('div');
    mockElement.id = elementId;
    document.body.appendChild(mockElement);

    // Agregar scrollIntoView al mockElement
    mockElement.scrollIntoView = jest.fn();

    // Llamar a la función que se está probando
    component.scrollAoElemento(elementId);

    // Verificar que se llama a scrollIntoView con los parámetros correctos
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });

    // Limpiar el DOM después de la prueba
    document.body.removeChild(mockElement);
  });

  it('should not throw an error if the element does not exist', () => {
    expect(() => {
      component.scrollAoElemento('non-existent-element');
    }).not.toThrow();
  });

  it('should navigate to book list on onGoListadoLivros', () => {
    const ruta = '/livros';
    const tipo = EstadisticasTipo.Idioma;
    const id = 1;

    component.onGoListadoLivros(ruta, tipo, id);

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(`${ruta}?tipo=${tipo}&id=${id}`);
  });
});
