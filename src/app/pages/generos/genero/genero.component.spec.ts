import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneroComponent } from './genero.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { GenerosService } from '../../../core/services/api/generos.service';
import { LivrosService } from '../../../core/services/api/livros.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { FormBuilder } from '@angular/forms';
import { DadosComplentarios, InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';

describe('GeneroComponent', () => {
  let component: GeneroComponent;
  let fixture: ComponentFixture<GeneroComponent>;
  let generosService: jest.Mocked<GenerosService>;
  let layoutService: jest.Mocked<LayoutService>;
  let dadosPaginasService: jest.Mocked<DadosPaginasService>;
  let router: jest.Mocked<Router>;
  let activatedRoute: any;
  let locationMock: jest.Mocked<Location>;

  beforeEach(async () => {
    const generosServiceMock = {
      getGenero: jest.fn(),
      postGenero: jest.fn(),
      putGenero: jest.fn(),
      getGeneroPorNome: jest.fn(),
    };

    const layoutServiceMock = {
      amosarInfo: jest.fn(),
    };

    const livrosServiceMock = {
      getListadoLivrosPorGenero: jest.fn(),
    };

    const dadosPaginasServiceMock = {
      getNovoDado: jest.fn(),
      setNovoDado: jest.fn(),
    };

    activatedRoute = {
      queryParams: of({ id: '1' }),
    };

    router = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn(),
    } as any;

    locationMock = {
      back: jest.fn(),
    } as unknown as jest.Mocked<Location>;

    await TestBed.configureTestingModule({
     // declarations: [GeneroComponent],    Isto nom vale porque é standalone
      providers: [
        { provide: GenerosService, useValue: generosServiceMock },
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: LivrosService, useValue: livrosServiceMock },
        { provide: DadosPaginasService, useValue: dadosPaginasServiceMock },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: Location, useValue: locationMock },
        FormBuilder,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GeneroComponent);
    component = fixture.componentInstance;
    generosService = TestBed.inject(GenerosService) as jest.Mocked<GenerosService>;
    layoutService = TestBed.inject(LayoutService) as jest.Mocked<LayoutService>;
    dadosPaginasService = TestBed.inject(DadosPaginasService) as jest.Mocked<DadosPaginasService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in add mode and fetch genre data', () => {
    activatedRoute.queryParams = of({ id: '0' });
    component.ngOnInit();
    expect(component.modo).toBe(component.engadir);

    activatedRoute.queryParams = of({ id: '1' });
    generosService.getGenero.mockReturnValueOnce(of({ genero: [{ id: 1, nome: 'Ficción', comentario: 'Libros de ficción' }] }));

    component.ngOnInit();

    expect(component.modo).toBe(component.guardar);
    expect(generosService.getGenero).toHaveBeenCalledWith('1');
  });

  it('should handle error fetching genre data', () => {
    activatedRoute.queryParams = of({ id: '1' });
    generosService.getGenero.mockReturnValueOnce(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(layoutService.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Erro,
      mensagem: 'Nom se puiderom obter os dados do género.'
    });
  });

  it('should submit the form and create a new genre - guardarGenero', () => {
    component.generoForm.controls.nome.setValue('Ficción');
    component.generoForm.controls.comentario.setValue('Comentario');

    // Simular respuesta al crear un nuevo género
    generosService.postGenero.mockReturnValueOnce(of({ meta: {
      id: 1,
      nome: 'Ficción',
      comentario: 'Comentario'
    } }));

    const mockNovoDado = {
      tipo: DadosComplentarios.Genero, // Ajusta este valor basado en tu definición de NovoDado
      elemento: undefined // Asegúrate de que profundizas en la definición si es necesario
    };

    // FGG: postGenero despois de recibir a info vai à funcom this.gestionarRetroceso(v, genero) e dentro cháma-se a getNovoDado()
    jest.spyOn(dadosPaginasService, 'getNovoDado').mockReturnValue(mockNovoDado);

    // Simular getGeneroPorNombre para que no falle
    generosService.getGeneroPorNome.mockReturnValueOnce(of({ meta: { cantidad: 0 }})); // Simulando que el nombre no está repetido

    // FGG: Se envía o formulario que fai que se guarde
    component.onSubmit({ submitter: { value: component.engadir } });

    expect(generosService.postGenero).toHaveBeenCalledWith({
      id: 1,
      nome: 'Ficción',
      comentario: 'Comentario'
    });

    expect(layoutService.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Sucesso,
      mensagem: 'Género engadido.'
    });
    expect(layoutService.amosarInfo).toHaveBeenCalledWith(undefined); // Check for clearing info message
  });


  it('should not create a genre if the form is invalid - guardarGenero que já existe generoRepetido', () => {
    component.generoForm.controls.nome.setValue('Ficción');
    component.generoForm.controls.comentario.setValue('Comentario');

    // Simular getGeneroPorNombre para que no falle
    generosService.getGeneroPorNome.mockReturnValueOnce(of({ meta: { quantidade: 1 }})); // Simulando que el nombre no está repetido

    // FGG: Se envía o formulario que fai que se guarde
    component.onSubmit({ submitter: { value: component.engadir } });

    expect(layoutService.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Aviso,
      mensagem: 'O nome do género já existe na base de dados'
    });
  });

  it('should not create a genre if the form is invalid - guardarGenero', () => {
    // FGG: Se envía o formulario que fai que se guarde
    component.onSubmit({ submitter: { value: component.engadir } });

    expect(generosService.postGenero).not.toHaveBeenCalled();
  });

  it('should handle error when submitting the form to create genre - guardarGenero', () => {
    component.generoForm.controls.nome.setValue('Ficción');

    generosService.postGenero.mockReturnValueOnce(throwError(() => new Error('Error')));

    // Simular getGeneroPorNombre para que no falle
    generosService.getGeneroPorNome.mockReturnValueOnce(of({ meta: { cantidad: 0 }})); // Simulando que el nombre no está repetido

    // FGG: Se envía o formulario que fai que se guarde
    component.onSubmit({ submitter: { value: component.engadir } });

    expect(layoutService.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Erro,
      mensagem: 'Nom se puido engadir o género.'
    });
  });

  it('should update an existing genre - guardarGenero', () => {
    component.dadosDoGenero = { id: 1, nome: 'Ficción', comentario: 'Comentario' };
    component.generoForm.controls.nome.setValue('Ficción Actualizada');

    generosService.putGenero.mockReturnValueOnce(of({ meta: { id: 1 } }));

    // Simular getGeneroPorNombre para que no falle
    generosService.getGeneroPorNome.mockReturnValueOnce(of({ meta: { cantidad: 0 }})); // Simulando que el nombre no está repetido

    // FGG: Se envía o formulario que fai que se guarde
    component.onSubmit({ submitter: { value: component.guardar } });

    expect(generosService.putGenero).toHaveBeenCalledWith({
      id: 1,
      nome: 'Ficción Actualizada',
      comentario: ''
    });

    expect(layoutService.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Sucesso,
      mensagem: 'Género guardado.'
    });
  });

  it('should handle error when submitting the form to update genre - guardarGenero', () => {
    component.dadosDoGenero = { id: 1, nome: 'Ficción', comentario: 'Comentario' };
    component.generoForm.controls.nome.setValue('Ficción Actualizada');

    generosService.putGenero.mockReturnValueOnce(throwError(() => new Error('Error')));

    // Simular getGeneroPorNombre para que no falle
    generosService.getGeneroPorNome.mockReturnValueOnce(of({ meta: { cantidad: 0 }})); // Simulando que el nombre no está repetido

    // FGG: Se envía o formulario que fai que se guarde
    component.onSubmit({ submitter: { value: component.guardar } });

    expect(layoutService.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Erro,
      mensagem: 'Nom se puido guardar o género.'
    });
  });

  it('should go back to the previous page on cancel', () => {
    component.onCancelar();

    expect(dadosPaginasService.setNovoDado).toHaveBeenCalledWith(undefined);
    expect(layoutService.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(locationMock.back).toHaveBeenCalled(); // Assuming location.back() is a redirect, you might need to mock that.
  });

  it('should navigate to a specific page', () => {
    component.onIrPagina('/livros/livro', '1', '0');

    expect(layoutService.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/livros/livro?id=1&idRelectura=0');
  });
});
