import { TestBed } from '@angular/core/testing';
import { DadosPaginasService, DadosPagina, NovoDado } from './dados-paginas.service';
import { DadosComplentarios } from '../../../shared/enums/estadisticasTipos';

describe('DadosPaginasService', () => {
  let service: DadosPaginasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DadosPaginasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new DadosPagina', () => {
    const dado: DadosPagina = { id: '1', nomePagina: 'pagina1', elemento: {} };
    service.setDadosPagina(dado);
    const result = service.getDadosPagina('1', 'pagina1');
    expect(result).toEqual(dado);
  });

  it('should update an existing DadosPagina', () => {
    const dado: DadosPagina = { id: '1', nomePagina: 'pagina1', elemento: {} };
    const updatedDado: DadosPagina = { id: '1', nomePagina: 'pagina1', elemento: { updated: true } };
    service.setDadosPagina(dado);
    service.setDadosPagina(updatedDado);
    const result = service.getDadosPagina('1', 'pagina1');
    expect(result).toEqual(updatedDado);
  });

  it('should return undefined if DadosPagina is not found', () => {
    const result = service.getDadosPagina('1', 'pagina1');
    expect(result).toBeUndefined();
  });

  it('should set and get NovoDado', () => {
    const novoDado: NovoDado = { tipo: DadosComplentarios.Colecom, elemento: {} };
    service.setNovoDado(novoDado);
    const result = service.getNovoDado();
    expect(result).toEqual(novoDado);
  });

  it('should set and get undefined as NovoDado', () => {
    service.setNovoDado(undefined);
    const result = service.getNovoDado();
    expect(result).toBeUndefined();
  });
});
