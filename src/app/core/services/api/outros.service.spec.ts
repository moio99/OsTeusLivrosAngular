import { TestBed } from '@angular/core/testing';

import { OutrosService } from './outros.service';

describe('OutrosService', () => {
  let service: OutrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
