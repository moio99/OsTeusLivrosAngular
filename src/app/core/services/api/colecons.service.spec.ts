import { TestBed } from '@angular/core/testing';

import { ColeconsService } from './colecons.service';

describe('ColeconsService', () => {
  let service: ColeconsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColeconsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
