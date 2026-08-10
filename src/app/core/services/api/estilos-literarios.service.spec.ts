import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EstilosLiterariosService } from './estilos-literarios.service';

describe('EstilosLiterariosService', () => {
  let service: EstilosLiterariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EstilosLiterariosService]
    });
    service = TestBed.inject(EstilosLiterariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
