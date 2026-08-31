import { TestBed } from '@angular/core/testing';
import { AutorFormStateService } from './autor-form-state.service';

describe('AutorFormStateService', () => {
  let service: AutorFormStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutorFormStateService]
    });

    service = TestBed.inject(AutorFormStateService);
    service.setPaises([
      { id: 1, value: 'España' },
      { id: 2, value: 'Francia' },
      { id: 3, value: 'Alemania' }
    ]);
  });

  it('debe sincronizar el país seleccionado con su id y nombre', () => {
    service.seleccionarPais({ id: 2, value: 'Francia' });

    expect(service.autorModel().idPais).toBe(2);
    expect(service.autorModel().nomePais).toBe('Francia');
    expect(service.amosarPais(2)).toBe('Francia');
  });

  it('debe filtrar por el texto escrito en el nombre del país', () => {
    service.autorModel.update(model => ({ ...model, nomePais: 'fra' }));

    expect(service.paisesFiltrados().map(pais => pais.value)).toEqual(['Francia']);
  });
});
