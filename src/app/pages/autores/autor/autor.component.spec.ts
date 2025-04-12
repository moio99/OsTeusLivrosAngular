import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { AutorComponent } from './autor.component';
import { AutoresService } from '../../../core/services/api/autores.service';
import { OutrosService } from '../../../core/services/api/outros.service';
import { LivrosService } from '../../../core/services/api/livros.service';

describe('AutorComponent', () => {
  let component: AutorComponent;
  let fixture: ComponentFixture<AutorComponent>;
  let activatedRoute: any;

  beforeEach(async () => {
    const autoresServiceMock = {
      getListadoAutores: jest.fn(),
      getListadoAutoresPorNacons: jest.fn(),
      getListadoAutoresPorPaises: jest.fn(),
      getListadoAutoresFiltrados: jest.fn(),
      getAutor: jest.fn(),
      getAutorPorNome: jest.fn(),
      postAutor: jest.fn(),
      putAutor: jest.fn(),
      borrarAutor: jest.fn()
    };

    const livrosServiceMock = {
      getLivrosPorAutor: jest.fn(),
    };

    const outrosServiceMock = {
      getNacionalidades: jest.fn(),
    };

    await TestBed.configureTestingModule({
      //declarations: [ AutorComponent ],    Isto nom vale porque é standalone
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AutoresService, useValue: autoresServiceMock },
        { provide: LivrosService, useValue: livrosServiceMock },
        { provide: OutrosService, useValue: outrosServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
