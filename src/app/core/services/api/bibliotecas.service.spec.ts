import { TestBed } from '@angular/core/testing';

import { BibliotecasService } from './bibliotecas.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BibliotecasService', () => {
  let service: BibliotecasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BibliotecasService]
    });
    service = TestBed.inject(BibliotecasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
