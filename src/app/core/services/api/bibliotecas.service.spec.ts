import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BibliotecasService } from './bibliotecas.service';
import { environment, environments } from '../../../../environments/environment';

describe('BibliotecasService', () => {
  let service: BibliotecasService;
  let httpMock: HttpTestingController;
  const base = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BibliotecasService]
    });

    service = TestBed.inject(BibliotecasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    environment.whereIAm = environments.dev;
  });

  it('getListado should call correct endpoint', () => {
    const mock = [{ id: '1', nome: 'B1' }];

    service.getListado().subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${base}/Bibliotecas`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getListadoCosLivros should call endpoint when not prod/pre', () => {
    environment.whereIAm = environments.dev;
    const mock = { data: [{ id: '1' }], meta: {} } as any;

    service.getListadoCosLivros().subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${base}/Bibliotecas//BibliotecasCosLivros`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('setListadoCosLivros should cache when in pre/pro and getListadoCosLivros returns cache', () => {
    environment.whereIAm = environments.pre;
    const mock = { data: [{ id: '1' }], meta: {} } as any;

    service.setListadoCosLivros(mock);

    service.getListadoCosLivros().subscribe(res => expect(res).toEqual(mock));

    httpMock.expectNone(`${base}/Bibliotecas//BibliotecasCosLivros`);
  });

  it('getPorId should call correct endpoint', () => {
    const mock = { data: [{ id: '1' }], meta: {} } as any;

    service.getPorId('1').subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${base}/Bibliotecas/Biblioteca?id=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getPorNome should call correct endpoint', () => {
    const mock = { data: [], meta: {} } as any;

    service.getPorNome('nome').subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${base}/Bibliotecas/BibliotecaPorNome?nome=nome`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('create should post to entity endpoint', () => {
    const item = { nome: 'New' } as any;
    const mock = { id: '10', nome: 'New' } as any;

    service.create(item).subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${base}/Bibliotecas/Biblioteca`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(item);
    req.flush(mock);
  });

  it('update should put to entity endpoint', () => {
    const item = { id: '10', nome: 'Updated' } as any;
    const mock = { id: '10', nome: 'Updated' } as any;

    service.update(item).subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${base}/Bibliotecas/Biblioteca`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(item);
    req.flush(mock);
  });

  it('borrar should call delete endpoint', () => {
    service.borrar('5').subscribe(res => expect(res).toBeUndefined());

    const req = httpMock.expectOne(`${base}/Bibliotecas/Biblioteca?id=5`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
