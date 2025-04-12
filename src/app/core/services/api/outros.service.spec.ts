import { TestBed } from '@angular/core/testing';

import { OutrosService } from './outros.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OutrosService', () => {
  let service: OutrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OutrosService]
    });
    service = TestBed.inject(OutrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
