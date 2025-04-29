import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnosPaginasIdiomasComponent } from './anos-paginas-idiomas.component';
import { CoresIdiomasService } from '../../../core/services/flow/cores-idiomas.sevice';
import { of } from 'rxjs';

describe('AnosPaginasIdiomasComponent', () => {
  let component: AnosPaginasIdiomasComponent;
  let fixture: ComponentFixture<AnosPaginasIdiomasComponent>;
  let coresIdiomasService: jest.Mocked<CoresIdiomasService>;

  beforeEach(async () => {
    const spy = {
      getCoresIdiomas: jest.fn()
    };

    await TestBed.configureTestingModule({
      //declarations: [AnosPaginasIdiomasComponent],    Isto nom vale porque é standalone
      providers: [
        { provide: CoresIdiomasService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnosPaginasIdiomasComponent);
    component = fixture.componentInstance;
    coresIdiomasService = TestBed.inject(CoresIdiomasService) as jest.Mocked<CoresIdiomasService>;
  });

  it('Debe criarse', () => {
    expect(component).toBeTruthy();
  });

  it('Debe inicializar correctamente coresIdiomas em ngOnInit', () => {
    const mockCoresIdiomas = {
      'GAL': { cor: '#FF0000' },
      'POR': { cor: '#00FF00' }
    };
    coresIdiomasService.getCoresIdiomas.mockReturnValue(mockCoresIdiomas);

    component.ngOnInit();

    expect(component.coresIdiomas).toEqual(mockCoresIdiomas);
  });

  it('Este é um privado, debe separar os dados por idioma e acumular as páginas', () => {
    const mockData = [
      { id: 1998, idioma: 'Galician-AGAL', idIdioma: 1, quantidadepaginas: 100 },
      { id: 1999, idioma: 'Galician-AGAL', idIdioma: 1, quantidadepaginas: 150 },
      { id: 2000, idioma: 'Galician-AGAL', idIdioma: 1, quantidadepaginas: 200 },
      { id: 1999, idioma: 'Portuguese', idIdioma: 3, quantidadepaginas: 80 },
    ];

    component.coresIdiomas = { 1: {nome: 'Galician-AGAL', cor: '#215d9a'}, 3: { nome: 'Portuguese', cor: '#2f9736' } };
    component['separarDadosPorIdioma'](mockData);

    expect(component.chartOptions.labels).toEqual(['1998', '1999', '2000']);
    expect(component.chartOptions.series).toEqual([
      { name: 'Galician-AGAL', data: [100, 250, 450] }, // um valor por cada ano, e acumulativo
      { name: 'Portuguese', data: [0, 80, 80] }
    ]);
  });

  it('Este é um privado, Debe asignar os dados correctamente', () => {
    const labels = ['1999', '2000'];
    const series = [{ name: 'Galician-AGAL', data: [250, 200] }];
    const cores = ['#FF0000'];

    component['carregarDadosNoChartOptions'](labels, series, cores);

    expect(component.chartOptions.labels).toEqual(labels);
    expect(component.chartOptions.series).toEqual(series);
    expect(component.chartOptions.colors).toEqual(cores);
  });
});
