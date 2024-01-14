import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first, map, Observable, startWith } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LivrosService } from 'src/app/core/services/api/livros.service';
import { Autor, Livro, LivroData, Outros, Parametros, datasUltimosAnos } from './livro.interface';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { OutrosService } from 'src/app/core/services/api/outros.service';
import { Genero, SimpleObjet } from 'src/app/shared/models/outros';
import { DateConvert } from 'src/app/shared/classes/date-convert';
import { MatDialog } from '@angular/material/dialog';
import { MultiDados, MultiSelecomDialogComponent } from 'src/app/core/components/multi-selecom-dialog/multi-selecom-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DadosPaginasService } from 'src/app/core/services/flow/dados-paginas.service';
import { DadosComplentarios, InformacomPeTipo } from 'src/app/shared/enums/estadisticasTipos';
import { LayoutService } from 'src/app/core/services/flow/layout.service';
import { Title } from '@angular/platform-browser';
import { EngadirEditarData } from 'src/app/shared/models/datas';

export enum MultiGestom {
  autores = 1,
  generos = 2,
}

@Component({
  selector: 'omla-livro',
  templateUrl: './livro.component.html',
  styleUrls: ['./livro.component.scss']
})
export class LivroComponent implements OnInit {

  idLivro: number = 0;
  nomePagina = 'livro';
  engadir = 'Engadir'; guardar = 'Guardar';
  modo = this.engadir;
  multiGestom = MultiGestom;
  dadosComplentarios = DadosComplentarios;
  totalAutores: SimpleObjet[] = [];
  autoresLivro: SimpleObjet[] = [];
  totalGeneros: SimpleObjet[] = [];
  generosLivro: SimpleObjet[] = [];
  bibliotecasCombo: SimpleObjet[] = [];
  bibliotecas: Observable<SimpleObjet[]> | undefined;
  editoriaisCombo: SimpleObjet[] = [];
  editoriais: Observable<SimpleObjet[]> | undefined;
  coleconsCombo: SimpleObjet[] = [];
  colecons: Observable<SimpleObjet[]> | undefined;
  idiomasCombo: SimpleObjet[] = [];
  idiomas: Observable<SimpleObjet[]> | undefined;
  idiomasOriginais: Observable<SimpleObjet[]> | undefined;
  seriesLivrosCombo: SimpleObjet[] = [];
  seriesLivro: Observable<SimpleObjet[]> | undefined;

  dadosDoLivro: Livro | undefined;

