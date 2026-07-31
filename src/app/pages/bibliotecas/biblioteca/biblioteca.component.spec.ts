import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError, Observable } from 'rxjs';
import { BibliotecaComponent } from './biblioteca.component';
import { Biblioteca } from '../../../core/models/biblioteca.interface';
import { BibliotecasService } from '../../../core/services/api/bibliotecas.service';
import { LivrosService } from '../../../core/services/api/livros.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { UsuarioAppService } from '../../../core/services/flow/usuario-app.service';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { DadosComplentarios, InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';

describe('BibliotecaComponent', () => {
  let component: BibliotecaComponent;
  let fixture: ComponentFixture<BibliotecaComponent>;
  let bibliotecasServiceMock: jest.Mocked<BibliotecasService> & {
    create: jest.Mock<Observable<any>, [Biblioteca]>;
    update: jest.Mock<Observable<any>, [Biblioteca]>;
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
    bibliotecasServiceMock = {
      getPorId: jest.fn(),
      getPorNome: jest.fn(),
      create: jest.fn<Observable<any>, [Biblioteca]>(),
      update: jest.fn<Observable<any>, [Biblioteca]>(),
    } as unknown as jest.Mocked<BibliotecasService> & {
      create: jest.Mock<Observable<any>, [Biblioteca]>;
      update: jest.Mock<Observable<any>, [Biblioteca]>;
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
      getLivrosPorBiblioteca: jest.fn(),
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
      imports: [BibliotecaComponent],
      providers: [
        { provide: BibliotecasService, useValue: bibliotecasServiceMock },
        { provide: 'MyServiceToken', useValue: bibliotecasServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: LivrosService, useValue: livrosServiceMock },
        { provide: DadosPaginasService, useValue: dadosPaginasServiceMock },
        { provide: UsuarioAppService, useValue: usuarioAppServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BibliotecaComponent);
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
    expect(bibliotecasServiceMock.getPorId).not.toHaveBeenCalled();
  });

  it('should initialize in edit mode and fetch biblioteca data when id is not 0', () => {
    activatedRouteMock.queryParams = of({ id: '1' });
    bibliotecasServiceMock.getPorId.mockReturnValueOnce(of({
      data: [{ id: 1, nome: 'Biblioteca Teste', endereco: 'Rua 1', localidade: 'Cidade', telefone: '123', dataAsociamento: '2020-01-01', dataRenovacom: '2021-01-01', comentario: 'Comentario' }],
      meta: {}
    }));

    component.ngOnInit();

    expect(component.modo).toBe(EstadosPagina.guardar);
    expect(bibliotecasServiceMock.getPorId).toHaveBeenCalledWith('1');
    expect(component.bibliotecaForm.controls.nome.value).toBe('Biblioteca Teste');
    expect(component.bibliotecaForm.controls.endereco.value).toBe('Rua 1');
    expect(component.bibliotecaForm.controls.localidade.value).toBe('Cidade');
    expect(component.bibliotecaForm.controls.telefone.value).toBe('123');
  });

  it('should show an error when fetching biblioteca data fails', () => {
    activatedRouteMock.queryParams = of({ id: '1' });
    bibliotecasServiceMock.getPorId.mockReturnValueOnce(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({
      tipo: InformacomPeTipo.Erro,
      mensagem: expect.stringContaining('Nom se puiderom obter os dados da biblioteca')
    }));
  });

  it('should create a new biblioteca when form is valid and no duplicate exists', () => {
    component.bibliotecaForm.controls.nome.setValue('Biblioteca Teste');
    component.bibliotecaForm.controls.endereco.setValue('Rua 1');
    component.bibliotecaForm.controls.localidade.setValue('Cidade');
    component.bibliotecaForm.controls.telefone.setValue('123');
    component.bibliotecaForm.controls.comentario.setValue('Comentario');

    bibliotecasServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [],
      meta: { quantidade: 0 }
    }));
    bibliotecasServiceMock.create.mockReturnValueOnce(of({ idResult: 1, meta: { id: 1 } }));
    dadosPaginasServiceMock.getNovoDado.mockReturnValueOnce({ tipo: DadosComplentarios.Biblioteca, elemento: undefined });

    component.onSubmit(createSubmitEvent(EstadosPagina.engadir));

    expect(bibliotecasServiceMock.create).toHaveBeenCalledWith(expect.objectContaining({
      nome: 'Biblioteca Teste',
      endereco: 'Rua 1',
      localidade: 'Cidade',
      telefone: '123'
    }));
    expect(usuarioAppServiceMock.setGenero).not.toHaveBeenCalled();
    expect(dadosPaginasServiceMock.setNovoDado).toHaveBeenCalledWith(expect.objectContaining({
      elemento: { id: 1, value: 'Biblioteca Teste' }
    }));
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should show a duplicate warning when a biblioteca with the same name exists', () => {
    component.bibliotecaForm.controls.nome.setValue('Biblioteca Teste');
    component.bibliotecaForm.controls.endereco.setValue('Rua 1');
    component.bibliotecaForm.controls.localidade.setValue('Cidade');
    component.bibliotecaForm.controls.telefone.setValue('123');
    component.bibliotecaForm.controls.comentario.setValue('Comentario');

    bibliotecasServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [{ id: 1, nome: 'Biblioteca Teste', endereco: 'Rua 1', localidade: 'Cidade', telefone: '123', comentario: 'Comentario' }],
      meta: { quantidade: 1, id: 1 }
    }));

    component.onSubmit(createSubmitEvent(EstadosPagina.engadir));

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Aviso,
      mensagem: 'O nome da biblioteca já existe na base de dados'
    });
    expect(bibliotecasServiceMock.create).not.toHaveBeenCalled();
  });

  it('should not submit when the form is invalid', () => {
    component.bibliotecaForm.controls.nome.setValue('');
    component.bibliotecaForm.controls.endereco.setValue('Rua 1');
    component.bibliotecaForm.controls.localidade.setValue('Cidade');
    component.bibliotecaForm.controls.telefone.setValue('123');
    component.bibliotecaForm.controls.comentario.setValue('Comentario');

    component.onSubmit(createSubmitEvent(EstadosPagina.engadir));

    expect(bibliotecasServiceMock.getPorNome).not.toHaveBeenCalled();
    expect(bibliotecasServiceMock.create).not.toHaveBeenCalled();
  });

  it('should show an error when create fails', () => {
    component.bibliotecaForm.controls.nome.setValue('Biblioteca Teste');
    component.bibliotecaForm.controls.endereco.setValue('Rua 1');
    component.bibliotecaForm.controls.localidade.setValue('Cidade');
    component.bibliotecaForm.controls.telefone.setValue('123');
    component.bibliotecaForm.controls.comentario.setValue('Comentario');

    bibliotecasServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [],
      meta: { quantidade: 0 }
    }));
    bibliotecasServiceMock.create.mockReturnValueOnce(throwError(() => new Error('Error')));

    component.onSubmit(createSubmitEvent(EstadosPagina.engadir));

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Erro,
      mensagem: 'Nom se puido engadir da biblioteca.'
    });
  });

  it('should update an existing biblioteca when editing', () => {
    component.dadosDoElemento = { id: 1, nome: 'Biblioteca Teste', endereco: 'Rua 1', localidade: 'Cidade', telefone: '123', dataAsociamento: '', dataRenovacom: '', comentario: 'Comentario' };
    component.modo = EstadosPagina.guardar;
    component.bibliotecaForm.controls.nome.setValue('Biblioteca Actualizada');
    component.bibliotecaForm.controls.endereco.setValue('Rua 2');
    component.bibliotecaForm.controls.localidade.setValue('Cidade 2');
    component.bibliotecaForm.controls.telefone.setValue('567');
    component.bibliotecaForm.controls.comentario.setValue('');

    bibliotecasServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [],
      meta: { quantidade: 0 }
    }));
    bibliotecasServiceMock.update.mockReturnValueOnce(of({ idResult: 1 }));

    component.onSubmit(createSubmitEvent(EstadosPagina.guardar));

    expect(bibliotecasServiceMock.update).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      nome: 'Biblioteca Actualizada',
      endereco: 'Rua 2',
      localidade: 'Cidade 2',
      telefone: '567',
      comentario: ''
    }));
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Sucesso,
      mensagem: 'da biblioteca guardada.'
    });
  });

  it('should show an error when update fails', () => {
    component.dadosDoElemento = { id: 1, nome: 'Biblioteca Teste', endereco: 'Rua 1', localidade: 'Cidade', telefone: '123', dataAsociamento: '', dataRenovacom: '', comentario: 'Comentario' };
    component.modo = EstadosPagina.guardar;
    component.bibliotecaForm.controls.nome.setValue('Biblioteca Actualizada');
    component.bibliotecaForm.controls.endereco.setValue('Rua 2');
    component.bibliotecaForm.controls.localidade.setValue('Cidade 2');
    component.bibliotecaForm.controls.telefone.setValue('567');
    component.bibliotecaForm.controls.comentario.setValue('');

    bibliotecasServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [],
      meta: { quantidade: 0 }
    }));
    bibliotecasServiceMock.update.mockReturnValueOnce(throwError(() => new Error('Error')));

    component.onSubmit(createSubmitEvent(EstadosPagina.guardar));

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Erro,
      mensagem: 'Nom se puido guardar da biblioteca.'
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
