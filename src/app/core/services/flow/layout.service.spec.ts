import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';
import { InformacomPe } from '../../../shared/models/outros.model';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit an event when abrirMenu is called', done => {
    service.getAbrirMenu().subscribe(() => {
      expect(true).toBe(true);
      done();
    });

    service.abrirMenu();
  });

  it('should emit an event when cerrarMenu is called', done => {
    service.getCerrarMenu().subscribe(() => {
      expect(true).toBe(true);
      done();
    });

    service.cerrarMenu();
  });

  it('should emit a value when amosarInfo is called', done => {
    const mockInfo: InformacomPe = {
      tipo: InformacomPeTipo.Sucesso,
      mensagem: 'Algo que amosar',
      duracom: 1000 };

    service.getInformacom().subscribe(info => {
      expect(info).toEqual(mockInfo);
      done();
    });

    service.amosarInfo(mockInfo);
  });

  it('should emit undefined when amosarInfo is called with undefined', done => {
    service.getInformacom().subscribe(info => {
      expect(info).toBeUndefined();
      done();
    });

    service.amosarInfo(undefined);
  });
});
