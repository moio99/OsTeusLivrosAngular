import { TestBed } from '@angular/core/testing';

import { EditoriaisService } from './editoriais.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditoriaisService', () => {
  let service: EditoriaisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EditoriaisService]
    });
    service = TestBed.inject(EditoriaisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
