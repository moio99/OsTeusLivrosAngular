import { TestBed } from '@angular/core/testing';

import { AutoresService } from './autores.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EstadisticasService', () => {
  let service: AutoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AutoresService]
    });
    service = TestBed.inject(AutoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
