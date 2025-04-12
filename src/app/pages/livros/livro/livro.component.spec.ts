import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivroComponent } from './livro.component';
import { LivrosService } from '../../../core/services/api/livros.service';
import { GenerosService } from '../../../core/services/api/generos.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OutrosService } from '../../../core/services/api/outros.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { RelecturasService } from '../../../core/services/api/relecturas.service';

describe('LivroComponent', () => {
  let component: LivroComponent;
  let fixture: ComponentFixture<LivroComponent>;
  let activatedRoute: any;

  beforeEach(async () => {
    const livrosServiceMock = {
      getListadoLivros: jest.fn(),
      getListadoLivrosUltimaLectura: jest.fn(),
      getListadoLivrosPorIdioma: jest.fn(),
      getListadoLivrosPorAno: jest.fn(),
      getLivrosPorAutor: jest.fn(),
      getListadoLivrosPorGenero: jest.fn(),
      getLivrosPorEditorial: jest.fn(),
      getLivrosPorBiblioteca: jest.fn(),
      getLivrosPorColecom: jest.fn(),
      getListadoLivrosPorEstiloLiterario: jest.fn(),
      getLivro: jest.fn(),
      getLivroPorTitulo: jest.fn(),
      postLivro: jest.fn(),
      putLivro: jest.fn(),
      borrarLivro: jest.fn()
    };

    const generosServiceMock = {
      getGenero: jest.fn(),
      postGenero: jest.fn(),
      putGenero: jest.fn(),
      getGeneroPorNome: jest.fn(),
    };

    const outrosServiceMock = {
      getNacionalidades: jest.fn(),
      getNacionalidadeNome: jest.fn(),
      getPaises: jest.fn(),
      getPaisNome: jest.fn(),
      getIdiomaNome: jest.fn(),
      getTodo: jest.fn(),
    };

    const dadosPaginasServiceMock = {
      setDadosPagina: jest.fn(),
      getDadosPagina: jest.fn(),
      setNovoDado: jest.fn(),
      getNovoDado: jest.fn(),
    };

    const relecturasServiceMock = {
      getRelectura: jest.fn(),
      getRelecturas: jest.fn(),
      postRelectura: jest.fn(),
      putRelectura: jest.fn(),
      borrarRelectura: jest.fn(),
    };

    const layoutServiceMock = {
      amosarInfo: jest.fn(),
    };

    activatedRoute = {
      queryParams: of({ id: '1' }),
    };

    await TestBed.configureTestingModule({
      //declarations: [ LivroComponent ],    Isto nom vale porque é standalone
      providers: [
        { provide: LivrosService, useValue: livrosServiceMock },
        { provide: GenerosService, useValue: generosServiceMock },
        { provide: LivrosService, useValue: livrosServiceMock },
        { provide: OutrosService, useValue: outrosServiceMock },
        { provide: DadosPaginasService, useValue: dadosPaginasServiceMock },
        { provide: RelecturasService, useValue: relecturasServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivroComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

