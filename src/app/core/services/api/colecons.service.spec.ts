import { TestBed } from '@angular/core/testing';

import { ColeconsService } from './colecons.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ColeconsService', () => {
  let service: ColeconsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ColeconsService]
    });
    service = TestBed.inject(ColeconsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
