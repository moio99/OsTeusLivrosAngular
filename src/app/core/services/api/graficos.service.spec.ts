import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GraficosService } from './graficos.service';
import { environment } from '../../../../environments/environment';
import { GraficosData } from '../../models/graficos.interface';

describe('GraficosService', () => {
  let service: GraficosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GraficosService]
    });
    service = TestBed.inject(GraficosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a graficos data', () => {
    const graficosMock: GraficosData = {
      data: [{
        id: 2022,     // Ano
        idioma: 'GL',
        idIdioma: 1,
        quantidadePaginas: 5000,
      }],
      meta: ''
    };

    service.getGraficosPaginasPorIdiomaEAno().subscribe(relectura => {
      expect(relectura).toEqual(graficosMock);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/Graficos/PaginasPorIdiomaEAno');
    expect(req.request.method).toBe('GET');
    req.flush(graficosMock);
  });
});
