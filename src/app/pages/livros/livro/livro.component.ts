import { Component, OnInit } from '@angular/core';
import { first, map, merge, Observable, startWith, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LivrosService } from '../../../core/services/api/livros.service';
import { CommonModule } from '@angular/common';
import { FormControl,
  ReactiveFormsModule, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { OutrosService } from '../../../core/services/api/outros.service';
import { DateConvert } from '../../../shared/classes/date-convert';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { DadosComplentarios, InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { Title } from '@angular/platform-browser';
import { EngadirEditarData } from '../../../shared/models/datas';
import { RelecturasService } from '../../../core/services/api/relecturas.service';
import { ObjetoSimpleIdNome, datasUltimosAnos, Livro, Outros } from '../../../core/models/livro.interface';
import { Genero } from '../../../core/models/genero.interface';
import { Relectura, ListadoRelecturas, RelecturasData, RelecturaData } from '../../../core/models/relectura.interface';
import { SimpleObjet } from '../../../shared/models/outros.model';
import { MultiDados, MultiSelecomDialogComponent } from '../../../core/components/multi-selecom-dialog/multi-selecom-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';
import { EstrelasPontuacomComponent } from '../../../core/components/estrelas-pontuacom/estrelas-pontuacom.component';
import { Parametros } from '../../../core/models/comun.interface';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { environment, environments } from '../../../../environments/environment';
import { UsuarioAppService } from '../../../core/services/flow/usuario-app.service';
import { BaseDadosApi } from '../../../core/models/base-dados-api';

export enum MultiGestom {
  autores = 1,
  generos = 2,
}

@Component({
  selector: 'omla-livro',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCheckboxModule
    , MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule
    , EstrelasPontuacomComponent ],
  templateUrl: './livro.component.html',
  styleUrls: ['./livro.component.scss']
})
export class LivroComponent implements OnInit {

  idLivro: string = '0';
  idRelectura: string = '0';      // > 0 Quando seja umha relectura
  dadosDoLivro: Livro | undefined;
  dadosDaRelectura: Relectura | undefined;
  nomePagina = 'livro';
  estadosPagina = EstadosPagina;
  modo = EstadosPagina.soVisualizar;
  disabledFormulario = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro ? true : false;
  modoRelectura = false;
  modoSalvadoRelectura = this.modo;
  multiGestom = MultiGestom;
  dadosComplentarios = DadosComplentarios;
  autoresLivro: SimpleObjet[] = [];
  generosLivro: SimpleObjet[] = [];
  focusTrigger = new Subject<void>();   // Para que os combos ao recibir o foco por primeira vez amose o listado inda que esteja valeiro
  bibliotecasCombo: SimpleObjet[] = [];
  bibliotecas: Observable<SimpleObjet[]> | undefined;
  editoriaisCombo: SimpleObjet[] = [];
  editoriais: Observable<SimpleObjet[]> | undefined;
  coleconsCombo: SimpleObjet[] = [];
  colecons: Observable<SimpleObjet[]> | undefined;
  estilosCombo: SimpleObjet[] = [];
  estilos: Observable<SimpleObjet[]> | undefined;
  idiomasCombo: SimpleObjet[] = [];
  idiomas: Observable<SimpleObjet[]> | undefined;
  idiomasOriginais: Observable<SimpleObjet[]> | undefined;
  seriesLivrosCombo: SimpleObjet[] = [];
  seriesLivro: Observable<SimpleObjet[]> | undefined;
  dadosRelecturas: ListadoRelecturas[] = [];
  diasLeitura = 0;

  rex1000000 = '([1-1][0-0]{6,6}|[0-9]{1,6})';
  rex1000 = '([1-1][0-0]{3,3}|[0-9]{1,3})';
  livroForm = this.fb.group({
    titulo: new FormControl({ value: '', disabled: this.disabledFormulario}, {
        validators: [
           Validators.required,
           Validators.maxLength(100)
        ],
        // asyncValidators: [ ... array of asynchronous validators ...]
        updateOn: 'blur' // 'change' or 'blur' or 'submit'
    }),
    tituloOriginal: new FormControl({ value: '', disabled: this.disabledFormulario}, { validators: [Validators.maxLength(100)] }),
    idBiblioteca: new FormControl({ value: '', disabled: this.disabledFormulario}),
    idEditorial: new FormControl({ value: '', disabled: this.disabledFormulario}),
    idColecom: new FormControl({ value: '', disabled: this.disabledFormulario}),
    idEstilo: new FormControl({ value: '', disabled: this.disabledFormulario}),
    isbn: new FormControl({ value: '', disabled: this.disabledFormulario}, { validators: [Validators.maxLength(20)] }),
    paginas: new FormControl({ value: '', disabled: this.disabledFormulario}, { validators: [Validators.pattern(this.rex1000000)] }),
    paginasLidas: new FormControl({ value: '', disabled: this.disabledFormulario}, { validators: [Validators.pattern(this.rex1000000)] }),
    lido: [{ value: false, disabled: this.disabledFormulario}],
    diasLeitura: new FormControl({ value: '', disabled: this.disabledFormulario}, { validators: [Validators.pattern(this.rex1000)] }),
    dataFimLeiturata: new FormControl({ value: '', disabled: this.disabledFormulario}),
    idioma: new FormControl({ value: '', disabled: this.disabledFormulario}),
    idiomaOriginal: new FormControl({ value: '', disabled: this.disabledFormulario}),
    dataCriacom: new FormControl({ value: '', disabled: this.disabledFormulario}, { validators: [ this.checkDuasDatasValidator() ] }),
    dataEdicom: new FormControl({ value: '', disabled: this.disabledFormulario}, { validators: [ this.checkDuasDatasValidator() ] }),
    numeroEdicom: new FormControl({ value: '', disabled: this.disabledFormulario}, { validators: [Validators.pattern(this.rex1000)] }),
    electronico: new FormControl({ value: false, disabled: this.disabledFormulario}),
    somSerie: new FormControl({ value: false, disabled: this.disabledFormulario}),
    serie: new FormControl({ value: '', disabled: this.disabledFormulario}),
    premios: new FormControl({ value: '', disabled: this.disabledFormulario}, { validators: [Validators.maxLength(255)] }),
    descricom: new FormControl({ value: '', disabled: this.disabledFormulario}, { validators: [Validators.maxLength(50000)] }),
    comentario: new FormControl({ value: '', disabled: this.disabledFormulario}, { validators: [Validators.maxLength(50000)] }),
  });
  get lf() { return this.livroForm.controls; }
  pontuacomEstrelas: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private usuarioAppService: UsuarioAppService,
    private title: Title,
    private fb: FormBuilder,
    private outrosService: OutrosService,
    private livrosService: LivrosService,
    private relecturasService: RelecturasService,
    private dialog: MatDialog,
    private dadosPaginasService: DadosPaginasService ) { }

  ngOnInit(): void {
    let id = '0';
    this.title.setTitle(this.title.getTitle() + ' Engadir');
    this.route.queryParams
      .subscribe(params => {
        const parametros = params as Parametros;
        if (environment.whereIAm !== environments.pre && environment.whereIAm !== environments.pro) {
          if (parametros.id === '0')
            this.modo = EstadosPagina.engadir;
          else {
            id = parametros.id;
            this.idRelectura = parametros.idRelectura === undefined ? '0' : parametros.idRelectura;
            this.modo = EstadosPagina.guardar;
          }
        }
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
          error: (e: any) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados', duracom: 10}); },
      });
    }
  }

  private dadosOutrosObtidos(dados: Outros | null) {
    if (dados) {
      if (dados.bibliotecas?.data) {
        const result = this.processarDadosCombo(
          dados.bibliotecas.data,
          this.lf.idBiblioteca
        );
        this.bibliotecasCombo = result.combo;
        this.bibliotecas = result.observable;
      }

      if (dados.editoriais?.data) {
        const result = this.processarDadosCombo(
          dados.editoriais.data,
          this.lf.idEditorial
        );
        this.editoriaisCombo = result.combo;
        this.editoriais = result.observable;
      }

      if (dados.colecons?.data) {
        const result = this.processarDadosCombo(
          dados.colecons.data,
          this.lf.idColecom
        );
        this.coleconsCombo = result.combo;
        this.colecons = result.observable;
      }

      if (dados.estilos?.data) {
        const result = this.processarDadosCombo(
          dados.estilos.data,
          this.lf.idEstilo
        );
        this.estilosCombo = result.combo;
        this.estilos = result.observable;
      }

      if (dados.idiomas?.data) {
        const result = this.processarDadosCombo(
          dados.idiomas.data,
          this.lf.idioma
        );
        this.idiomasCombo = result.combo;
        this.idiomas = result.observable;

        const resultIdiomaOriginal = this.processarDadosCombo(
          dados.idiomas.data,
          this.lf.idiomaOriginal
        );
        this.idiomasCombo = resultIdiomaOriginal.combo;
        this.idiomasOriginais = resultIdiomaOriginal.observable;
      }

      if (dados.seriesLivro?.data) {
        const dadosSeries = dados.seriesLivro.data.map(s => ({id: s.id, nome: s.titulo}))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        const result = this.processarDadosCombo(
          [{id: 0, nome: 'Som o primeiro'}, ...dadosSeries],
          this.lf.serie, false
        );
        this.seriesLivrosCombo = result.combo;
        this.seriesLivro = result.observable;
      }

      /* if (idLivro == 0 && dados.ultimaLeitura) {
        let dateConvert = new DateConvert();
        let data = dateConvert.getDateFromMySQL(dados.ultimaLeitura);
        console.log('ultima Leitura anterior:', data);
        const dias = this.getDiasDendeUltimaLeitura(data);
        this.lf.diasLeitura.setValue(dias.toString());
      } */

      if (dados.ultimasLeituras && dados.ultimasLeituras.length > 0) {
        this.setDiasDendeUltimaLeitura(dados.ultimasLeituras);
      }
    }
    else
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados', duracom: 10});
  }

  /**
   * Processa um array de objetos com id e nome, em um array de objetos
   * simples com id e value, ordenado por value, e um observable que
   * filtra o array com base no valor de um campo de formulario.
   * @param data Array de objetos com id e nome.
   * @param controlFormulario Campo do formul rio cujo valor ser  usado para
   * filtrar o array.
   * @param ordenar Se true, ordena o array por value.
   * @returns Um objeto com o array de objetos simples e o observable.
   */
  private processarDadosCombo(
    data: ObjetoSimpleIdNome[] | undefined | null,
    controlFormulario: AbstractControl,
    ordenar: boolean = true
  ): { combo: SimpleObjet[], observable: Observable<SimpleObjet[]> } {
    const dadosReducidos: SimpleObjet[] = (data || [])
      .map(item => ({ id: item.id, value: item.nome }))
      .sort((a, b) => ordenar ? a.value.localeCompare(b.value) : 0);

    return {
      combo: dadosReducidos,
      observable: merge(
          controlFormulario.valueChanges.pipe(startWith('')),
          this.focusTrigger
        ).pipe(
          map(() => {
            const value = controlFormulario.value || '';
            return this.filtroCombo(value, dadosReducidos);
          })
      )
    };
    /* return {
      combo: dadosReducidos,
      observable: controlFormulario.valueChanges.pipe(
        startWith(''),
        map(value => this.filtroCombo(value as string, dadosReducidos))
      )
    }; */
  }

  /**
   * Calcula os días pasados dende a última leitura
   * @param dados Matriz coas datas do ano actual e do anterior para colher a data mais recente e calcuar a partir dela.
   */
  private setDiasDendeUltimaLeitura(dados: datasUltimosAnos[]) {
    let dateConvert = new DateConvert();

    let maiorData: EngadirEditarData = { day: 0, month: 0, year: 0 };
    dados.forEach(function (value) {
      let iterado = dateConvert.getDateFromMySQL(value.dataDoLivro);
      if (iterado.year > maiorData.year) {
        // console.log('id do maior ANO: ' + value.id, maiorData);
        maiorData = iterado;
      }
      else if (iterado.year == maiorData.year) {
        if (iterado.month > maiorData.month) {
          // console.log('id do maior MES: ' + value.id, maiorData, iterado);
          maiorData = iterado;
        }
        else if (iterado.month == maiorData.month) {
          if (iterado.day > maiorData.day) {
            // console.log('id do maior DIA: ' + value.id, maiorData, iterado);
            maiorData = iterado;
          }
        }
      }
    });

    // console.log('ultimas Leituras:', dados);
    // console.log('maior data', maiorData);
    this.diasLeitura = this.getDiasDendeUltimaLeitura(maiorData);
    if (this.modo === EstadosPagina.engadir) {
      this.lf.diasLeitura.setValue(this.diasLeitura.toString());
    }
  }

  private getDiasDendeUltimaLeitura(data: EngadirEditarData): number {
    let resultado = 0;
    const dataMax = new Date();
    const dataMin = new Date(data.year, data.month - 1, data.day, 23, 59);

    dataMin.setDate(dataMin.getDate() + 1);       // 1 para que nom conte o dia inicial.
    while (dataMin.getTime() < dataMax.getTime()) {
      resultado++;
      dataMin.setDate(dataMin.getDate() + 1);     // getDay() funciona mal.
    }
    return resultado;
  }

  /**
  * Filtra os valores do despregável.
  * @param value Filtro inserido polo usuario.
  * @param listadoSimple Listado cos elementos que se vai filtrar.
  */
  private filtroCombo(value: string, listadoSimple: SimpleObjet[]): SimpleObjet[] {
    const filterValue = value?.toLowerCase();

    return listadoSimple.filter(option => option.value.toLowerCase().includes(filterValue));
  }

  //#region Relecturas
  onGestomNovaRelectura() {
    // Obtem os dados do livro para guardalos mentres se crea a relectura, e assim poder voltar a eles
    this.dadosDoLivro = this.setDadosLivro();
    this.lf.dataFimLeiturata.setValue('');
    this.lf.diasLeitura.setValue(this.diasLeitura.toString());
    this.modoSalvadoRelectura = this.modo;
    this.modo = EstadosPagina.engadir;
    this.modoRelectura = true;
  }

  onCancelarNovaRelectura() {
    this.setDadosLivroForm();
    this.modo = this.modoSalvadoRelectura;
    this.modoRelectura = false;
  }

  private obterDadosRelecturasELivro(idLivro: string): void {
    this.relecturasService
      .getRelecturas(idLivro)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosRelecturasObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados das relecturas', duracom: 10}); },
          complete: () => this.obterDadosDoLivro(idLivro)       // Dados do livro
    });
  }

  private dadosRelecturasObtidos(dadosChegando: object) {
    const dados = <RelecturasData>dadosChegando;
    if (dados && dados.data.length > 0) {
      this.dadosRelecturas = dados.data;
    }
    else
      this.dadosRelecturas = [];
  }

  onEditarRelectura(idRelectura: string){
    this.relecturasService
      .getRelectura(idRelectura)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.amosarDadosRelectura(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido borrara a relectura.'}); },
          complete: () => console.debug('completada a obtençom da relectura do livro')
    });
  }

  private amosarDadosRelectura(dadosChegando: object) {
    const dados = <RelecturaData>dadosChegando;
    if (dados && dados.data.length > 0) {
      this.dadosDaRelectura = <Relectura>dados.data[0];

      if (this.dadosDaRelectura) {
        this.onGestomNovaRelectura();
        this.modo = EstadosPagina.guardar;
        this.setDadosRelecturaForm();
      }
      else
        this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados da relectura', duracom: 10});
    }
  }

  /**
   * Estavelece os dados no formulario
   */
  private setDadosRelecturaForm() {
    if (this.dadosDaRelectura) {
      this.lf.titulo.setValue(this.dadosDaRelectura.titulo);
      this.setCombo(this.dadosDaRelectura.idBiblioteca, this.bibliotecasCombo, this.lf.idBiblioteca);
      this.setCombo(this.dadosDaRelectura.idEditorial, this.editoriaisCombo, this.lf.idEditorial);
      this.lf.isbn.setValue(this.dadosDaRelectura.isbn);
      this.lf.paginas.setValue(this.dadosDaRelectura.paginas);
      this.lf.paginasLidas.setValue(this.dadosDaRelectura.paginasLidas);
      this.lf.lido.setValue(this.dadosDaRelectura.lido);
      this.lf.diasLeitura.setValue(this.dadosDaRelectura.diasLeitura);
      this.setData(this.dadosDaRelectura.dataFimLeitura, this.lf.dataFimLeiturata);
      this.setCombo(this.dadosDaRelectura.idIdioma, this.idiomasCombo, this.lf.idioma);
      this.lf.numeroEdicom.setValue(this.dadosDaRelectura.numeroEdicom);
      this.lf.electronico.setValue(this.dadosDaRelectura.electronico);
      this.setData(this.dadosDaRelectura.dataEdicom, this.lf.dataEdicom);
      this.lf.somSerie.setValue(this.dadosDaRelectura.somSerie);
      this.setCombo(this.dadosDaRelectura.idSerie, this.seriesLivrosCombo, this.lf.serie);
      this.lf.comentario.setValue(this.dadosDaRelectura.comentario);
      this.pontuacomEstrelas = this.dadosDaRelectura.pontuacom;
    }
  }

  guardarRelectura(event: any) {
    let relectura = this.setDadosRelectura();

    if (event.submitter.value === EstadosPagina.engadir) {
      this.relecturasService
        .postRelectura(relectura)
        .pipe(first())
        .subscribe({
          next: (v: object) => {console.debug(v), this.gestionarExitoRelectura(v, relectura)},
          error: (e: any) => {
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir a relectura.', duracom: 10});
            console.error(e) },
            complete: () => {
              this.modo = EstadosPagina.guardar;
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
          next: (v: object) => {console.debug(v), this.gestionarExitoRelectura(v, relectura)},
          error: (e: any) => {
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido guardar a relectura.', duracom: 10});
            console.error(e) },
            complete: () => {
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Relectura guardada.'});
            console.debug('put completado') }
      });
    }
  }

  setDadosRelectura(): Relectura {
    let dateConvert = new DateConvert();
    let dFL = dateConvert.getDate(this.lf.dataFimLeiturata.value);
    let dE = dateConvert.getDate(this.lf.dataEdicom.value);

    let biblioteca = this.bibliotecasCombo.find(option => option.value === this.lf.idBiblioteca.value);
    let editorial = this.editoriaisCombo.find(option => option.value === this.lf.idEditorial.value);
    let colecom = this.coleconsCombo.find(option => option.value === this.lf.idColecom.value);
    let idioma = this.idiomasCombo.find(option => option.value === this.lf.idioma.value);
    let serie = this.seriesLivrosCombo.find(option => option.value === this.lf.serie.value);

    let relectura: Relectura = {
      id: (this.dadosDaRelectura) ? this.dadosDaRelectura.id :'0',
      idLivro: this.dadosDoLivro!.id,
      titulo: String(this.lf.titulo.value),
      idBiblioteca: (biblioteca) ? biblioteca.id : null,
      idEditorial: (editorial) ? editorial.id : null,
      idColecom: (colecom) ? colecom.id : null,
      isbn: (this.lf.isbn.value) ? String(this.lf.isbn.value) : null,
      paginas: (this.lf.paginas.value) ? String(this.lf.paginas.value) : null,
      paginasLidas: (!this.lf.paginasLidas.value) ? null : String(this.lf.paginasLidas.value),
      lido: (!this.lf.lido.value) ? false : this.lf.lido.value,
      diasLeitura: (this.lf.diasLeitura.value) ? String(this.lf.diasLeitura.value) : null,
      dataFimLeitura: (dFL.year > 0) ? dFL.year + '-' + dFL.month + '-' + dFL.day : '',
      idIdioma: (idioma) ? idioma.id : null,
      dataEdicom: (dE.year > 0) ? dE.year + '-' + dE.month + '-' + dE.day : '',
      numeroEdicom: (this.lf.numeroEdicom.value) ? String(this.lf.numeroEdicom.value) : null,
      electronico: (!this.lf.electronico.value) ? false : this.lf.electronico.value,
      somSerie: (!this.lf.somSerie.value) ? false : this.lf.somSerie.value,
      idSerie: (serie) ? serie.id : null,
      comentario: (this.lf.comentario.value) ? String(this.lf.comentario.value) : null,
      pontuacom: this.pontuacomEstrelas,
      // nom necesarios
      biblioteca: '',
      editorial: '',
      colecom: '',
    };

    return relectura;
  }

  private gestionarExitoRelectura(data: object, relectura: Relectura) {
    if (data) {
      let info = <{idResult: string}>data;
      relectura.id = info.idResult;
      this.dadosDaRelectura = relectura;
      this.obterDadosRelecturasELivro(this.idLivro);

      this.setDadosLivroForm();
      this.modo = this.modoSalvadoRelectura;
      this.modoRelectura = false;
    }
  }

  onBorrarRelectura(relectura: ListadoRelecturas) {
    let pergunta = "Está certo de querer borrar a relectura " + relectura.titulo;
    if (relectura.dataFimLeitura) {
      let dateConvert = new DateConvert();
      pergunta += " do día " + dateConvert.getDateString(relectura.dataFimLeitura, '/') + "?";
    }
    else
      pergunta += "?";
    if(confirm(pergunta)) {
      this.relecturasService
            .borrarRelectura(relectura.id)
            .pipe(first())
            .subscribe({
              next: (v: object) => console.debug(v),
              error: (e: any) => { console.error(e),
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
          error: (e: any) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do livro', duracom: 10}); },
            complete: () => console.debug('completada a obtençom dos dados do livro')
      });
    }
  }

  private setDadosLivroForm() {
    if (this.dadosDoLivro) {
      let generosL: SimpleObjet[] = [];
      this.dadosDoLivro.generos.forEach(function (value) {
        generosL.push({id: value.id, value: value.nome});
      });
      this.generosLivro = generosL;

      let autoresL: SimpleObjet[] = [];
      this.dadosDoLivro.autores.forEach(function (value) {
        autoresL.push({id: value.id, value: value.nome});
      });
      this.autoresLivro = autoresL;

      this.lf.titulo.setValue(this.dadosDoLivro.titulo);
      this.lf.tituloOriginal.setValue(this.dadosDoLivro.tituloOriginal);
      this.setCombo(this.dadosDoLivro.idBiblioteca, this.bibliotecasCombo, this.lf.idBiblioteca);
      this.setCombo(this.dadosDoLivro.idEditorial, this.editoriaisCombo, this.lf.idEditorial);
      this.setCombo(this.dadosDoLivro.idColecom, this.coleconsCombo, this.lf.idColecom);
      this.setCombo(this.dadosDoLivro.idEstilo, this.estilosCombo, this.lf.idEstilo);
      this.lf.isbn.setValue(this.dadosDoLivro.isbn);
      this.lf.paginas.setValue(this.dadosDoLivro.paginas);
      this.lf.paginasLidas.setValue(this.dadosDoLivro.paginasLidas);
      this.lf.lido.setValue(this.dadosDoLivro.lido);
      this.lf.diasLeitura.setValue(this.dadosDoLivro.diasLeitura);
      this.setData(this.dadosDoLivro.dataFimLeitura, this.lf.dataFimLeiturata);
      this.setCombo(this.dadosDoLivro.idIdioma, this.idiomasCombo, this.lf.idioma);
      this.setCombo(this.dadosDoLivro.idIdiomaOriginal, this.idiomasCombo, this.lf.idiomaOriginal);
      this.lf.numeroEdicom.setValue(this.dadosDoLivro.numeroEdicom);
      this.lf.electronico.setValue(this.dadosDoLivro.electronico);
      this.setData(this.dadosDoLivro.dataCriacom, this.lf.dataCriacom);
      this.setData(this.dadosDoLivro.dataEdicom, this.lf.dataEdicom);
      this.lf.somSerie.setValue(this.dadosDoLivro.somSerie);
      this.setCombo(this.dadosDoLivro.idSerie, this.seriesLivrosCombo, this.lf.serie);
      this.lf.premios.setValue(this.dadosDoLivro.premios);
      this.lf.descricom.setValue(this.dadosDoLivro.descricom);
      this.lf.comentario.setValue(this.dadosDoLivro.comentario);
      this.pontuacomEstrelas = this.dadosDoLivro.pontuacom;
    }
    else
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados do livro', duracom: 10});
  }

  /**
   * Gestiona os dados que se acavam de engadir, por ejemplo nova editorial, novo autor etc.
   */
  private setDadoEngadido() {
    let novoDado = this.dadosPaginasService.getNovoDado();
    if (novoDado && novoDado.elemento && this.dadosDoLivro) {
      switch (novoDado.tipo) {
        case DadosComplentarios.Autor: {
          const indexAtopado = this.dadosDoLivro.autores.findIndex(a => a.nome === 'Anónimo');
          if (indexAtopado >= 0)
            this.dadosDoLivro.autores.splice(indexAtopado, 1);
          this.dadosDoLivro.autores.push(novoDado.elemento);
          break
        }
        case DadosComplentarios.Genero: {
          this.dadosDoLivro.generos.push(novoDado.elemento);
          break
        }
        case DadosComplentarios.Biblioteca: {
          this.actualizarCombo(this.bibliotecasCombo, novoDado.elemento);
          this.dadosDoLivro.idBiblioteca = novoDado.elemento.id;
          break
        }
        case DadosComplentarios.Editorial: {
          this.actualizarCombo(this.editoriaisCombo, novoDado.elemento);
          this.dadosDoLivro.idEditorial = novoDado.elemento.id;
          break
        }
        case DadosComplentarios.Colecom: {
          this.actualizarCombo(this.coleconsCombo, novoDado.elemento);
          this.dadosDoLivro.idColecom = novoDado.elemento.id;
          break
        }
        case DadosComplentarios.EstiloLiterario: {
          this.actualizarCombo(this.estilosCombo, novoDado.elemento);
          this.dadosDoLivro.idEstilo = novoDado.elemento.id;
          break
        }
      }
    }
    this.dadosPaginasService.setNovoDado(undefined);
  }

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
    let resultados: Livro;
    const dados = <BaseDadosApi<Livro>>data;
    if (dados.data.length > 0) {
      resultados = dados.data[0];
      this.dadosDoLivro = dados.data[0];
      this.setDadosLivroForm();

      if (this.idRelectura !== '0') {
        // No caso de que se chegou à pagina dende a petiçom de umha relectura vaise ir a polos seus dados para amosala
        this.onEditarRelectura(this.idRelectura);
        this.idRelectura = '0';
      }
    }
  }

  private setData(dado: string, dataForm: FormControl){
    let dateConvert = new DateConvert();
    let dN = dateConvert.getDateFromMySQL(dado);
    (dN.year > 0) && dataForm.setValue(new Date(dN.year, dN.month - 1, dN.day));
  }

  private setCombo(id: number | null, dadosCombo: SimpleObjet[], dataForm: FormControl){
    if (id != null) {
      const findResource = dadosCombo.find(x => x.id == id);
      (findResource !== undefined) && dataForm.setValue(findResource.value);
    } else {
      dataForm.setValue(null)
    }
  }

  /**
   * Valida que la fecha desde no sea mayor que la hasta.
   * @param control control que lanza la validación.
   */
  checkDuasDatasValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        //const value = control.value;
        if (this.livroForm != null && this.livroForm.controls != null
          && this.livroForm.controls.dataCriacom != null
          && this.livroForm.controls.dataCriacom.value != null
          && this.livroForm.controls.dataEdicom != null
          && this.livroForm.controls.dataEdicom.value != null) {

          let dateConvert = new DateConvert();
          let dFrom = dateConvert.getDate(this.livroForm.controls.dataCriacom.value);
          let dTo = dateConvert.getDate(this.livroForm.controls.dataEdicom.value);

          if (dFrom.year > 0 && dTo.year > 0) {
            if (dFrom.year > dTo.year) {
              return { 'datasInvalidas': true };
            }
            else {
              if (dFrom.year == dTo.year && dFrom.month > dTo.month) {
                return { 'datasInvalidas': true };
              }
              else {
                if (dFrom.year == dTo.year && dFrom.month == dTo.month && dFrom.day > dTo.day) {
                  return { 'datasInvalidas': true };
                }
              }
            }

            if (this.livroForm.controls.dataEdicom.status !== 'VALID')
              this.livroForm.controls.dataEdicom.updateValueAndValidity();
            if (this.livroForm.controls.dataCriacom.status !== 'VALID')
              this.livroForm.controls.dataCriacom.updateValueAndValidity();
          }
        }
        return null;
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
              .filter(autor => !this.autoresLivro.some(a => a.id === autor.id))
              .map(autor => ({ id: autor.id, value: autor.nome }))
              .sort((a, b) => a.value.localeCompare(b.value)),
            escolma: [...this.autoresLivro]
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
              .filter(genero => !this.generosLivro.some(a => a.id === genero.id))
              .map(genero => ({ id: genero.id, value: genero.nome }))
              .sort((a, b) => a.value.localeCompare(b.value)),
            escolma: [...this.generosLivro]
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
          this.autoresLivro = dialogResult.escolma;
          break;
        }
        case MultiGestom.generos: {
          this.generosLivro = dialogResult.escolma;
          break;
        }
      }
    });
  }

  onIrPaginaAutor(rota: string, id: number): void {
    if (this.modo !== this.estadosPagina.soVisualizar) {
      let livro = this.setDadosLivro();
      this.dadosPaginasService.setDadosPagina({id: this.idLivro, nomePagina: this.nomePagina, elemento: livro});
      this.layoutService.amosarInfo(undefined);
      this.router.navigate([rota], {
        state: { id: id},
      });
    }
  }

  onIrPagina(rota: string, id: number): void {
    if (this.modo !== this.estadosPagina.soVisualizar) {
      let livro = this.setDadosLivro();
      this.dadosPaginasService.setDadosPagina({id: this.idLivro, nomePagina: this.nomePagina, elemento: livro});
      //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
      this.layoutService.amosarInfo(undefined);
      this.router.navigateByUrl(rota + '?id=' + id);
      // this.router.navigate([rota], {relativeTo: id});
      // this.router.navigate([rota], {dadoQueVai: id});
    }
    this.router.navigate([rota], {
      state: { id: id, idRelectura: 'algo mais de probas' },
    });
  }

  onIrPaginaBiblioteca(rota: string): void{
    let biblioteca = this.bibliotecasCombo.find(option => option.value === this.lf.idBiblioteca.value);
    if (biblioteca) {
      let livro = this.setDadosLivro();
      this.dadosPaginasService.setDadosPagina({id: this.idLivro, nomePagina: this.nomePagina, elemento: livro});
      this.dadosPaginasService.setNovoDado({tipo: DadosComplentarios.Biblioteca, elemento: biblioteca});
      this.layoutService.amosarInfo(undefined);
      this.router.navigateByUrl(rota + '?id=' + biblioteca.id);
    }
  }

  onIrPaginaEditorial(rota: string): void{
    let editorial = this.editoriaisCombo.find(option => option.value === this.lf.idEditorial.value);
    if (editorial) {
      let livro = this.setDadosLivro();
      this.dadosPaginasService.setDadosPagina({id: this.idLivro, nomePagina: this.nomePagina, elemento: livro});
      this.dadosPaginasService.setNovoDado({tipo: DadosComplentarios.Editorial, elemento: editorial});
      this.layoutService.amosarInfo(undefined);
      this.router.navigateByUrl(rota + '?id=' + editorial.id);
    }
  }

  onIrPaginaColecom(rota: string): void{
    let colecom = this.coleconsCombo.find(option => option.value === this.lf.idColecom.value);
    if (colecom) {
      let livro = this.setDadosLivro();
      this.dadosPaginasService.setDadosPagina({id: this.idLivro, nomePagina: this.nomePagina, elemento: livro});
      this.dadosPaginasService.setNovoDado({tipo: DadosComplentarios.Colecom, elemento: colecom});
      this.layoutService.amosarInfo(undefined);
      this.router.navigateByUrl(rota + '?id=' + colecom.id);
    }
  }

  onIrPaginaEstilo(rota: string): void{
    let estilo = this.estilosCombo.find(option => option.value === this.lf.idEstilo.value);
    if (estilo) {
      let livro = this.setDadosLivro();
      this.dadosPaginasService.setDadosPagina({id: this.idLivro, nomePagina: this.nomePagina, elemento: livro});
      this.dadosPaginasService.setNovoDado({tipo: DadosComplentarios.EstiloLiterario, elemento: estilo});
      this.layoutService.amosarInfo(undefined);
      this.router.navigateByUrl(rota + '?id=' + estilo.id);
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

  private guardarDadosDoLivro(tipo: DadosComplentarios) {
    let livro = this.setDadosLivro();
    this.dadosPaginasService.setDadosPagina({id: livro.id, nomePagina: this.nomePagina, elemento: livro});
    this.dadosPaginasService.setNovoDado({tipo: tipo, elemento: undefined});
    this.layoutService.amosarInfo(undefined);
  }

  onSomSerie(event:MatCheckboxChange) {
    if (event.checked) {
      this.lf.serie.enable();
    }
    else {
      this.lf.serie.setValue('');
      this.lf.serie.disable();
    }
  }

  onNovaPontuacom(pontuacom: number | undefined) {
    if (!this.modoRelectura) {
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
    if (this.modoRelectura) {
      this.guardarRelectura(event);
    }
    else {
      if (this.livroForm.valid) {
        let livroRepetido: BaseDadosApi<Livro>;
        this.livrosService
          .getLivroPorTitulo(String(this.lf.titulo.value).trim())
          .pipe(first())
          .subscribe({
            next: (v: object) => livroRepetido = <BaseDadosApi<Livro>>v,
            error: (e: any) => { console.error(e),
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do livro.'}); },
              complete: () => this.guardarLivro(event, livroRepetido)
        });
      }
    }
  }

  guardarLivro(event: any, livroRepetido: BaseDadosApi<Livro>) {
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
            next: (v: object) => {console.debug(v), this.gestionarExito(v, livro)},
            error: (e: any) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir o livro.', duracom: 10});
              console.error(e) },
              complete: () => {
                this.modo = EstadosPagina.guardar;
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
            next: (v: object) => {console.debug(v), this.gestionarExito(v, livro)},
            error: (e: any) => {
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
    let dateConvert = new DateConvert();
    let dFL = dateConvert.getDate(this.lf.dataFimLeiturata.value);
    let dC = dateConvert.getDate(this.lf.dataCriacom.value);
    let dE = dateConvert.getDate(this.lf.dataEdicom.value);

    let biblioteca = this.bibliotecasCombo.find(option => option.value === this.lf.idBiblioteca.value);
    let editorial = this.editoriaisCombo.find(option => option.value === this.lf.idEditorial.value);
    let colecom = this.coleconsCombo.find(option => option.value === this.lf.idColecom.value);
    let estilo = this.estilosCombo.find(option => option.value === this.lf.idEstilo.value);
    let idioma = this.idiomasCombo.find(option => option.value === this.lf.idioma.value);
    let idiomaOriginal = this.idiomasCombo.find(option => option.value === this.lf.idiomaOriginal.value);
    let serie = this.seriesLivrosCombo.find(option => option.value === this.lf.serie.value);

    let autores: ObjetoSimpleIdNome[] = [];
    this.autoresLivro.forEach(function (value) {
      autores.push({id: value.id, nome: value.value});
    });
    if (autores.length < 1) {
      const dados = this.usuarioAppService.getDadosOutros();
      if (dados && dados.autores && dados.autores.data.length > 0) {
        let anonimo = dados.autores.data.find(a => a.nome === 'Anónimo');
        if (anonimo)
          autores.push({id: anonimo.id, nome: anonimo.nome});
      }
    }

    let generos: Genero[] = [];
    this.generosLivro.forEach(function (value) {
      generos.push({id: value.id, nome: value.value});
    });

    let livro: Livro = {
      id: (this.dadosDoLivro) ? this.dadosDoLivro.id : '0',
      titulo: String(this.lf.titulo.value),
      autores: autores,
      tituloOriginal: (this.lf.tituloOriginal.value) ? String(this.lf.tituloOriginal.value) : null,
      generos: generos,
      idBiblioteca: (biblioteca) ? biblioteca.id : null,
      idEditorial: (editorial) ? editorial.id : null,
      idColecom: (colecom) ? colecom.id : null,
      idEstilo: (estilo) ? estilo.id : null,
      isbn: (this.lf.isbn.value) ? String(this.lf.isbn.value) : null,
      paginas: (this.lf.paginas.value) ? String(this.lf.paginas.value) : null,
      paginasLidas: (!this.lf.paginasLidas.value) ? null : String(this.lf.paginasLidas.value),
      lido: (!this.lf.lido.value) ? false : this.lf.lido.value,
      diasLeitura: (this.lf.diasLeitura.value) ? String(this.lf.diasLeitura.value) : null,
      dataFimLeitura: (dFL.year > 0) ? dFL.year + '-' + dFL.month + '-' + dFL.day : '',
      idIdioma: (idioma) ? idioma.id : null,
      idIdiomaOriginal: (idiomaOriginal) ? idiomaOriginal.id : null,
      dataCriacom: (dC.year > 0) ? dC.year + '-' + dC.month + '-' + dC.day : '',
      dataEdicom: (dE.year > 0) ? dE.year + '-' + dE.month + '-' + dE.day : '',
      numeroEdicom: (this.lf.numeroEdicom.value) ? String(this.lf.numeroEdicom.value) : null,
      electronico: (!this.lf.electronico.value) ? false : this.lf.electronico.value,
      somSerie: (!this.lf.somSerie.value) ? false : this.lf.somSerie.value,
      idSerie: (serie) ? serie.id : null,
      premios: (this.lf.premios.value) ? String(this.lf.premios.value) : null,
      descricom: (this.lf.descricom.value) ? String(this.lf.descricom.value) : null,
      comentario: (this.lf.comentario.value) ? String(this.lf.comentario.value) : null,
      pontuacom: this.dadosDoLivro?.pontuacom,
      // nom necesarios
      biblioteca: '',
      editorial: '',
      colecom: '',
      estilo: '',
    };

    return livro;
  }

  private gestionarExito(data: object, livro: Livro) {
    if (data) {
      let info = <{idResult: string}>data;
      livro.id = info.idResult;
      this.dadosDoLivro = livro;
    }
  }
}
