import { TestBed } from '@angular/core/testing';

import { LivrosService } from './livros.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LivrosService', () => {
  let service: LivrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LivrosService]
    });
    service = TestBed.inject(LivrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
