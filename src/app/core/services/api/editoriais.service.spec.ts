import { TestBed } from '@angular/core/testing';

import { EditoriaisService } from './editoriais.service';

describe('EditoriaisService', () => {
  let service: EditoriaisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditoriaisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
