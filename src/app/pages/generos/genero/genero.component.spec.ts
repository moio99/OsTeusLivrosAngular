import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError, Observable } from 'rxjs';
import { GeneroComponent } from './genero.component';
import { Genero } from '../../../core/models/genero.interface';
import { GenerosService } from '../../../core/services/api/generos.service';
import { LivrosService } from '../../../core/services/api/livros.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { UsuarioAppService } from '../../../core/services/flow/usuario-app.service';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { DadosComplentarios, InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';

describe('GeneroComponent', () => {
  let component: GeneroComponent;
  let fixture: ComponentFixture<GeneroComponent>;
  let generosServiceMock: jest.Mocked<GenerosService> & {
    create: jest.Mock<Observable<any>>;
    update: jest.Mock<Observable<any>>;
  };
  let layoutServiceMock: jest.Mocked<LayoutService>;
  let dadosPaginasServiceMock: jest.Mocked<DadosPaginasService>;
  let usuarioAppServiceMock: jest.Mocked<UsuarioAppService>;
  let routerMock: jest.Mocked<Router>;
  let activatedRouteMock: any;
  let locationMock: jest.Mocked<Location>;

  const createSubmitEvent = (value: string): SubmitEvent => {
    return { submitter: { value } } as unknown as SubmitEvent;
  };

  beforeEach(async () => {
    generosServiceMock = {
      getPorId: jest.fn(),
      getPorNome: jest.fn(),
      create: jest.fn<Observable<any>, [Genero]>(),
      update: jest.fn<Observable<any>, [Genero]>(),
    } as unknown as jest.Mocked<GenerosService> & {
      create: jest.Mock<Observable<any>, [Genero]>;
      update: jest.Mock<Observable<any>, [Genero]>;
    };

    layoutServiceMock = {
      amosarInfo: jest.fn(),
    } as unknown as jest.Mocked<LayoutService>;

    dadosPaginasServiceMock = {
      getNovoDado: jest.fn(),
      setNovoDado: jest.fn(),
    } as unknown as jest.Mocked<DadosPaginasService>;

    usuarioAppServiceMock = {
      setGenero: jest.fn(),
    } as unknown as jest.Mocked<UsuarioAppService>;

    const livrosServiceMock = {
      getListadoLivrosPorGenero: jest.fn(),
    } as unknown as jest.Mocked<LivrosService>;

    activatedRouteMock = {
      queryParams: of({ id: '0' }),
    };

    routerMock = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    locationMock = {
      back: jest.fn(),
    } as unknown as jest.Mocked<Location>;

    await TestBed.configureTestingModule({
      imports: [GeneroComponent],
      providers: [
        { provide: GenerosService, useValue: generosServiceMock },
        { provide: 'MyServiceToken', useValue: generosServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: LivrosService, useValue: livrosServiceMock },
        { provide: DadosPaginasService, useValue: dadosPaginasServiceMock },
        { provide: UsuarioAppService, useValue: usuarioAppServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in add mode when query param is 0', () => {
    activatedRouteMock.queryParams = of({ id: '0' });
    component.ngOnInit();

    expect(component.modo).toBe(EstadosPagina.engadir);
    expect(generosServiceMock.getPorId).not.toHaveBeenCalled();
  });

  it('should initialize in edit mode and fetch genre data when id is not 0', () => {
    activatedRouteMock.queryParams = of({ id: '1' });
    generosServiceMock.getPorId.mockReturnValueOnce(of({
      data: [{ id: 1, nome: 'Ficción', comentario: 'Libros de ficción' }],
      meta: {}
    }));

    component.ngOnInit();

    expect(component.modo).toBe(EstadosPagina.guardar);
    expect(generosServiceMock.getPorId).toHaveBeenCalledWith('1');
    expect(component.generoForm.controls.nome.value).toBe('Ficción');
    expect(component.generoForm.controls.comentario.value).toBe('Libros de ficción');
  });

  it('should show an error when fetching genre data fails', () => {
    activatedRouteMock.queryParams = of({ id: '1' });
    generosServiceMock.getPorId.mockReturnValueOnce(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({
      tipo: InformacomPeTipo.Erro,
      mensagem: expect.stringContaining('Nom se puiderom obter os dados')
    }));
  });

  it('should create a new genre when form is valid and no duplicate exists', () => {
    component.generoForm.controls.nome.setValue('Ficción');
    component.generoForm.controls.comentario.setValue('Comentario');

    generosServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [],
      meta: { quantidade: 0 }
    }));
    generosServiceMock.create.mockReturnValueOnce(of({ idResult: 1, meta: { id: 1 } }));
    dadosPaginasServiceMock.getNovoDado.mockReturnValueOnce({ tipo: DadosComplentarios.Genero, elemento: undefined });

    component.onSubmit(createSubmitEvent(EstadosPagina.engadir));

    expect(generosServiceMock.create).toHaveBeenCalledWith(expect.objectContaining({
      nome: 'Ficción',
      comentario: 'Comentario'
    }));
    expect(usuarioAppServiceMock.setGenero).toHaveBeenCalledWith(expect.objectContaining({
      nome: 'Ficción'
    }));
    expect(dadosPaginasServiceMock.setNovoDado).toHaveBeenCalledWith(expect.objectContaining({
      elemento: { id: 1, value: 'Ficción' }
    }));
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should show a duplicate warning when a genre with the same name exists', () => {
    component.generoForm.controls.nome.setValue('Ficción');
    component.generoForm.controls.comentario.setValue('Comentario');

    generosServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [{ id: 1, nome: 'Ficción', comentario: 'Comentario' }],
      meta: { quantidade: 1, id: 1 }
    }));

    component.onSubmit(createSubmitEvent(EstadosPagina.engadir));

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Aviso,
      mensagem: 'O nome do género já existe na base de dados'
    });
    expect(generosServiceMock.create).not.toHaveBeenCalled();
  });

  it('should not submit when the form is invalid', () => {
    component.generoForm.controls.nome.setValue('');
    component.generoForm.controls.comentario.setValue('Comentario');

    component.onSubmit(createSubmitEvent(EstadosPagina.engadir));

    expect(generosServiceMock.getPorNome).not.toHaveBeenCalled();
    expect(generosServiceMock.create).not.toHaveBeenCalled();
  });

  it('should show an error when create fails', () => {
    component.generoForm.controls.nome.setValue('Ficción');
    component.generoForm.controls.comentario.setValue('Comentario');

    generosServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [],
      meta: { quantidade: 0 }
    }));
    generosServiceMock.create.mockReturnValueOnce(throwError(() => new Error('Error')));

    component.onSubmit(createSubmitEvent(EstadosPagina.engadir));

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Erro,
      mensagem: 'Nom se puido engadir do género.'
    });
  });

  it('should update an existing genre when editing', () => {
    component.dadosDoElemento = { id: 1, nome: 'Ficción', comentario: 'Comentario', tipo: 'propriedade para saver que o tipo é Género' };
    component.modo = EstadosPagina.guardar;
    component.generoForm.controls.nome.setValue('Ficción Actualizada');
    component.generoForm.controls.comentario.setValue('');

    generosServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [],
      meta: { quantidade: 0 }
    }));
    generosServiceMock.update.mockReturnValueOnce(of({ idResult: 1 }));

    component.onSubmit(createSubmitEvent(EstadosPagina.guardar));

    expect(generosServiceMock.update).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      nome: 'Ficción Actualizada',
      comentario: ''
    }));
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Sucesso,
      mensagem: 'do género guardada.'
    });
  });

  it('should show an error when update fails', () => {
    component.dadosDoElemento = { id: 1, nome: 'Ficción', comentario: 'Comentario', tipo: 'propriedade para saver que o tipo é Género' };
    component.modo = EstadosPagina.guardar;
    component.generoForm.controls.nome.setValue('Ficción Actualizada');
    component.generoForm.controls.comentario.setValue('');

    generosServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [],
      meta: { quantidade: 0 }
    }));
    generosServiceMock.update.mockReturnValueOnce(throwError(() => new Error('Error')));

    component.onSubmit(createSubmitEvent(EstadosPagina.guardar));

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Erro,
      mensagem: 'Nom se puido guardar do género.'
    });
  });

  it('should go back when cancel is called', () => {
    component.onCancelar();

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should navigate to the requested page', () => {
    component.onIrPagina('/livros/livro', '1', '0');

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/livros/livro?id=1');
  });
});