  rex1000000 = '([1-1][0-0]{6,6}|[0-9]{1,6})';
  rex1000 = '([1-1][0-0]{3,3}|[0-9]{1,3})';
  livroForm = this.fb.group({
    titulo: new FormControl('', {
        validators: [
           Validators.required,
           Validators.maxLength(100)
        ],
        // asyncValidators: [ ... array of asynchronous validators ...]
        updateOn: 'blur' // 'change' or 'blur' or 'submit'
    }),
    tituloOriginal: new FormControl('', { validators: [Validators.maxLength(100)] }),
    idBiblioteca: new FormControl(''),
    idEditorial: new FormControl(''),
    idColecom: new FormControl(''),
    isbn: new FormControl('', { validators: [Validators.maxLength(20)] }),
    paginas: new FormControl('', { validators: [Validators.pattern(this.rex1000000)] }),
    paginasLidas: new FormControl('', { validators: [Validators.pattern(this.rex1000000)] }),
    lido: [false],
    diasLeitura: new FormControl('', { validators: [Validators.pattern(this.rex1000)] }),
    dataFimLeiturata: new FormControl(''),
    idioma: new FormControl(''),
    idiomaOriginal: new FormControl(''),
    dataCriacom: new FormControl('', { validators: [ this.checkDuasDatasValidator() ] }),
    dataEdicom: new FormControl('', { validators: [ this.checkDuasDatasValidator() ] }),
    numeroEdicom: new FormControl('', { validators: [Validators.pattern(this.rex1000)] }),
    electronico: new FormControl(false),
    somSerie: new FormControl(false),
    serie: new FormControl(''),
    premios: new FormControl('', { validators: [Validators.maxLength(255)] }),
    descricom: new FormControl('', { validators: [Validators.maxLength(50000)] }),
    comentario: new FormControl('', { validators: [Validators.maxLength(50000)] }),
  });
  get lf() { return this.livroForm.controls; }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private title: Title,
    private fb: FormBuilder,
    private outrosService: OutrosService,
    private livrosService: LivrosService,
    private dialog: MatDialog,
    private dadosPaginas: DadosPaginasService ) { }

  ngOnInit(): void {
    let id = 0;
    this.title.setTitle(this.title.getTitle() + ' Engadir');
    this.route.queryParams
      .subscribe(params => {
        let parametros = <Parametros>params;
        if (parametros.id == 0)
          this.modo = this.engadir;
        else {
          id = parametros.id;
          this.modo = this.guardar;
        }
        this.obterDadosOutros(parametros.id);
      }
    );
    this.idLivro = id;
  }

  private obterDadosOutros(idLivro: number): void {
    this.outrosService
      .getTodo()
      .pipe(first())
      .subscribe({
        next: (v) => this.dadosOutrosObtidos(v, idLivro),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados', duracom: 10}); },
        complete: () => this.obterDadosDoLivro(idLivro)
    });
  }

  private dadosOutrosObtidos(data: object, idLivro: number) {
    const dados = <Outros>data;
    if (dados != null) {

      if (dados.autores != null
        && dados.autores.data != null && Array.isArray(dados.autores.data)) {

        let dadosReducidos: SimpleObjet[] = [];
        dados.autores.data.forEach(function (value) {
          dadosReducidos.push({id: value.id, value: value.nome});
        });
        this.totalAutores = dadosReducidos;
      }

      if (dados.generos != null
        && dados.generos.data != null && Array.isArray(dados.generos.data)) {

        let dadosReducidos: SimpleObjet[] = [];
        dados.generos.data.forEach(function (value) {
          dadosReducidos.push({id: value.id, value: value.nome});
        });
        this.totalGeneros = dadosReducidos;
      }

      if (dados.bibliotecas != null
        && dados.bibliotecas.data != null && Array.isArray(dados.bibliotecas.data)) {

        let dadosReducidos: SimpleObjet[] = [];
        dados.bibliotecas.data.forEach(function (value) {
          dadosReducidos.push({id: value.id, value: value.nome});
        });
        this.bibliotecasCombo = dadosReducidos;

        this.bibliotecas = this.lf.idBiblioteca.valueChanges
          .pipe(
            startWith(''),
            map(value => this.filtroCombo(<string>value, this.bibliotecasCombo))
          );
      }

      if (dados.editoriais != null
        && dados.editoriais.data != null && Array.isArray(dados.editoriais.data)) {

        let dadosReducidos: SimpleObjet[] = [];
        dados.editoriais.data.forEach(function (value) {
          dadosReducidos.push({id: value.id, value: value.nome});
        });
        this.editoriaisCombo = dadosReducidos;

        this.editoriais = this.lf.idEditorial.valueChanges
          .pipe(
            startWith(''),
            map(value => this.filtroCombo(<string>value, this.editoriaisCombo))
          );
      }

      if (dados.colecons != null
        && dados.colecons.data != null && Array.isArray(dados.colecons.data)) {

        let dadosReducidos: SimpleObjet[] = [];
        dados.colecons.data.forEach(function (value) {
          dadosReducidos.push({id: value.id, value: value.nome});
        });
        this.coleconsCombo = dadosReducidos;

        this.colecons = this.lf.idColecom.valueChanges
          .pipe(
            startWith(''),
            map(value => this.filtroCombo(<string>value, this.coleconsCombo))
          );
      }

      if (dados.idiomas != null
        && dados.idiomas.data != null && Array.isArray(dados.idiomas.data)) {

        let dadosReducidos: SimpleObjet[] = [];
        dados.idiomas.data.forEach(function (value) {
          dadosReducidos.push({id: value.id, value: value.nome});
        });
        this.idiomasCombo = dadosReducidos;

        this.idiomas = this.lf.idioma.valueChanges
          .pipe(
            startWith(''),
            map(value => this.filtroCombo(<string>value, this.idiomasCombo))
          );
        this.idiomasOriginais = this.lf.idiomaOriginal.valueChanges
          .pipe(
            startWith(''),
            map(value => this.filtroCombo(<string>value, this.idiomasCombo))
          );
      }

      if (dados.seriesLivro != null
        && dados.seriesLivro.data != null && dados.seriesLivro.data.length > 0) {

        let dadosReducidos: SimpleObjet[] = [];
        dadosReducidos.push({id: 0, value: 'Som o primeiro'});
        dados.seriesLivro.data.forEach(function (value) {
          dadosReducidos.push({id: value.id, value: value.titulo});
        });
        this.seriesLivrosCombo = dadosReducidos;

        this.seriesLivro = this.lf.serie.valueChanges
          .pipe(
            startWith(''),
            map(value => this.filtroCombo(<string>value, this.seriesLivrosCombo))
          );
      }

      /* if (idLivro == 0 && dados.ultimaLeitura) {
        let dateConvert = new DateConvert();
        let data = dateConvert.getDateFromMySQL(dados.ultimaLeitura);
        console.log('ultima Leitura anterior:', data);
        const dias = this.getDiasDendeUltimaLeitura(data);
        this.lf.diasLeitura.setValue(dias.toString());
      } */

      if (idLivro == 0 && dados.ultimasLeituras && dados.ultimasLeituras.length > 0) {
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
  private setDiasDendeUltimaLeitura(dados: datasUltimosAnos[]) {
    let dateConvert = new DateConvert();

    let maiorData: EngadirEditarData = { day: 0, month: 0, year: 0 };
    dados.forEach(function (value) {
      let iterado = dateConvert.getDateFromMySQL(value.dataDoLivro);
      if (iterado.year > maiorData.year) {
        //console.log('id do maior ANO: ' + value.id, maiorData);
        maiorData = dateConvert.getDateFromMySQL(value.dataDoLivro);
      }
      else if (iterado.year = maiorData.year) {
        if (iterado.month > maiorData.month) {
          //console.log('id do maior MES: ' + value.id, maiorData, iterado);
          maiorData = dateConvert.getDateFromMySQL(value.dataDoLivro);
        }
        else if (iterado.month = maiorData.month) {
          if (iterado.day > maiorData.day) {
            //console.log('id do maior DIA: ' + value.id, maiorData, iterado);
            maiorData = dateConvert.getDateFromMySQL(value.dataDoLivro);
          }
        }
      }
    });

    maiorData.day = maiorData.day + 1;
    //console.log('ultimas Leituras:', dados);
    //console.log('maior data', maiorData);
    const dias = this.getDiasDendeUltimaLeitura(maiorData);
    this.lf.diasLeitura.setValue(dias.toString());
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
    const filterValue = value.toLowerCase();

    return listadoSimple.filter(option => option.value.toLowerCase().includes(filterValue));
  }

  private obterDadosDoLivro(id: number): void {
    let livro = this.dadosPaginas.getDadosPagina(id, this.nomePagina);
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
          next: (v) => this.dadosObtidosDoLivro(v),
          error: (e) => { console.error(e),
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
    }
    else
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados do livro', duracom: 10});
  }

  /**
   * Gestiona os dados que se acavam de engadir, por ejemplo nova editorial, novo autor etc.
   */
  private setDadoEngadido() {
    let novoDado = this.dadosPaginas.getNovoDado();
    if (novoDado && novoDado.elemento && this.dadosDoLivro) {
      switch (novoDado.tipo) {
        case DadosComplentarios.Autor: {
          const anonimo = this.totalAutores.find(a => a.value === 'Anónimo');
          if (anonimo) {
            const indexAtopado = this.dadosDoLivro.autores.findIndex(a => a.id == anonimo.id);
            if (indexAtopado >= 0)
              this.dadosDoLivro.autores.splice(indexAtopado, 1);
          }
          this.dadosDoLivro.autores.push(novoDado.elemento);
          break
        }
        case DadosComplentarios.Genero: {
          this.dadosDoLivro.generos.push(novoDado.elemento);
          break
        }
        case DadosComplentarios.Biblioteca: {
          this.dadosDoLivro.idBiblioteca = novoDado.elemento.id;
          break
        }
        case DadosComplentarios.Editorial: {
          this.dadosDoLivro.idEditorial = novoDado.elemento.id;
          break
        }
        case DadosComplentarios.Colecom: {
          this.dadosDoLivro.idColecom = novoDado.elemento.id;
          break
        }
      }
    }
    this.dadosPaginas.setNovoDado(undefined);
  }

  private dadosObtidosDoLivro(data: object) {
    let resultados: Livro;
    const dados = <LivroData>data;
    resultados = dados.livro;
    if (resultados) {
      this.dadosDoLivro = dados.livro;
      this.setDadosLivroForm();
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
    let multiDados: MultiDados = {total: [], escolma: []};
    switch (opcom) {
      case MultiGestom.autores: {
        if (this.totalAutores.length < 1) {
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom há autores disponhiveis'});
        }
        else {
          let totalAutoresFiltrado: SimpleObjet[] = [];
          this.totalAutores.forEach(autor => {
            let atopado = this.autoresLivro.find(g => g.id == autor.id);
            if (!atopado)
              totalAutoresFiltrado.push(autor);
          });
          multiDados.total = totalAutoresFiltrado;
          multiDados.escolma = [...this.autoresLivro];
        }
        break;
      }
      case MultiGestom.generos: {
        if (this.totalGeneros.length < 1) {
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom há géneros disponhiveis'});
        }
        else {
          let totalGenerosFiltrado: SimpleObjet[] = [];
          this.totalGeneros.forEach(genero => {
            let atopado = this.generosLivro.find(g => g.id == genero.id);
            if (!atopado)
              totalGenerosFiltrado.push(genero);
          });
          multiDados.total = totalGenerosFiltrado;
          multiDados.escolma = [...this.generosLivro];
        }
        break;
      }
    }

    const dialogRef = this.dialog.open(MultiSelecomDialogComponent, {
      maxWidth: "600px", panelClass: 'popup-multiselecom',
      data: multiDados
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
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

  onIrPagina(rota: string, id: number): void {
    let livro = this.setDadosLivro();
    this.dadosPaginas.setDadosPagina({id: this.idLivro, nomePagina: this.nomePagina, elemento: livro});
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }

  onIrPaginaBiblioteca(rota: string): void{
    let biblioteca = this.bibliotecasCombo.find(option => option.value === this.lf.idBiblioteca.value);
    if (biblioteca) {
      let livro = this.setDadosLivro();
      this.dadosPaginas.setDadosPagina({id: this.idLivro, nomePagina: this.nomePagina, elemento: livro});
      this.layoutService.amosarInfo(undefined);
      this.router.navigateByUrl(rota + '?id=' + biblioteca.id);
    }
  }

  onIrPaginaEditorial(rota: string): void{
    let editorial = this.editoriaisCombo.find(option => option.value === this.lf.idEditorial.value);
    if (editorial) {
      let livro = this.setDadosLivro();
      this.dadosPaginas.setDadosPagina({id: this.idLivro, nomePagina: this.nomePagina, elemento: livro});
      this.layoutService.amosarInfo(undefined);
      this.router.navigateByUrl(rota + '?id=' + editorial.id);
    }
  }

  onIrPaginaEngadir(rota: string, tipo: DadosComplentarios): void{
    let livro = this.setDadosLivro();
    this.dadosPaginas.setDadosPagina({id: livro.id, nomePagina: this.nomePagina, elemento: livro});
    this.dadosPaginas.setNovoDado({tipo: tipo, elemento: undefined});
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=0');
  }

  onIrPaginaColecom(rota: string): void{
    let colecom = this.coleconsCombo.find(option => option.value === this.lf.idColecom.value);
    if (colecom) {
      let livro = this.setDadosLivro();
      this.dadosPaginas.setDadosPagina({id: this.idLivro, nomePagina: this.nomePagina, elemento: livro});
      this.layoutService.amosarInfo(undefined);
      this.router.navigateByUrl(rota + '?id=' + colecom.id);
    }
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
    if (this.dadosDoLivro)
      this.dadosDoLivro.pontuacom = pontuacom;
  }

  onSubmit(event: any) {
    if (this.livroForm.valid) {

      let livro = this.setDadosLivro();

      if (event.submitter.value === this.engadir) {
        this.livrosService
          .postLivro(livro)
          .pipe(first())
          .subscribe({
            next: (v) => console.debug(v),
            error: (e) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir o livro.', duracom: 10});
              console.error(e) },
            complete: () => { this.modo = this.guardar;
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Livro engadido.'});
              console.debug('post completado'); }
        });
      }
      else {
        this.livrosService
          .putLivro(livro)
          .pipe(first())
          .subscribe({
            next: (v) => console.debug(v),
            error: (e) => {
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
    let idioma = this.idiomasCombo.find(option => option.value === this.lf.idioma.value);
    let idiomaOriginal = this.idiomasCombo.find(option => option.value === this.lf.idiomaOriginal.value);
    let serie = this.seriesLivrosCombo.find(option => option.value === this.lf.serie.value);

    let autores: Autor[] = [];
    this.autoresLivro.forEach(function (value) {
      autores.push({id: value.id, nome: value.value});
    });
    if (autores.length < 1) {
      let anonimo = this.totalAutores.find(a => a.value === 'Anónimo');
      if (anonimo)
        autores.push({id: anonimo.id, nome: anonimo.value});
    }

    let generos: Genero[] = [];
    this.generosLivro.forEach(function (value) {
      generos.push({id: value.id, nome: value.value});
    });

    let livro: Livro = {
      id: (this.dadosDoLivro) ? Number(this.dadosDoLivro.id) : 0,
      titulo: String(this.lf.titulo.value),
      autores: autores,
      tituloOriginal: (this.lf.tituloOriginal.value) ? String(this.lf.tituloOriginal.value) : null,
      generos: generos,
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
    };

    return livro;
  }
}
