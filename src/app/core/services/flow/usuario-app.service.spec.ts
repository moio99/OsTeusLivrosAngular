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

  it('should set UserLanguageDate to gl-ES for gallego or spanish languages', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'gl',
      configurable: true
    });
    service.setInformacom();
    expect(localStorage.getItem('UserLanguageDate')).toBe('gl-ES');

    Object.defineProperty(navigator, 'language', {
      value: 'es-ES',
      configurable: true
    });
    service.setInformacom();
    expect(localStorage.getItem('UserLanguageDate')).toBe('gl-ES');
  });

  it('should set UserLanguageDate to navigator.language for other languages', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true
    });
    service.setInformacom();
    expect(localStorage.getItem('UserLanguageDate')).toBe('en-US');

    Object.defineProperty(navigator, 'language', {
      value: 'fr-FR',
      configurable: true
    });
    service.setInformacom();
    expect(localStorage.getItem('UserLanguageDate')).toBe('fr-FR');
  });
});
