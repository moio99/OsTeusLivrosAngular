import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ColeconsService } from './colecons.service';
import { environment, environments } from '../../../../environments/environment';

describe('ColeconsService', () => {
  let service: ColeconsService;
  let httpMock: HttpTestingController;
  const base = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ColeconsService]
    });

    service = TestBed.inject(ColeconsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    // restore environment to dev to avoid side effects
    environment.whereIAm = environments.dev;
  });

  it('getListado should call correct endpoint', () => {
    const mock = [{ id: '1', nome: 'C1' }];

    service.getListado().subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${base}/Colecons`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getListadoCosLivros should call endpoint when not prod/pre', () => {
    environment.whereIAm = environments.dev;
    const mock = { data: [{ id: '1' }], meta: {} } as any;

    service.getListadoCosLivros().subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${base}/Colecons//ColeconsCosLivros`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('setListadoCosLivros should cache when in pre/pro and getListadoCosLivros returns cache', () => {
    environment.whereIAm = environments.pre;
    const mock = { data: [{ id: '1' }], meta: {} } as any;

    service.setListadoCosLivros(mock);

    service.getListadoCosLivros().subscribe(res => expect(res).toEqual(mock));

    // no HTTP requests expected because cached
    httpMock.expectNone(`${base}/Colecons/ColeconsCosLivros`);
  });

  it('getPorId should call correct endpoint', () => {
    const mock = { data: [{ id: '1' }], meta: {} } as any;

    service.getPorId('1').subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${base}/Colecons/Colecom?id=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getPorNome should call correct endpoint', () => {
    const mock = { data: [], meta: {} } as any;

    service.getPorNome('nome').subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${base}/Colecons/ColecomPorNome?nome=nome`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('create should post to entity endpoint', () => {
    const item = { nome: 'New' } as any;
    const mock = { id: '10', nome: 'New' } as any;

    service.create(item).subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${base}/Colecons/Colecom`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(item);
    req.flush(mock);
  });

  it('update should put to entity endpoint', () => {
    const item = { id: '10', nome: 'Updated' } as any;
    const mock = { id: '10', nome: 'Updated' } as any;

    service.update(item).subscribe(res => expect(res).toEqual(mock));

    const req = httpMock.expectOne(`${base}/Colecons/Colecom`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(item);
    req.flush(mock);
  });

  it('borrar should call delete endpoint', () => {
    service.borrar('5').subscribe(res => expect(res).toBeUndefined());

    const req = httpMock.expectOne(`${base}/Colecons/Colecom?id=5`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
