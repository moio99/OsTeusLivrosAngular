import { Component, OnInit, signal, inject, effect } from '@angular/core';
import { catchError, EMPTY, first, of, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LivrosService, OutrosService, RelecturasService } from '@servizosApi';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { ConverterAData } from '../../../shared/classes/date-convert';
import { LayoutService, DadosPaginasService, UsuarioAppService } from '@servizosFlow';
import { DadosComplentarios, InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { Title } from '@angular/platform-browser';
import { EngadirEditarData } from '../../../shared/models/datas';
import { SimpleObjet } from '../../../shared/models/outros.model';
import { MultiDados, MultiSelecomDialogComponent } from '@componhentesComuns';
import { MatNativeDateModule } from '@angular/material/core';
import { environment, environments } from '../../../../environments/environment';
import { datasUltimosAnos, Livro, Outros, Relectura, RelecturaListado, RelecturasData, RelecturaData } from '@interfaces';
import { LivroRelecturasComponent } from './livro-relecturas.component';
import { LivroFormPresenterComponent } from './livro-form-presenter.component';
import { LivroFormStateService } from './livro-form-state.service';
import { BaseListadoDadosApi, Parametros, Resultado } from '../../../shared/models/base-dados';
import { rxResource } from '@angular/core/rxjs-interop';

export enum MultiGestom {
  autores = 1,
  generos = 2,
}

@Component({
  selector: 'omla-livro',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCheckboxModule
    , MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, LivroRelecturasComponent, LivroFormPresenterComponent ],
  templateUrl: './livro.component.html',
  styleUrls: ['./livro.component.scss'],
  providers: [RelecturasService, LivroFormStateService]    // LivroFormStateService para poder usar o servizo
})
export class LivroComponent implements OnInit {

  idLivro: string = '0';
  idRelectura: string = '0';      // > 0 Quando seja umha relectura
  dadosDoLivro: Livro | undefined;
  dadosDaRelectura: Relectura | undefined;
  nomePagina = 'livro';
  estadosPagina = EstadosPagina;
  modo = signal<EstadosPagina>(EstadosPagina.soVisualizar);
  disabledFormulario = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro ? true : false;
  modoRelectura = signal<boolean>(false);
  modoSalvadoRelectura = this.modo();
  multiGestom = MultiGestom;
  dadosComplentarios = DadosComplentarios;
  autoresLivro = signal<SimpleObjet[]>([]);
  generosLivro = signal<SimpleObjet[]>([]);
  private readonly formState = inject(LivroFormStateService);
  dadosRelecturas = signal<RelecturaListado[]>([]);
  diasLeitura = 0;

  pontuacomEstrelas: number | undefined;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private layoutService = inject(LayoutService);
  private usuarioAppService = inject(UsuarioAppService);
  private title = inject(Title);
  private outrosService = inject(OutrosService);
  private livrosService = inject(LivrosService);
  private relecturasService = inject(RelecturasService);
  private dialog = inject(MatDialog);
  private dadosPaginasService = inject(DadosPaginasService);
  livroForm = this.formState.livroForm;


