import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GenerosService } from './generos.service'; // Cambia la ruta según tu estructura de carpetas
import { environment } from '../../../../environments/environment';
import { Genero } from '../../models/genero.interface';

describe('GenerosService', () => {
  let service: GenerosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GenerosService]
    });
    service = TestBed.inject(GenerosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get listado generos', () => {
    const mockGeneros = [{ id: '1', nome: 'Ficción' }, { id: '2', nome: 'No Ficción' }];

    service.getListadoGeneros().subscribe((generos) => {
      expect(generos).toEqual(mockGeneros);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Generos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockGeneros); // Simula la respuesta del servidor
  });

  it('should get genero by name', () => {
    const mockNombre = { id: '1', nome: 'Ficción' };
    const testId = '1';

    service.getGeneroNome(testId).subscribe((genero) => {
      expect(genero).toEqual(mockNombre);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Generos/GeneroNome?id=${testId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockNombre); // Simula la respuesta del servidor
  });

  it('should post a new genero', () => {
    const newGenero: Genero = { id: 3, nome: 'Ciencia' };

    service.postGenero(newGenero).subscribe((response) => {
      expect(response).toEqual(null); // Ajusta según la respuesta esperada
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Generos/Genero`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newGenero); // Comprueba que el body sea igual al nuevo genero
    req.flush(null); // Simula la respuesta del servidor
  });

  it('should update an existing genero', () => {
    const updatedGenero: Genero = { id: 1, nome: 'Ficción Actualizada' };

    service.putGenero(updatedGenero).subscribe((response) => {
      expect(response).toEqual(null); // Ajusta según la respuesta esperada
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Generos/Genero`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedGenero); // Comprueba que el body sea igual al genero actualizado
    req.flush(null); // Simula la respuesta del servidor
  });

  it('should delete a genero by id', () => {
    const testId = '1';

    service.borrarGenero(testId).subscribe((response) => {
      expect(response).toEqual(null); // Ajusta según la respuesta esperada
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/Generos/Genero?id=${testId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Simula la respuesta del servidor
  });
});
