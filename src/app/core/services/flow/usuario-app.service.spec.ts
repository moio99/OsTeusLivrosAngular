import { TestBed } from '@angular/core/testing';

import { UsuarioAppService } from './usuario-app.service';

describe('UsuarioAppService', () => {
  let service: UsuarioAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