  dadosApiResource = rxResource({
    stream: () => {
      const dados = this.usuarioAppService.getDadosOutros();
      if (dados) {
        return of(dados);
      }

      return this.outrosService.getTodo().pipe(
        first(),
        tap(v => this.usuarioAppService.setDadosOutros(v)),
        catchError((e) => {
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Erro, mensagem: 'Non se puideron obter os datos', duracom: 10
          });
          return EMPTY;
        })
      );
    }
  });

  constructor() {
    effect(() => {
      const dados = this.dadosApiResource.value();
      if (!dados?.bibliotecas?.data) return;

      // Só actualiza a lista completa
      this.formState.todasBibliotecasCombo.set(
        dados.bibliotecas.data
          .map(item => ({ id: item.id, value: item.nome }))
          .sort((a, b) => a.value.localeCompare(b.value))
      );
    });

    effect(() => {
      const dados = this.dadosApiResource.value();
      if (!dados?.editoriais?.data) return;

      // Só actualiza a lista completa
      this.formState.todasEditoriaisCombo.set(
        dados.editoriais.data
          .map(item => ({ id: item.id, value: item.nome }))
          .sort((a, b) => a.value.localeCompare(b.value))
      );
    });
  }

  ngOnInit(): void {
    let id = '0';
    this.title.setTitle(this.title.getTitle() + ' Engadir');
    this.route.queryParams
      .subscribe(params => {
        const parametros = params as Parametros;
        if (environment.whereIAm !== environments.pre && environment.whereIAm !== environments.pro) {
          if (parametros.id === '0')
            this.modo.set(EstadosPagina.engadir);
          else {
            this.modo.set(EstadosPagina.guardar);
          }
        } else
          this.modo.set(EstadosPagina.soVisualizar);
        id = parametros.id;
        this.idRelectura = parametros.idRelectura === undefined ? '0' : parametros.idRelectura;
        this.obterOutrosDados(parametros.id);
      }
    );
    this.idLivro = id;
  }

  private obterOutrosDados(idLivro: string): void {
    const dados = this.usuarioAppService.getDadosOutros();
    if (dados) {                                            // Já os tinhamos
      this.dadosOutrosObtidos(dados);
      this.obterDadosRelecturasELivro(idLivro);
    } else {
      this.outrosService
        .getTodo()          // Dados complementarios
        .pipe(first())
        .subscribe({
          next: (v: object) => {
            this.usuarioAppService.setDadosOutros(v);
            this.dadosOutrosObtidos(this.usuarioAppService.getDadosOutros());
            this.obterDadosRelecturasELivro(idLivro)
          },
          error: (e: unknown) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados', duracom: 10}); },
      });
    }
  }

  private dadosOutrosObtidos(dados: Outros | null) {
    if (dados) {

      if (dados.colecons?.data) {
        const result = this.formState.processarDadosCombo(
          dados.colecons.data,
          this.livroForm.controls.idColecom
        );
        this.formState.todasColeconsCombo = this.formState.todasColeconsCombo = result.combo;
        this.formState.colecons = result.signalFiltrado;
      }

      if (dados.estilos?.data) {
        const result = this.formState.processarDadosCombo(
          dados.estilos.data,
          this.livroForm.controls.idEstilo
        );
        this.formState.todosEstilosCombo = result.combo;
        this.formState.estilos = result.signalFiltrado;
      }

      if (dados.idiomas?.data) {
        const result = this.formState.processarDadosCombo(
          dados.idiomas.data,
          this.livroForm.controls.idioma
        );
        this.formState.todosIdiomasCombo = result.combo;
        this.formState.idiomas = result.signalFiltrado;

        const resultIdiomaOriginal = this.formState.processarDadosCombo(
          dados.idiomas.data,
          this.livroForm.controls.idiomaOriginal
        );
        this.formState.todosIdiomasCombo = resultIdiomaOriginal.combo;
        this.formState.idiomasOriginais = resultIdiomaOriginal.signalFiltrado;
      }

      if (dados.seriesLivro?.data) {
        const dadosSeries = dados.seriesLivro.data.map(s => ({id: s.id, nome: s.titulo}))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        const result = this.formState.processarDadosCombo(
          [{id: 0, nome: 'Som o primeiro'}, ...dadosSeries],
          this.livroForm.controls.serie, false
        );
        this.formState.todasSeriesLivrosCombo = result.combo;
        this.formState.seriesLivro = result.signalFiltrado;
      }

      /* if (idLivro == 0 && dados.ultimaLeitura) {
        let dateConvert = new DateConvert();
        let data = dateConvert.getDateFromMySQL(dados.ultimaLeitura);
        console.log('ultima Leitura anterior:', data);
        const dias = this.getDiasDendeUltimaLeitura(data);
        this.livroForm.controls.diasLeitura.setValue(dias.toString());
      } */

      if (dados.ultimasLeituras && dados.ultimasLeituras.length > 0) {
        this.setDiasDendeUltimaLeitura(dados.ultimasLeituras);
      }
    }
    else
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados', duracom: 10});
  }

    /**
   * Calcula os días pasados dende a última leitura
   * @param dados Matriz coas datas do ano actual e do anterior para colher a data mais recente e calcuar a partir dela.
   */
  private setDiasDendeUltimaLeitura(dados: datasUltimosAnos[]): void {
    if (!dados || dados.length === 0) return;

    const dateConvert = new ConverterAData();

    // Atopamos o obxecto coa data máis recente convertendo a milisegundos nun único paso
    const maiorDado = dados.reduce((max, actual) => {
      const timeMax = new Date(max.dataDoLivro).getTime();
      const timeActual = new Date(actual.dataDoLivro).getTime();
      return timeActual > timeMax ? actual : max;
    });

    // Convertemos o resultado ao formato personalizado EngadirEditarData
    const maiorData = dateConvert.getDataFromMySQL(maiorDado.dataDoLivro);

    // Calculamos e asignamos os días
    this.diasLeitura = this.getDiasDendeUltimaLeitura(maiorData);

    // Modificación reactiva se o Signal do modo está en 'engadir'
    if (this.modo() === EstadosPagina.engadir) {
      this.livroForm.controls.diasLeitura.setValue(this.diasLeitura.toString());
    }
  }

  private getDiasDendeUltimaLeitura(data: EngadirEditarData): number {
    if (!data || data.year === 0) return 0;

    // Creamos as dúas datas limpas ás 00:00:00 (Sen horas para evitar desfases)
    const dataMax = new Date();
    dataMax.setHours(0, 0, 0, 0);

    // Os meses en JavaScript van de 0 (Xaneiro) a 11 (Decembro)
    const dataMin = new Date(data.year, data.month - 1, data.day, 0, 0, 0, 0);

    // Restamos os milisegundos e dividimos polos ms que ten un día (1000ms * 60s * 60m * 24h)
    const diferenzaMilisegundos = dataMax.getTime() - dataMin.getTime();
    const milisegundosPorDia = 1000 * 60 * 60 * 24;

    // Math.floor redondea cara abaixo para obter os días enteiros transcorridos
    const diasPasados = Math.floor(diferenzaMilisegundos / milisegundosPorDia);

    // Devolvemos o resultado (se o cálculo dá negativo por erro, devolvemos 0)
    return diasPasados > 0 ? diasPasados : 0;
  }

  //#region Relecturas
  onGestomNovaRelectura() {
    // Obtem os dados do livro para guardalos mentres se crea a relectura, e assim poder voltar a eles
    this.dadosDoLivro = this.setDadosLivro();
    this.livroForm.controls.dataFimLeiturata.setValue('');
    this.livroForm.controls.diasLeitura.setValue(this.diasLeitura.toString());
    this.modoSalvadoRelectura = this.modo();
    this.modo.set(EstadosPagina.engadir);
    this.modoRelectura.set(true);
  }

  onCancelarNovaRelectura() {
    this.setDadosLivroForm();
    this.modo.set(this.modoSalvadoRelectura);
    this.modoRelectura.set(false);
  }

  private obterDadosRelecturasELivro(idLivro: string): void {
    this.relecturasService
      .getRelecturas(idLivro)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosRelecturasObtidos(v),
        error: (e: unknown) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados das relecturas', duracom: 10}); },
          complete: () => this.obterDadosDoLivro(idLivro)       // Dados do livro
    });
  }

  private dadosRelecturasObtidos(dadosChegando: object) {
    const dados = <RelecturasData>dadosChegando;
    if (dados && dados.data.length > 0) {
      this.dadosRelecturas.set(dados.data);
    }
    else
      this.dadosRelecturas.set([]);
  }

  onEditarRelectura(idRelectura: string){
    this.relecturasService
      .getRelectura(idRelectura)
      .pipe(first())
      .subscribe({
        next: (v) => this.amosarDadosRelectura(v),
        error: (e: unknown) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido borrara a relectura.'}); },
          complete: () => console.debug('completada a obtençom da relectura do livro')
    });
  }

  private amosarDadosRelectura(dados: RelecturaData) {
    if (!dados || !dados.data || dados.data.length === 0) {
      this.layoutService.amosarInfo({ tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados da relectura', duracom: 10 });
      return;
    }

    this.dadosDaRelectura = dados.data[0];
    this.onGestomNovaRelectura();
    if (this.disabledFormulario)
      this.modo.set(EstadosPagina.soVisualizar);
    else
      this.modo.set(EstadosPagina.guardar);
    this.formState.setDadosRelecturaForm(this.dadosDaRelectura);
  }

  guardarRelectura(event: any) {
    let relectura = this.setDadosRelectura();

    if (event.submitter.value === EstadosPagina.engadir) {
      this.relecturasService
        .postRelectura(relectura)
        .pipe(first())
        .subscribe({
          next: (v) => {console.debug(v), this.gestionarExitoRelectura(v, relectura)},
          error: (e: unknown) => {
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir a relectura.', duracom: 10});
            console.error(e) },
            complete: () => {
              this.modo.set(EstadosPagina.guardar);
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Relectura engadida.'});
              // console.debug('post completado');
            }
      });
    }
    else {
      this.relecturasService
        .putRelectura(relectura)
        .pipe(first())
        .subscribe({
          next: (v) => {console.debug(v), this.gestionarExitoRelectura(v, relectura)},
          error: (e: unknown) => {
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido guardar a relectura.', duracom: 10});
            console.error(e) },
            complete: () => {
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Relectura guardada.'});
            console.debug('put completado') }
      });
    }
  }

  setDadosRelectura(): Relectura {
    let dateConvert = new ConverterAData();
    let dFL = dateConvert.getData(this.livroForm.controls.dataFimLeiturata.value);
    let dE = dateConvert.getData(this.livroForm.controls.dataEdicom.value);

    let biblioteca = this.formState.todasBibliotecasCombo().find(option => option.value === this.livroForm.controls.idBiblioteca.value);
    let editorial = this.formState.todasEditoriaisCombo().find(option => option.value === this.livroForm.controls.idEditorial.value);
    let colecom = this.formState.todasColeconsCombo.find(option => option.value === this.livroForm.controls.idColecom.value);
    let idioma = this.formState.todosIdiomasCombo.find(option => option.value === this.livroForm.controls.idioma.value);
    let serie = this.formState.todasSeriesLivrosCombo.find(option => option.value === this.livroForm.controls.serie.value);

    let relectura: Relectura = {
      id: (this.dadosDaRelectura) ? this.dadosDaRelectura.id :'0',
      idLivro: this.dadosDoLivro!.id,
      titulo: String(this.livroForm.controls.titulo.value),
      idBiblioteca: (biblioteca) ? biblioteca.id : null,
      idEditorial: (editorial) ? editorial.id : null,
      idColecom: (colecom) ? colecom.id : null,
      isbn: (this.livroForm.controls.isbn.value) ? String(this.livroForm.controls.isbn.value) : null,
      paginas: (this.livroForm.controls.paginas.value) ? String(this.livroForm.controls.paginas.value) : null,
      paginasLidas: (!this.livroForm.controls.paginasLidas.value) ? null : String(this.livroForm.controls.paginasLidas.value),
      lido: (!this.livroForm.controls.lido.value) ? false : this.livroForm.controls.lido.value,
      diasLeitura: (this.livroForm.controls.diasLeitura.value) ? String(this.livroForm.controls.diasLeitura.value) : null,
      dataFimLeitura: (dFL.year > 0) ? dFL.year + '-' + dFL.month + '-' + dFL.day : '',
      idIdioma: (idioma) ? idioma.id : null,
      dataEdicom: (dE.year > 0) ? dE.year + '-' + dE.month + '-' + dE.day : '',
      numeroEdicom: (this.livroForm.controls.numeroEdicom.value) ? String(this.livroForm.controls.numeroEdicom.value) : null,
      electronico: (!this.livroForm.controls.electronico.value) ? false : this.livroForm.controls.electronico.value,
      somSerie: (!this.livroForm.controls.somSerie.value) ? false : this.livroForm.controls.somSerie.value,
      idSerie: (serie) ? serie.id : null,
      comentario: (this.livroForm.controls.comentario.value) ? String(this.livroForm.controls.comentario.value) : null,
      pontuacom: this.pontuacomEstrelas,
      // nom necesarios
      biblioteca: '',
      editorial: '',
      colecom: '',
    };

    return relectura;
  }

  private gestionarExitoRelectura(data: Resultado, relectura: Relectura) {
    if (data) {
      let info = <{idResult: string}>data;
      relectura.id = info.idResult;
      this.dadosDaRelectura = relectura;
      this.obterDadosRelecturasELivro(this.idLivro);

      this.setDadosLivroForm();
      this.modo.set(this.modoSalvadoRelectura);
      this.modoRelectura.set(false);
    }
  }

  onBorrarRelectura(relectura: RelecturaListado) {
    let pergunta = `Está certo de querer borrar a relectura ${relectura.titulo}`;
    if (relectura.dataFimLeitura) {
      let dateConvert = new ConverterAData();
      pergunta = `${pergunta} do día ${dateConvert.getDataString(relectura.dataFimLeitura, '/')}?`;
    }
    else
      pergunta += "?";
    if(confirm(pergunta)) {
      this.relecturasService
            .borrarRelectura(relectura.id)
            .pipe(first())
            .subscribe({
              next: (v: object) => console.debug(v),
              error: (e: unknown) => { console.error(e),
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido borrara a relectura.'}); },
                complete: () => { // console.debug('Borrado feito');
                this.obterDadosRelecturasELivro(this.idLivro);
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Relectura borrada.'}); }
          });
    }
  }
  //#endregion

  private obterDadosDoLivro(id: string): void {
    let livro = this.dadosPaginasService.getDadosPagina(id, this.nomePagina);
    if (livro && livro.elemento) {
      this.dadosDoLivro = livro.elemento;
      this.setDadoEngadido();
      this.setDadosLivroForm();
    }
    else {
      this.livrosService
        .getLivro(id)
        .pipe(first())
        .subscribe({
          next: (v: object) => this.dadosObtidosDoLivro(v),
          error: (e: unknown) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do livro', duracom: 10}); },
            complete: () => console.debug('completada a obtençom dos dados do livro')
      });
    }
  }

  /**
   * Meto os dados nos controis do html
   */
  private setDadosLivroForm() {
    if (this.dadosDoLivro) {
      this.generosLivro.set(this.dadosDoLivro.generos.map(value => ({ id: value.id, value: value.nome })));
      this.autoresLivro.set(this.dadosDoLivro.autores.map(value => ({ id: value.id, value: value.nome })));
      this.formState.setDadosLivroForm(this.dadosDoLivro);
      this.pontuacomEstrelas = this.dadosDoLivro.pontuacom;
    }
    else
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados do livro', duracom: 10});
  }

  /**
   * Gestiona os dados que se acavam de engadir, por ejemplo nova editorial, novo autor etc.
   */
  private setDadoEngadido() {
    let novoDado = this.dadosPaginasService.getNovoDadoLivro();
    if (novoDado && novoDado.elemento && this.dadosDoLivro) {
      const dadoLivro = { id: novoDado.elemento.id, nome: novoDado.elemento.value };
      switch (novoDado.tipo) {
        case DadosComplentarios.Autor: {
          const indexAtopado = this.dadosDoLivro.autores.findIndex(a => a.nome === 'Anónimo');
          if (indexAtopado >= 0)
            this.dadosDoLivro.autores.splice(indexAtopado, 1);
          this.dadosDoLivro.autores.push(dadoLivro);
          this.autoresLivro.set(this.dadosDoLivro.autores.map(value => ({ id: value.id, value: value.nome })));
          break
        }
        case DadosComplentarios.Genero: {
          this.dadosDoLivro.generos.push(dadoLivro);
          this.generosLivro.set(this.dadosDoLivro.generos.map(value => ({ id: value.id, value: value.nome })));
          break
        }
        case DadosComplentarios.Biblioteca: {
          this.actualizarCombo(this.formState.todasBibliotecasCombo(), novoDado.elemento);
          this.dadosDoLivro.idBiblioteca = novoDado.elemento.id;
          break
        }
        case DadosComplentarios.Editorial: {
          this.actualizarCombo(this.formState.todasEditoriaisCombo(), novoDado.elemento);
          this.dadosDoLivro.idEditorial = novoDado.elemento.id;
          break
        }
        case DadosComplentarios.Colecom: {
          this.actualizarCombo(this.formState.todasColeconsCombo, novoDado.elemento);
          this.dadosDoLivro.idColecom = novoDado.elemento.id;
          break
        }
        case DadosComplentarios.EstiloLiterario: {
          this.actualizarCombo(this.formState.todosEstilosCombo, novoDado.elemento);
          this.dadosDoLivro.idEstilo = novoDado.elemento.id;
          break
        }
      }
    }
    this.dadosPaginasService.setNovoDadoLivro(undefined);   // Como já está procesado, limpo
  }

  /**
   * Se nom está no listado do combo o engade e ordena.
   * @param elementosCombo total de elementos
   * @param novoElemento elemento a engadir
   */
  private actualizarCombo(elementosCombo: SimpleObjet[], novoElemento: SimpleObjet): void {
    const index = elementosCombo.findIndex(item => item.id === novoElemento.id);

    if (index < 0) {
      elementosCombo.push(novoElemento);
    } else {
      elementosCombo.splice(index, 1, novoElemento);
    }
    elementosCombo.sort((a, b) => a.value.localeCompare(b.value));
  }

  private dadosObtidosDoLivro(data: object) {
    const dados = data as BaseListadoDadosApi<Livro>;
    if ((dados.data?.length ?? 0) > 0) {
      this.dadosDoLivro = dados.data[0];
      this.setDadosLivroForm();

      if (this.idRelectura && this.idRelectura !== '0') {
        // No caso de que se chegou à pagina dende a petiçom de umha relectura vaise ir a polos seus dados para amosala
        this.onEditarRelectura(this.idRelectura);
        this.idRelectura = '0';
      }
    }
  }

  onGestomMulti(opcom: MultiGestom): void {
    const dados = this.usuarioAppService.getDadosOutros();
    let multiDados: MultiDados = {total: [], escolma: []};
    switch (opcom) {
      case MultiGestom.autores: {
        if (dados?.autores?.data?.length) {
          multiDados = {
            total: dados.autores.data
              .filter(autor => !this.autoresLivro().some(a => a.id === autor.id))
              .map(autor => ({ id: autor.id, value: autor.nome }))
              .sort((a, b) => a.value.localeCompare(b.value)),
            escolma: [...this.autoresLivro()]
          };
        }
        else {
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom há autores disponhiveis'});
        }
        break;
      }
      case MultiGestom.generos: {
        if (dados && dados.generos && dados.generos.data.length > 0) {
          multiDados = {
            total: dados.generos.data
              .filter(genero => !this.generosLivro().some(a => a.id === genero.id))
              .map(genero => ({ id: genero.id, value: genero.nome }))
              .sort((a, b) => a.value.localeCompare(b.value)),
            escolma: [...this.generosLivro()]
          };
        }
        else {
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom há géneros disponhiveis'});
        }
        break;
      }
    }

    const dialogRef = this.dialog.open(MultiSelecomDialogComponent, {
      maxWidth: "600px",
      data: multiDados
    });

    dialogRef.afterClosed().subscribe((dialogResult: { escolma: SimpleObjet[]; }) => {
      switch (opcom) {
        case MultiGestom.autores: {
          this.autoresLivro.set(dialogResult.escolma);
          break;
        }
        case MultiGestom.generos: {
          this.generosLivro.set(dialogResult.escolma);
          break;
        }
      }
    });
  }

  onIrPagina(rota: string, id: number): void {
    let livro = this.setDadosLivro();
    this.dadosPaginasService.setDadosPagina({id: this.idLivro, nomePagina: this.nomePagina, elemento: livro});
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
  }

  onIrPaginaBiblioteca(): void{
    this.onIrPaginaGenerico(DadosComplentarios.Biblioteca, '/bibliotecas/biblioteca');
  }

  onIrPaginaEditorial(): void{
    this.onIrPaginaGenerico(DadosComplentarios.Editorial, '/editoriais/editorial');
  }

  onIrPaginaColecom(): void{
    this.onIrPaginaGenerico(DadosComplentarios.Colecom, '/colecons/colecom');
  }

  onIrPaginaEstilo(): void{
    this.onIrPaginaGenerico(DadosComplentarios.EstiloLiterario, '/estilos-literarios/estilo-literario');
  }

  onIrPaginaGenerico(tipoDado: DadosComplentarios, rota: string): void{
    let elemento: SimpleObjet | undefined;
    switch (tipoDado) {
      case DadosComplentarios.Biblioteca: {
          elemento = this.formState.todasBibliotecasCombo().find(option => option.value === this.livroForm.controls.idBiblioteca.value);
          break;
      }
      case DadosComplentarios.Editorial: {
          elemento = this.formState.todasEditoriaisCombo().find(option => option.value === this.livroForm.controls.idEditorial.value);
          break;
      }
      case DadosComplentarios.Colecom: {
          elemento = this.formState.todasColeconsCombo.find(option => option.value === this.livroForm.controls.idColecom.value);
          break;
      }
      case DadosComplentarios.EstiloLiterario: {
          elemento = this.formState.todosEstilosCombo.find(option => option.value === this.livroForm.controls.idEstilo.value);
          break;
      }
    }
    if (elemento) {
      let livro = this.setDadosLivro();
      this.dadosPaginasService.setDadosPagina({id: this.idLivro, nomePagina: this.nomePagina, elemento: livro});
      this.dadosPaginasService.setNovoDadoLivro({tipo: tipoDado, elemento: elemento});
      this.layoutService.amosarInfo(undefined);
      this.router.navigateByUrl(rota + '?id=' + elemento.id);
    }
  }

  onIrPaginaEngadirAutor(rota: string, tipo: DadosComplentarios): void{
    this.guardarDadosDoLivro(tipo);
    this.router.navigate([rota], {
      state: { id: '0', idRelectura: 'algo mais de probas' },
    });
  }

  onIrPaginaEngadir(rota: string, tipo: DadosComplentarios): void{
    this.guardarDadosDoLivro(tipo);
    this.router.navigateByUrl(rota + '?id=0');
  }

  onEngadirComplementario(tipo: DadosComplentarios): void {
    const rotas: Partial<Record<DadosComplentarios, string>> = {
      [DadosComplentarios.Biblioteca]: '/bibliotecas/biblioteca',
      [DadosComplentarios.Editorial]: '/editoriais/editorial',
      [DadosComplentarios.Colecom]: '/colecons/colecom',
      [DadosComplentarios.EstiloLiterario]: '/estilos-literarios/estilo-literario'
    };
    const rota = rotas[tipo];
    if (rota) {
      this.onIrPaginaEngadir(rota, tipo);
    }
  }

  private guardarDadosDoLivro(tipo: DadosComplentarios) {
    let livro = this.setDadosLivro();
    this.dadosPaginasService.setDadosPagina({id: livro.id, nomePagina: this.nomePagina, elemento: livro});
    this.dadosPaginasService.setNovoDadoLivro({tipo: tipo, elemento: undefined});
    this.layoutService.amosarInfo(undefined);
  }

  onSomSerie(event:MatCheckboxChange) {
    if (event.checked) {
      this.livroForm.controls.serie.enable();
    }
    else {
      this.livroForm.controls.serie.setValue('');
      this.livroForm.controls.serie.disable();
    }
  }

  onNovaPontuacom(pontuacom: number | undefined) {
    if (!this.modoRelectura()) {
      if (this.dadosDoLivro) {
        this.dadosDoLivro.pontuacom = pontuacom;
      }
    }
    else {
      if (this.dadosDaRelectura) {
        this.dadosDaRelectura.pontuacom = pontuacom;
      }
    }

    this.pontuacomEstrelas = pontuacom;
  }

  onSubmit(event: any) {
    if (this.modoRelectura()) {
      this.guardarRelectura(event);
    }
    else {
      if (this.livroForm.valid) {
        let livroRepetido: BaseListadoDadosApi<Livro>;
        this.livrosService
          .getLivroPorTitulo(String(this.livroForm.controls.titulo.value).trim())
          .pipe(first())
          .subscribe({
            next: (v) => livroRepetido = v,
            error: (e: unknown) => { console.error(e),
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do livro.'}); },
              complete: () => this.guardarLivro(event, livroRepetido)
        });
      }
    }
  }

  guardarLivro(event: any, livroRepetido: BaseListadoDadosApi<Livro>) {
    if (livroRepetido != undefined && livroRepetido.meta.quantidade > 0 && (
      (event.submitter.value === EstadosPagina.engadir)
      ||
      (event.submitter.value !== EstadosPagina.engadir && livroRepetido.meta.id != this.dadosDoLivro?.id))) { // se está actualizando os ids deben ser inguais
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'O título do livro já existe na base de dados'});
    }
    else {
      let livro = this.setDadosLivro();

      if (event.submitter.value === EstadosPagina.engadir) {
        this.livrosService
          .postLivro(livro)
          .pipe(first())
          .subscribe({
            next: (v) => {console.debug(v), this.gestionarExito(v, livro)},
            error: (e: unknown) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir o livro.', duracom: 10});
              console.error(e) },
              complete: () => {
                this.modo.set(EstadosPagina.guardar);
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Livro engadido.'});
                // console.debug('post completado');
              }
        });
      }
      else {
        this.livrosService
          .putLivro(livro)
          .pipe(first())
          .subscribe({
            next: (v) => {console.debug(v), this.gestionarExito(v, livro)},
            error: (e: unknown) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido guardar o livro.', duracom: 10});
              console.error(e) },
              complete: () => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Livro guardado.'});
              console.debug('put completado') }
        });
      }
    }
  }

  setDadosLivro(): Livro {
    const dados = this.usuarioAppService.getDadosOutros();
    const autorAnonimo = dados?.autores?.data.find(autor => autor.nome === 'Anónimo');
    return this.formState.criarLivro(
      this.dadosDoLivro?.id ?? '0',
      this.autoresLivro(),
      this.generosLivro(),
      this.pontuacomEstrelas,
      autorAnonimo
    );
  }

  private gestionarExito(data: Resultado, livro: Livro) {
    if (data) {
      livro.id = data.idResult;
      this.dadosDoLivro = livro;
    }
  }
}
