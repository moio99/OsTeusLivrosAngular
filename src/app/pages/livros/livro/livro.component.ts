import { Component, OnInit, signal, inject, effect, DestroyRef } from '@angular/core';
import { catchError, EMPTY, first, forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GraficosService, LivrosService, OutrosService, RelecturasService } from '@servizosApi';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { Title } from '@angular/platform-browser';
import { MultiDados, MultiSelecomDialogComponent } from '@componhentesComuns';
import { MatNativeDateModule } from '@angular/material/core';
import { datasUltimosAnos, Livro, Relectura, RelecturaListado, RelecturaData, ObjetoSimpleIdNome } from '@interfaces';
import { LivroRelecturasComponent } from './livro-relecturas.component';
import { LivroFormPresenterComponent } from './livro-form-presenter.component';
import { LivroFormStateService } from './livro-form-state.service';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { EstadosPagina, DadosComplentarios, InformacomPeTipo } from '@enumerados';
import { SimpleObjet, Parametros, EngadirEditarData, Resultado, BaseListadoDadosApi, SerieLivro } from '@models';
import { AuthService, LayoutService, DadosOutrosService, DadosPaginasService, DadosPagina } from '@servizosFlow';
import { environment, environments } from '../../../../environments/environment';
import { ConverterAData } from '../../../shared/classes/date-convert';

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
  providers: [RelecturasService, LivroFormStateService, GraficosService]    // LivroFormStateService para poder usar o servizo
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
  dadosRelecturas = signal<RelecturaListado[]>([]);
  diasLeitura = 0;

  pontuacomEstrelas: number | undefined;

  private readonly formState = inject(LivroFormStateService);
  livroForm = this.formState.livroForm;
  private readonly authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private layoutService = inject(LayoutService);
  private dadosOutrosService = inject(DadosOutrosService);
  private title = inject(Title);
  private outrosService = inject(OutrosService);
  private livrosService = inject(LivrosService);
  private relecturasService = inject(RelecturasService);
  private dialog = inject(MatDialog);
  private dadosPaginasService = inject(DadosPaginasService);
  private readonly graficosService = inject(GraficosService);
  private readonly translocoService = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);

  dadosApiResource = rxResource({   // para o ejemplo de combo com signals
    stream: () => {
      const dados = this.dadosOutrosService.getDadosOutrosCache();
      if (dados) {
        return of(dados);
      }

      return this.outrosService.getTodo().pipe(
        first(),
        tap(v => this.dadosOutrosService.setDadosOutrosCache(v)),
        catchError((e) => {
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Erro, mensagem: this.translocoService.translate('common.loadDataError'), duracom: 10
          });
          return EMPTY;
        })
      );
    }
  });

  constructor() {
    effect(() => {        // para o ejemplo de combo com signals
      const dados = this.dadosApiResource.value();
      if (!dados?.bibliotecas?.data) return;

      // Só actualiza a lista completa
      this.formState.todasBibliotecasCombo.set(
        dados.bibliotecas.data
          .map(item => ({ id: item.id, value: item.nome }))
          .sort((a, b) => a.value.localeCompare(b.value))
      );
    });

    effect(() => {        // para o ejemplo de combo com signals
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
        this.obterDados(parametros.id);
      }
    );
    this.idLivro = id;
  }

  private obterDados(idLivro: string) {

    const dadosOutrosCache = this.dadosOutrosService.getDadosOutrosCache();
    const observavel1 = dadosOutrosCache
      ? of(dadosOutrosCache)
      : this.outrosService.getTodo().pipe(
          tap((res) => this.dadosOutrosService.setDadosOutrosCache(res))
        );

    const observavel2 = this.relecturasService.getRelecturas(idLivro);

    const dadosPagina = this.dadosPaginasService.getDadosPagina(idLivro, this.nomePagina);
    const observavel3 = dadosPagina?.elemento
      ? of({ data: [dadosPagina.elemento], meta: { id: Number(idLivro) } } as BaseListadoDadosApi<Livro>)
      : this.livrosService.getLivro(idLivro);

    forkJoin([observavel1, observavel2, observavel3])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([res1, res2, res3]) => {
          this.dadosOutrosService.setDadosOutrosCache(res1);
          this.dadosOutrosObtidos();

          this.dadosRelecturasObtidos(res2);

          if (dadosPagina && dadosPagina.elemento) {
            this.dadosDoLivro = dadosPagina.elemento;
            this.setDadoEngadido();
            this.setDadosLivroForm();
          } else {
            this.dadosObtidosDoLivro(res3);
          }
        },
        error: (err) => {
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: this.translocoService.translate('common.loadDataError')});
        },
        complete: () => {
          console.log('Completada a obtençom dos dados.');
        }
    });
  }

  private dadosOutrosObtidos() {
    const dados = this.dadosOutrosService.getDadosOutrosCache();
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
          [{id: 0, nome: this.translocoService.translate('common.firstInSeries')}, ...dadosSeries],
          this.livroForm.controls.serie, false
        );
        this.formState.todasSeriesLivrosCombo = result.combo;
        this.formState.seriesLivro = result.signalFiltrado;
      }

      if (dados.seriesRelectura?.data) {
        const dadosSeries = dados.seriesRelectura.data.map(s => ({id: s.id, nome: s.titulo}))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        const result = this.formState.processarDadosCombo(
          [{id: 0, nome: this.translocoService.translate('common.firstInSeries')}, ...dadosSeries],
          this.livroForm.controls.serie, false
        );
        this.formState.todasSeriesRelecturasCombo = result.combo;
        this.formState.seriesRelectura = result.signalFiltrado;
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
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: this.translocoService.translate('common.noDataReceived'), duracom: 10});
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
        next: (v) => this.dadosRelecturasObtidos(v),
        error: (e: unknown) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: this.translocoService.translate('common.loadRelatedError', { name: this.translocoService.translate('common.rereads') }), duracom: 10}); },
        complete: () => this.obterDadosDoLivro(idLivro)       // Dados do livro
    });
  }

  private dadosRelecturasObtidos(dadosChegando: BaseListadoDadosApi<RelecturaListado>) {
    if (dadosChegando && dadosChegando.data.length > 0) {
      this.dadosRelecturas.set(dadosChegando.data);
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
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Erro,
            mensagem: this.translocoService.translate('common.loadRereadError')}); },
        complete: () => console.debug('completada a obtençom da relectura do livro')
    });
  }

  private amosarDadosRelectura(dados: RelecturaData) {
    if (!dados || !dados.data || dados.data.length === 0) {
      this.layoutService.amosarInfo({ tipo: InformacomPeTipo.Erro, mensagem: this.translocoService.translate('common.noDataReceived'), duracom: 10 });
      return;
    }

    this.dadosDaRelectura = dados.data[0];
    this.onGestomNovaRelectura();
    if (this.disabledFormulario)
      this.modo.set(EstadosPagina.soVisualizar);
    else
      this.modo.set(EstadosPagina.guardar);
    this.formState.setRelecturaForm(this.dadosDaRelectura);
    this.pontuacomEstrelas = this.dadosDaRelectura.pontuacom;
  }

  private gestionarExitoRelectura(data: Resultado, relectura: Livro | Relectura) {
    if (data) {
      let info = <{idResult: string}>data;
      relectura.id = info.idResult;
      this.dadosDaRelectura = relectura as Relectura;

      this.elementoSerieRelecturaCache(this.dadosDaRelectura.idSerie, this.dadosDaRelectura.id, this.dadosDaRelectura.titulo);
      this.obterDadosRelecturasELivro(this.idLivro);

      this.setDadosLivroForm();
      this.modo.set(this.modoSalvadoRelectura);
      this.modoRelectura.set(false);

      this.graficosService.setHaNovosDados(); // Para que se vai aos gráficos nom use os dados da caché.
    }
  }

  onBorrarRelectura(relectura: RelecturaListado) {
    let nomeRelectura = relectura.titulo;
    if (relectura.dataFimLeitura) {
      let dateConvert = new ConverterAData();
      nomeRelectura += ` (${dateConvert.getDataString(relectura.dataFimLeitura, '/')})`;
    }
    const pergunta = this.translocoService.translate('common.confirmDelete', { name: nomeRelectura });
    if(confirm(pergunta)) {
      this.relecturasService
            .borrarRelectura(relectura.id)
            .pipe(first())
            .subscribe({
              next: (v: object) => console.debug(v),
              error: (e: unknown) => { console.error(e),
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: this.translocoService.translate('common.deleteError', { name: this.translocoService.translate('common.rereads') })}); },
              complete: () => { // console.debug('Borrado feito');
                this.obterDadosRelecturasELivro(this.idLivro);
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: this.translocoService.translate('common.itemDeleted', { name: relectura.titulo })}); }
          });
    }
  }
  //#endregion

  private obterDadosDoLivro(id: string): void {
    const livro = this.dadosPaginasService.getDadosPagina(id, this.nomePagina); // Existirá se se está retornando ao livro (estaba em relecturas)
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
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: this.translocoService.translate('common.loadDataError'), duracom: 10}); },
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
      this.formState.setDadosLivroForm(this.dadosDoLivro);        // Formulario
      if (!this.dadosDoLivro.somSerie)
        this.livroForm.controls.serie.disable();

      this.pontuacomEstrelas = this.dadosDoLivro.pontuacom;       // Estrelas
    }
    else
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: this.translocoService.translate('common.noDataReceived'), duracom: 10});
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
          const indexAnonimo = this.dadosDoLivro.autores.findIndex(a => a.nome === 'Anónimo');
          if (indexAnonimo >= 0)
            this.dadosDoLivro.autores.splice(indexAnonimo, 1);

          this.actualizarDadosRelacions(this.dadosDoLivro.autores, dadoLivro);
          break;
        }
        case DadosComplentarios.Genero: {
          this.actualizarDadosRelacions(this.dadosDoLivro.generos, dadoLivro);
          break;
        }
        case DadosComplentarios.Biblioteca: {
          this.actualizarCombo(this.formState.todasBibliotecasCombo(), novoDado.elemento);
          this.dadosDoLivro.idBiblioteca = novoDado.elemento.id;
          break;
        }
        case DadosComplentarios.Editorial: {
          this.actualizarCombo(this.formState.todasEditoriaisCombo(), novoDado.elemento);
          this.dadosDoLivro.idEditorial = novoDado.elemento.id;
          break;
        }
        case DadosComplentarios.Colecom: {
          this.actualizarCombo(this.formState.todasColeconsCombo, novoDado.elemento);
          this.dadosDoLivro.idColecom = novoDado.elemento.id;
          break;
        }
        case DadosComplentarios.EstiloLiterario: {
          this.actualizarCombo(this.formState.todosEstilosCombo, novoDado.elemento);
          this.dadosDoLivro.idEstilo = novoDado.elemento.id;
          break;
        }
      }
    }
    this.dadosPaginasService.setNovoDadoLivro(undefined);   // Como já está procesado, limpo
  }

  /**
   * Se está no listado dos elementos relacionados o engade, se nom o atualiza, logo ordena.
   * @param elementosNaRelacom total de elementos
   * @param elemento elemento a engadir ou atualizar
   */
  private actualizarDadosRelacions(elementosNaRelacom: ObjetoSimpleIdNome[], elemento: ObjetoSimpleIdNome): void {
    if (elemento.id) {
      const index = elementosNaRelacom.findIndex(item => item.id === elemento.id);
      if (index < 0) {
        elementosNaRelacom.push(elemento);
      } else {
        elementosNaRelacom.splice(index, 1, elemento);
      }
      elementosNaRelacom.sort((a, b) => a.nome.localeCompare(b.nome));
    }
  }

  /**
   * Se nom está no listado do combo o engade e ordena.
   * @param elementosCombo total de elementos
   * @param novoElemento elemento a engadir ou atualizar
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
    const dados = this.dadosOutrosService.getDadosOutrosCache();
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
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: this.translocoService.translate('common.authorsUnavailable')});
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
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: this.translocoService.translate('common.genresUnavailable')});
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
      const dadosPagina: DadosPagina = {id: this.idLivro, nomePagina: this.nomePagina, elemento: livro};
      this.dadosPaginasService.setDadosPagina(dadosPagina);
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

  onIrPaginaEditarAutorGenero(rota: string, tipo: DadosComplentarios, id: number): void{
    this.guardarDadosDoLivro(tipo);

    const dados = this.dadosOutrosService.getDadosOutrosCache();
    if (dados) {
      const listado = tipo === DadosComplentarios.Autor ? dados.autores : dados.generos;

      if (listado?.data?.length) {
        this.layoutService.amosarInfo(undefined);
        const dado = listado.data
          .filter(elemento => id === elemento.id)
          .map(elemento => ({ id: elemento.id, value: elemento.nome }))

        this.dadosPaginasService.setNovoDadoLivro({tipo: tipo, elemento: dado});
        this.layoutService.amosarInfo(undefined);

        if (tipo === DadosComplentarios.Autor) {
          this.router.navigate([rota], { state: { id: id, idRelectura: 'algo mais de probas' } });
        } else {
          this.router.navigateByUrl(rota + '?id=' + id);
        }
      }
    }
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
    const dadosPagina: DadosPagina = {id: this.idLivro, nomePagina: this.nomePagina, elemento: livro};
    this.dadosPaginasService.setDadosPagina(dadosPagina);
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
    const engadindo = event.submitter.value === EstadosPagina.engadir;
    if (this.modoRelectura()) {
      const idElemento = (this.dadosDaRelectura) ? this.dadosDaRelectura.id.toString() : '0';
      const relectura = this.formState.setRelectura(
        this.dadosDoLivro!.id, idElemento,
        this.authService.getUsuarioLogado()?.idioma ?? null, this.pontuacomEstrelas);

      const consultaTitulos$ = this.relecturasService.getRelecturasPorTitulo(this.dadosDoLivro!.id, relectura.titulo);
      const consultaSeries$ = idElemento !== '0'
          ? this.relecturasService.getRelecturasSerie(idElemento)        // Ejecútase no servidor
          : of({ meta: { quantidade: 0, info: '', id: 0 }, data: [] } ); // Nom vai ao servidor porque é a primeria, devolve um dado simulado
      const servicoChamada$ = engadindo
        ? this.relecturasService.postRelectura(relectura)
        : this.relecturasService.putRelectura(relectura);

      this.comprobaconsGuardar(engadindo, true, idElemento, consultaTitulos$, consultaSeries$, servicoChamada$, relectura,
        (data, elemento) => this.gestionarExitoRelectura(data, elemento));
    }
    else {
      if (this.livroForm.valid) {
        const idElemento = this.dadosDoLivro?.id ?? '0';
        const livro = this.setDadosLivro();

        const consultaTitulos$ = this.livrosService.getLivroPorTitulo(livro.titulo);
        const consultaSeries$ = idElemento !== '0'
          ? this.livrosService.getLivrosSerie(idElemento)                // Ejecútase no servidor
          : of({ meta: { quantidade: 0, info: '', id: 0 }, data: [] } ); // Nom vai ao servidor porque é a primeria, devolve um dado simulado
        const servicoChamada$ = engadindo
          ? this.livrosService.postLivro(livro)
          : this.livrosService.putLivro(livro);

        this.comprobaconsGuardar(engadindo, false, idElemento, consultaTitulos$, consultaSeries$, servicoChamada$,
          livro, (data, elemento) => this.gestionarExito(data, elemento));
      }
    }
  }

  private comprobaconsGuardar(
    engadindo: boolean, eRelectura: boolean,
    idElemento: string,
    consultaTitulos$: Observable<BaseListadoDadosApi<Livro | RelecturaData>>,
    consultaSeries$: Observable<BaseListadoDadosApi<Livro | RelecturaData>> | undefined,
    servicoChamada$: Observable<Resultado>,
    elemento: Livro | Relectura,
    gestionarExito: (data: Resultado, elemento: Livro | Relectura) => void) {

    // TODO: O texto nameExists deberia ser titleExists

    const consultaSeriesFinal$ = consultaSeries$ ?? of({
      meta: { quantidade: 0, info: '', id: 0 },
      data: []
    } as BaseListadoDadosApi<Livro | RelecturaData>);

    forkJoin([consultaTitulos$, consultaSeriesFinal$]).pipe(
      switchMap(([resGetPorTitulo, resGetSeries]) => {

        const tituloExiste = resGetPorTitulo !== undefined && resGetPorTitulo.meta.quantidade > 0;
        const idDistinto = resGetPorTitulo?.meta.id?.toString() !== idElemento;

        if (tituloExiste && (engadindo || (!engadindo && idDistinto))) {
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Aviso,
            mensagem: this.translocoService.translate('common.alertSave')
          });
          alert(this.translocoService.translate(eRelectura ? 'common.rereadTitleExists' : 'common.titleExists', { titulo: elemento.titulo }));
          return EMPTY; // Detem o flujo porque a validación fallou
        }

        if (resGetSeries.meta.quantidade > 0 && !elemento.somSerie) {
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Aviso,
            mensagem: this.translocoService.translate('common.alertSave')
          });
          alert(this.translocoService.translate('common.noFirstElement'));
          return EMPTY; // Detem o flujo porque a validación fallou
        }

        return this.guardar(engadindo, servicoChamada$, elemento, gestionarExito);
      })
    ).subscribe({
      error: (e: unknown) => this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: this.translocoService.translate('common.loadDataError')})
    });
  }

  private guardar(engadindo: boolean,
    servicoChamada: Observable<Resultado>,
    elemento: Livro | Relectura,
    gestionarExito: (data: Resultado, elemento: Livro | Relectura) => void): Observable<Resultado> {

    return servicoChamada.pipe(
      first(),
      tap({
        next: (v) => {console.debug(v), gestionarExito(v, elemento)},
        error: (e: unknown) => {
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: this.translocoService.translate(engadindo ? 'common.addErrorMessage' : 'common.saveErrorMessage'), duracom: 10});
          console.error(e) },
        complete: () => {
          this.modo.set(EstadosPagina.guardar);
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso,
            mensagem: this.translocoService.translate(engadindo ? 'common.itemAdded' : 'common.itemSaved')});
        }
      })
    )
  }

  private setDadosLivro(): Livro {
    const dados = this.dadosOutrosService.getDadosOutrosCache();
    const autorAnonimo = dados?.autores?.data.find(autor => autor.nome === 'Anónimo');
    return this.formState.setLivro(
      this.dadosDoLivro?.id ?? '0',
      this.autoresLivro(),
      this.generosLivro(),
      this.authService.getUsuarioLogado()?.idioma ?? null,
      this.pontuacomEstrelas,
      autorAnonimo
    );
  }

  private gestionarExito(data: Resultado, livro: Livro | Relectura) {
    if (data) {
      this.dadosDoLivro = livro as Livro;
      this.dadosDoLivro.id = data.idResult;
      this.elementoSerieCache(this.dadosDoLivro.idSerie, this.dadosDoLivro.id, this.dadosDoLivro.titulo);
      this.graficosService.setHaNovosDados(); // Para que se vai aos gráficos nom use os dados da caché.
    }
  }

  private elementoSerieCache(idSerie: number | null, idLibro: string, titulo: string) {
    if (idSerie === 0) {    // O primeiro da serie sempre leva o 0
      const serie: SerieLivro = { id: +idLibro, titulo: titulo };
      this.dadosOutrosService.setElementoDadosOutrosCache(serie, DadosComplentarios.SeriesLivro);
    } else {
      this.dadosOutrosService.removerElementoDadosOutrosCache(idLibro, DadosComplentarios.SeriesLivro);
    }
  }

  private elementoSerieRelecturaCache(idSerie: number | null, idLibro: string, titulo: string) {
    if (idSerie === 0) {    // O primeiro da serie sempre leva o 0
      const serie: SerieLivro = { id: +idLibro, titulo: titulo };
      this.dadosOutrosService.setElementoDadosOutrosCache(serie, DadosComplentarios.seriesRelectura);
    } else {
      this.dadosOutrosService.removerElementoDadosOutrosCache(idLibro, DadosComplentarios.seriesRelectura);
    }
  }
}
