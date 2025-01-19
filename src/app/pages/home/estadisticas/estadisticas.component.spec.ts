import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadisticasComponent } from './estadisticas.component';
import { Router } from '@angular/router';
import { EstadisticasService } from '../../../core/services/api/estadisticas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { first, of, throwError } from 'rxjs';
import { EstadisticasTipo, InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';

describe('EstadisticasComponent', () => {
  let component: EstadisticasComponent;
  let fixture: ComponentFixture<EstadisticasComponent>;
  let estadisticasService: jest.Mocked<EstadisticasService>;
  let layoutService: jest.Mocked<LayoutService>;
  let router: { navigateByUrl: jest.Mock };

  beforeEach(async () => {
    // Creamos mocks para los servicios
    const layoutServiceMock = {
      amosarInfo: jest.fn()
    };

    const estadisticasServiceMock = {
      getEstadisticas: jest.fn()
    };

    const routerMock = {
      navigateByUrl: jest.fn()
    };

    await TestBed.configureTestingModule({
      // declarations: [EstadisticasComponent],                  Isto nom vale porque é standalone
      imports: [ EstadisticasComponent ],
      providers: [
        { provide: EstadisticasService, useValue: estadisticasServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasComponent);
    component = fixture.componentInstance;

    estadisticasService = TestBed.inject(EstadisticasService) as jest.Mocked<EstadisticasService>;
    layoutService = TestBed.inject(LayoutService) as jest.Mocked<LayoutService>;
    router = TestBed.inject(Router) as unknown as { navigateByUrl: jest.Mock };

    // Asegúrate de que el servicio de estadísticas devuelve un observable válido
    estadisticasService.getEstadisticas
      .mockImplementationOnce(() => of({ data: [] })) // Idiomas
      .mockImplementationOnce(() => of({ data: [] })) // Anos
      .mockImplementationOnce(() => of({ data: [] })); // Géneros
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call amosarInfo on ngOnInit', () => {
    component.ngOnInit();
    expect(layoutService.amosarInfo).toHaveBeenCalledWith(undefined);
  });

  it('should obtain statistics correctly', () => {
    const mockIdiomas = [{ nome: 'Español', quantidade: 10 }];
    const mockAnos = [{ nome: '2020', quantidade: 5 }];
    const mockGeneros = [{ nome: 'Ficción', quantidade: 8 }];

    // Configuramos el getEstadisticas para devolver los mocks
    estadisticasService.getEstadisticas
      .mockReturnValueOnce(of({ data: mockIdiomas }).pipe(first())) // Idiomas
      .mockReturnValueOnce(of({ data: mockAnos }).pipe(first())) // Anos
      .mockReturnValueOnce(of({ data: mockGeneros }).pipe(first())); // Géneros

    component['obterEstadisticas'](); // Llamada al método privado

    expect(estadisticasService.getEstadisticas).toHaveBeenCalledTimes(3);
    expect(component.idiomasSignal()).toEqual(mockIdiomas);
    expect(component.anosSignal()).toEqual(mockAnos);
    expect(component.generosSignal()).toEqual(mockGeneros);
  });

  it('should handle errors when obtaining statistics', () => {
    const errorMessage = 'Error al obtener estadísticas';

    // Para asegurarnos de que la llamada genera un error
    estadisticasService.getEstadisticas.mockReturnValueOnce(throwError(() => new Error(errorMessage)));

    component['obterEstadisticas'](); // Llamada al método privado

    expect(layoutService.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Erro,
      mensagem: 'Nom se puiderom obter as estadísticas por idiomas.'
    });
  });

  it('should correctly set order for anos', () => {
    const mockAnos = [
      { id:1, nome: '2021', quantidade: 3, quantidadePaginas: 20, quantidadeRelecturas: 0 },
      { id:2, nome: '2020', quantidade: 5, quantidadePaginas: 300, quantidadeRelecturas: 0 }
    ];

    component.anosSignal.set(mockAnos);

    component.setOrdeAnos();
    expect(component.inversoAnos).toBe(false);
    expect(component.tipoOrdeacomAnos).toBe(component.ordeAnos);
    expect(component.anosSignal()).toEqual(
      [
        { id:2, nome: '2020', quantidade: 5, quantidadePaginas: 300, quantidadeRelecturas: 0 },
        { id:1, nome: '2021', quantidade: 3, quantidadePaginas: 20, quantidadeRelecturas: 0 }
      ]
      ); // Verifica el orden
  });

  it('should navigate to book list on onGoListadoLivros', () => {
    const ruta = '/libros';
    const tipo = EstadisticasTipo.Idioma;
    const id = 1;

    component.onGoListadoLivros(ruta, tipo, id);

    expect(layoutService.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(router.navigateByUrl).toHaveBeenCalledWith(`${ruta}?tipo=${tipo}&id=${id}`);
  });
});
