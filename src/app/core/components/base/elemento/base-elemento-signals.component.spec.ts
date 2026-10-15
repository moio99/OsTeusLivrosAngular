import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DadosComplentarios, InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { BaseListadoDadosApi, ResultadoMeta } from '../../../../shared/models/base-dados';
import { NovoDado } from '../../../services/flow/dados-paginas.service';
import { DadosOutrosService } from '../../../services/flow/dados-outros.service';
import { DadosPaginasService } from '../../../services/flow/dados-paginas.service';
import { ListadoLivros } from '../../../models/listado-livros.interface';
import { Genero } from '../../../models/genero.interface';
import { LayoutService } from '../../../services/flow/layout.service';
import { BaseElementoSignalsComponent } from './base-elemento-signals.component';

@Component({
  standalone: true,
  template: '',
})
class CompoñenteBaseDeProba extends BaseElementoSignalsComponent<Genero> {
  datosAplicados: Genero | undefined;

  protected aplicarDatosAoFormulario(datos: Genero): void {
    this.datosAplicados = datos;
  }

  obterLivros(data: object): ListadoLivros[] {
    return this.dadosLivrosElementoObtidos(data);
  }

  obterElemento(dados: BaseListadoDadosApi<Genero>): Genero | undefined {
    return this.dadosObtidos(dados);
  }

  manexarErro(erro: unknown, complemento: string) {
    return this.manexarErroSoporte(erro, complemento);
  }

  xestionarRetroceso(data: ResultadoMeta, elemento: Genero, tipo: DadosComplentarios): void {
    this.gestionarRetroceso(data, elemento, tipo);
  }
}

describe('BaseElementoSignalsComponent', () => {
  let fixture: ComponentFixture<CompoñenteBaseDeProba>;
  let component: CompoñenteBaseDeProba;
  let layoutServiceMock: { amosarInfo: jest.Mock };
  let routerMock: { navigateByUrl: jest.Mock };
  let locationMock: { back: jest.Mock };
  let dadosPaginasServiceMock: {
    getNovoDadoLivro: jest.Mock;
    setNovoDadoLivro: jest.Mock;
  };
  let dadosOutrosServiceMock: { setElementoDadosOutrosCache: jest.Mock };

  beforeEach(async () => {
    layoutServiceMock = { amosarInfo: jest.fn() };
    routerMock = { navigateByUrl: jest.fn() };
    locationMock = { back: jest.fn() };
    dadosPaginasServiceMock = {
      getNovoDadoLivro: jest.fn(),
      setNovoDadoLivro: jest.fn(),
    };
    dadosOutrosServiceMock = { setElementoDadosOutrosCache: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [CompoñenteBaseDeProba],
      providers: [
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
        { provide: DadosPaginasService, useValue: dadosPaginasServiceMock },
        { provide: DadosOutrosService, useValue: dadosOutrosServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompoñenteBaseDeProba);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear o compoñente de proba', () => {
    expect(component).toBeTruthy();
  });

  it('debería devolver os libros contidos nos datos recibidos', () => {
    const libros = [{ id: '1', titulo: 'Libro de proba' }] as ListadoLivros[];

    expect(component.obterLivros({ data: libros, meta: {} })).toBe(libros);
  });

  it('debería devolver o primeiro elemento e aplicalo ao formulario', () => {
    const genero: Genero = { id: 1, nome: 'Fantasia' };

    expect(component.obterElemento({ data: [genero], meta: {} })).toBe(genero);
    expect(component.datosAplicados).toBe(genero);
  });

  it('debería devolver undefined se non hai elementos que aplicar', () => {
    expect(component.obterElemento({ data: [], meta: {} })).toBeUndefined();
    expect(component.datosAplicados).toBeUndefined();
  });

  it('debería amosar unha mensaxe de erro e devolver unha lista baleira observable', () => {
    const erro = new Error('Fallou a petición');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    let resultado: unknown;

    component.manexarErro(erro, 'do xénero').subscribe((valor) => resultado = valor);

    expect(consoleErrorSpy).toHaveBeenCalledWith(erro);
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith({
      tipo: InformacomPeTipo.Erro,
      mensagem: 'Nom se puiderom obter os dados do xénero.',
    });
    expect(resultado).toEqual([]);
    consoleErrorSpy.mockRestore();
  });

  it('debería actualizar e gardar o elemento ao retroceder se hai un novo dato de libro', () => {
    const elemento: Genero = { id: 1, nome: 'Fantasia' };
    const novoDado: NovoDado = {
      tipo: DadosComplentarios.Genero,
      elemento: { id: 1, value: 'Fantasia' },
    };
    dadosPaginasServiceMock.getNovoDadoLivro.mockReturnValue(novoDado);

    component.xestionarRetroceso({ idResult: 7, meta: { id: '7' } }, elemento, DadosComplentarios.Genero);

    expect(elemento.id).toBe(7);
    expect(dadosOutrosServiceMock.setElementoDadosOutrosCache)
      .toHaveBeenCalledWith(elemento, DadosComplentarios.Genero);
    expect(dadosPaginasServiceMock.setNovoDadoLivro).toHaveBeenCalledWith({
      tipo: DadosComplentarios.Genero,
      elemento: { id: 7, value: 'Fantasia' },
    });
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('non debería xestionar o retroceso se a operación non devolve un identificador válido', () => {
    const elemento: Genero = { id: 1, nome: 'Fantasia' };

    component.xestionarRetroceso({ idResult: 0, meta: { id: '0' } }, elemento, DadosComplentarios.Genero);

    expect(dadosOutrosServiceMock.setElementoDadosOutrosCache).not.toHaveBeenCalled();
    expect(dadosPaginasServiceMock.getNovoDadoLivro).not.toHaveBeenCalled();
    expect(locationMock.back).not.toHaveBeenCalled();
  });

  it('debería actualizar a caché sen retroceder se non hai un novo dato de libro', () => {
    const elemento: Genero = { id: 1, nome: 'Fantasia' };
    dadosPaginasServiceMock.getNovoDadoLivro.mockReturnValue(undefined);

    component.xestionarRetroceso({ idResult: 7, meta: { id: '7' } }, elemento, DadosComplentarios.Genero);

    expect(elemento.id).toBe(7);
    expect(dadosOutrosServiceMock.setElementoDadosOutrosCache)
      .toHaveBeenCalledWith(elemento, DadosComplentarios.Genero);
    expect(dadosPaginasServiceMock.setNovoDadoLivro).not.toHaveBeenCalled();
    expect(locationMock.back).not.toHaveBeenCalled();
  });

  it('debería navegar á ruta solicitada e ocultar a mensaxe informativa', () => {
    component.onIrPagina('/xeneros/xenero', 4);

    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/xeneros/xenero?id=4');
  });

  it('debería limpar o novo dato e retroceder ao cancelar', () => {
    component.onCancelar();

    expect(dadosPaginasServiceMock.setNovoDadoLivro).toHaveBeenCalledWith(undefined);
    expect(layoutServiceMock.amosarInfo).toHaveBeenCalledWith(undefined);
    expect(locationMock.back).toHaveBeenCalled();
  });
});
