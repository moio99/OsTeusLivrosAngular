import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { BibliotecaComponent } from './biblioteca.component';
import { LivrosService } from '../../../core/services/api/livros.service';
import { BibliotecasService } from '../../../core/services/api/bibliotecas.service';

describe('BibliotecaComponent', () => {
  let component: BibliotecaComponent;
  let fixture: ComponentFixture<BibliotecaComponent>;
  let activatedRoute: any;

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

    const livrosServiceMock = {
      getListadoLivrosPorEditorial: jest.fn(),
    };

    await TestBed.configureTestingModule({
      //declarations: [ BibliotecaComponent ],    Isto nom vale porque é standalone
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: BibliotecasService, useValue: bibliotecasServiceMock },
        { provide: LivrosService, useValue: livrosServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliotecaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
