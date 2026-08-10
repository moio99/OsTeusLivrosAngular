import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError, Observable } from 'rxjs';
import { ColecomComponent } from './colecom.component';
import { Colecom, ColecomForm } from '../../../core/models/colecom.interface';
import { ColeconsService } from '../../../core/services/api/colecons.service';
import { LivrosService } from '../../../core/services/api/livros.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { UsuarioAppService } from '../../../core/services/flow/usuario-app.service';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { DadosComplentarios, InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';

describe('ColecomComponent', () => {
  let component: ColecomComponent;
  let fixture: ComponentFixture<ColecomComponent>;
  let coleconsServiceMock: jest.Mocked<ColeconsService> & {
    create: jest.Mock<Observable<any>, [Colecom]>;
    update: jest.Mock<Observable<any>, [Colecom]>;
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
    coleconsServiceMock = {
      getPorId: jest.fn(),
      getPorNome: jest.fn(),
      create: jest.fn<Observable<any>, [Colecom]>(),
      update: jest.fn<Observable<any>, [Colecom]>(),
    } as unknown as jest.Mocked<ColeconsService> & {
      create: jest.Mock<Observable<any>, [Colecom]>;
      update: jest.Mock<Observable<any>, [Colecom]>;
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
      getLivrosPorColecom: jest.fn(),
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
      imports: [ColecomComponent],
      providers: [
        { provide: ColeconsService, useValue: coleconsServiceMock },
        { provide: 'MyServiceToken', useValue: coleconsServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: LivrosService, useValue: livrosServiceMock },
        { provide: DadosPaginasService, useValue: dadosPaginasServiceMock },
        { provide: UsuarioAppService, useValue: usuarioAppServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ColecomComponent);
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
    expect(coleconsServiceMock.getPorId).not.toHaveBeenCalled();
  });

  it('should initialize in edit mode and fetch colecom data when id is not 0', () => {
    activatedRouteMock.queryParams = of({ id: '1' });
    coleconsServiceMock.getPorId.mockReturnValueOnce(of({
      data: [{ id: 1, nome: 'Colecom Teste', isbn: '1234', web: 'https://teste', comentario: 'Comentario' }],
      meta: {}
    }));

    component.ngOnInit();

    expect(component.modo).toBe(EstadosPagina.guardar);
    expect(coleconsServiceMock.getPorId).toHaveBeenCalledWith('1');
    expect(component.colecomForm.controls.nome.value).toBe('Colecom Teste');
    expect(component.colecomForm.controls.isbn.value).toBe('1234');
    expect(component.colecomForm.controls.web.value).toBe('https://teste');
    expect(component.colecomForm.controls.comentario.value).toBe('Comentario');
  });

  it('should show an error when fetching colecom data fails', () => {
    activatedRouteMock.queryParams = of({ id: '1' });
    coleconsServiceMock.getPorId.mockReturnValueOnce(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(expect.objectContaining({
      tipo: InformacomPeTipo.Erro,
      mensagem: expect.stringContaining('Nom se puiderom obter os dados da cole')
    }));
  });

  it('should create a new colecom when form is valid and no duplicate exists', () => {
    component.colecomForm.controls.nome.setValue('Colecom Teste');
    component.colecomForm.controls.isbn.setValue('1234');
    component.colecomForm.controls.web.setValue('https://teste');
    component.colecomForm.controls.comentario.setValue('Comentario');

    coleconsServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [],
      meta: { quantidade: 0 }
    }));
    coleconsServiceMock.create.mockReturnValueOnce(of({ idResult: 1, meta: { id: 1 } }));
    dadosPaginasServiceMock.getNovoDado.mockReturnValueOnce({ tipo: DadosComplentarios.Colecom, elemento: undefined });

    component.onSubmit(createSubmitEvent(EstadosPagina.engadir));

    expect(coleconsServiceMock.create).toHaveBeenCalledWith(expect.objectContaining({
      nome: 'Colecom Teste',
      isbn: '1234',
      web: 'https://teste',
      comentario: 'Comentario'
    }));
    expect(usuarioAppServiceMock.setGenero).not.toHaveBeenCalled();
    expect(dadosPaginasServiceMock.setNovoDado).toHaveBeenCalledWith(expect.objectContaining({
      elemento: { id: 1, value: 'Colecom Teste' }
    }));
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should show a duplicate warning when a colecom with the same name exists', () => {
    component.colecomForm.controls.nome.setValue('Colecom Teste');
    component.colecomForm.controls.isbn.setValue('1234');
    component.colecomForm.controls.web.setValue('https://teste');
    component.colecomForm.controls.comentario.setValue('Comentario');

    coleconsServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [{ id: 1, nome: 'Colecom Teste', isbn: '1234', web: 'https://teste', comentario: 'Comentario' }],
      meta: { quantidade: 1, id: 1 }
    }));

    component.onSubmit(createSubmitEvent(EstadosPagina.engadir));

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Aviso,
      mensagem: 'O nome da colecom já existe na base de dados'
    });
    expect(coleconsServiceMock.create).not.toHaveBeenCalled();
  });

  it('should not submit when the form is invalid', () => {
    component.colecomForm.controls.nome.setValue('');
    component.colecomForm.controls.isbn.setValue('1234');
    component.colecomForm.controls.web.setValue('https://teste');
    component.colecomForm.controls.comentario.setValue('Comentario');

    component.onSubmit(createSubmitEvent(EstadosPagina.engadir));

    expect(coleconsServiceMock.getPorNome).not.toHaveBeenCalled();
    expect(coleconsServiceMock.create).not.toHaveBeenCalled();
  });

  it('should show an error when create fails', () => {
    component.colecomForm.controls.nome.setValue('Colecom Teste');
    component.colecomForm.controls.isbn.setValue('1234');
    component.colecomForm.controls.web.setValue('https://teste');
    component.colecomForm.controls.comentario.setValue('Comentario');

    coleconsServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [],
      meta: { quantidade: 0 }
    }));
    coleconsServiceMock.create.mockReturnValueOnce(throwError(() => new Error('Error')));

    component.onSubmit(createSubmitEvent(EstadosPagina.engadir));

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Erro,
      mensagem: 'Nom se puido engadir da colecom.'
    });
  });

  it('should update an existing colecom when editing', () => {
    component.dadosDoElemento = { id: 1, nome: 'Colecom Teste', isbn: '1234', web: 'https://teste', comentario: 'Comentario' };
    component.modo = EstadosPagina.guardar;
    component.colecomForm.controls.nome.setValue('Colecom Actualizada');
    component.colecomForm.controls.isbn.setValue('5678');
    component.colecomForm.controls.web.setValue('https://actualizada');
    component.colecomForm.controls.comentario.setValue('');

    coleconsServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [],
      meta: { quantidade: 0 }
    }));
    coleconsServiceMock.update.mockReturnValueOnce(of({ idResult: 1 }));

    component.onSubmit(createSubmitEvent(EstadosPagina.guardar));

    expect(coleconsServiceMock.update).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      nome: 'Colecom Actualizada',
      isbn: '5678',
      web: 'https://actualizada',
      comentario: ''
    }));
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Sucesso,
      mensagem: 'da colecom guardada.'
    });
  });

  it('should show an error when update fails', () => {
    component.dadosDoElemento = { id: 1, nome: 'Colecom Teste', isbn: '1234', web: 'https://teste', comentario: 'Comentario' };
    component.modo = EstadosPagina.guardar;
    component.colecomForm.controls.nome.setValue('Colecom Actualizada');
    component.colecomForm.controls.isbn.setValue('5678');
    component.colecomForm.controls.web.setValue('https://actualizada');
    component.colecomForm.controls.comentario.setValue('');

    coleconsServiceMock.getPorNome.mockReturnValueOnce(of({
      data: [],
      meta: { quantidade: 0 }
    }));
    coleconsServiceMock.update.mockReturnValueOnce(throwError(() => new Error('Error')));

    component.onSubmit(createSubmitEvent(EstadosPagina.guardar));

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Erro,
      mensagem: 'Nom se puido guardar da colecom.'
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
