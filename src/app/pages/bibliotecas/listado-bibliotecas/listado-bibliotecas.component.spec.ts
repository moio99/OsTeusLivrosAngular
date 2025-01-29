import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoBibliotecasComponent } from './listado-bibliotecas.component';
import { BibliotecasService } from '../../../core/services/api/bibliotecas.service';

describe('ListadoBibliotecasComponent', () => {
  let component: ListadoBibliotecasComponent;
  let fixture: ComponentFixture<ListadoBibliotecasComponent>;

  beforeEach(async () => {
    const bibliotecasServiceMock = {
      getListadoBibliotecas: jest.fn(),
      getListadoBibliotecasCosLivros: jest.fn(),
      getBiblioteca: jest.fn(),
      getBibliotecaPorNome: jest.fn(),
      postBiblioteca: jest.fn(),
      putBiblioteca: jest.fn(),
      borrarBiblioteca: jest.fn()
    };

    await TestBed.configureTestingModule({
      //declarations: [ ListadoBibliotecasComponent ],    Isto nom vale porque é standalone
      providers: [
        { provide: BibliotecasService, useValue: bibliotecasServiceMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoBibliotecasComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
