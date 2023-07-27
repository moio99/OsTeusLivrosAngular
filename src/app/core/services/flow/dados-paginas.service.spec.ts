import { TestBed } from '@angular/core/testing';

import { DadosPaginasService } from './dados-paginas.service';

describe('DadosPaginasService', () => {
  let service: DadosPaginasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DadosPaginasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
