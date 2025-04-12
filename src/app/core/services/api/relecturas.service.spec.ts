import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RelecturasService } from './relecturas.service';
import { environment } from '../../../../environments/environment';
import { Relectura } from '../../models/relectura.interface';

describe('RelecturasService', () => {
  let service: RelecturasService;
  let httpMock: HttpTestingController;

  let mockRelectura: Relectura = {
    id: '12',
    idLivro: '4',
    titulo: 'Título do livro',

    idBiblioteca: 9,
    biblioteca: 'Própria',
    idEditorial: 7,
    editorial: 'Xereais',
    idColecom: null,
    colecom: '',
    isbn: '84-5444444',
    paginas: '124',
    paginasLidas: '124',
    lido: true,
    diasLeitura: '12',
    dataFimLeitura: '01/01/2025',
    idIdioma:1,
    dataEdicom: '01/01/2024',
    numeroEdicom: '1',
    electronico: false,
    somSerie: false,
    idSerie: null,
    comentario: 'comentario',
    //pontuacom?: number,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RelecturasService]
    });
    service = TestBed.inject(RelecturasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a relectura by id', () => {
    service.getRelectura('123').subscribe(relectura => {
      expect(relectura).toEqual(mockRelectura);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/Relecturas/Relectura?id=123');
    expect(req.request.method).toBe('GET');
    req.flush(mockRelectura);
  });

  it('should retrieve relecturas by idLivro', () => {
    const mockRelecturas: Relectura[] = [ /* propiedades del mock según tu modelo */ ];

    service.getRelecturas('1234').subscribe(relecturas => {
      expect(relecturas).toEqual(mockRelecturas);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/Relecturas/Relecturas?id=1234');
    expect(req.request.method).toBe('GET');
    req.flush(mockRelecturas);
  });

  it('should post a new relectura', () => {
    const newRelectura: Relectura = mockRelectura;

    service.postRelectura(newRelectura).subscribe(response => {
      expect(response).toEqual(newRelectura);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/Relecturas/Relectura');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newRelectura);
    req.flush(newRelectura);
  });

  it('should update an existing relectura', () => {
    const updatedRelectura: Relectura = mockRelectura;

    service.putRelectura(updatedRelectura).subscribe(response => {
      expect(response).toEqual(updatedRelectura);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/Relecturas/Relectura');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedRelectura);
    req.flush(updatedRelectura);
  });

  it('should delete a relectura by id', () => {
    service.borrarRelectura('123').subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(environment.apiUrl + '/Relecturas/Relectura?id=123');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
