import { TestBed } from '@angular/core/testing';

import { EstadisticasService } from './estadisticas.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('EstadisticasService', () => {
  let service: EstadisticasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EstadisticasService]
    });
    service = TestBed.inject(EstadisticasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
