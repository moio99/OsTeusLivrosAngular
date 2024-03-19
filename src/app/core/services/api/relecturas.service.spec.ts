import { TestBed } from '@angular/core/testing';
import { RelecturasService } from './relecturas.service';

describe('RelecturasService', () => {
  let service: RelecturasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelecturasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
