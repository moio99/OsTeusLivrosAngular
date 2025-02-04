import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Validators, ValidatorFn, FormBuilder, AbstractControl, ValidationErrors, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, map, Observable, startWith } from 'rxjs';
import { AutorData } from '../../../core/models/autor.interface';
import { ListadoLivros, ListadoLivrosData } from '../../../core/models/listado-livros.interface';
import { Autor } from '../../../core/models/livro.interface';
import { AutoresService } from '../../../core/services/api/autores.service';
import { LivrosService } from '../../../core/services/api/livros.service';
import { OutrosService } from '../../../core/services/api/outros.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { DateConvert } from '../../../shared/classes/date-convert';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { Nacionalidade, SimpleObjet, Pais, DadosObtidos } from '../../../shared/models/outros.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'omla-autor',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule
    , MatInputModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule ],
  templateUrl: './autor.component.html',
  styleUrls: ['./autor.component.scss']
})
export class AutorComponent implements OnInit {

  engadir = 'Engadir'; guardar = 'Guardar';
  modo = this.engadir;
  dadosDoAutor: Autor | undefined= {
    id: 0,
    nome: '',
    nomeReal: '',
    lugarNacemento: '',
    dataNacemento: '',
    dataDefuncom: '',
    premios: '',
    web: '',
    comentario: '',
    idNacionalidade: 0,
    nomeNacionalidade: '',
    idPais: 0,
    nomePais: '',
    quantidade: 0
  };
  dadosLivrosDoAutor: ListadoLivros[] = [];

  dadosNacionalidades: Nacionalidade[] = [];
  dadosNacionalidadesCombo: SimpleObjet[] = [];
  dadosNacionalidadesFiltradas: Observable<SimpleObjet[]> | undefined;
  dadosPaises: Pais[] = [];
  dadosPaisesCombo: SimpleObjet[] = [];
  dadosPaisesFiltrados: Observable<SimpleObjet[]> | undefined;
  date= new Date();

  autorForm = this.fb.group({
    nome: ['', {
        validators: [
           Validators.required,
           Validators.maxLength(150)
        ],
        // asyncValidators: [ ... array of asynchronous validators ...]
        updateOn: 'blur' // 'change' or 'blur' or 'submit'
    }],
    nomeReal: ['', { validators: [Validators.maxLength(150)] }],
    lugarNacemento: ['', { validators: [Validators.maxLength(150)] }],
    nacom: [''],
    pais: [''],
    dataNacemento: ['', { validators: [ this.checkDuasDatasValidator() ] }],
    dataDefuncom: ['', { validators: [ this.checkDuasDatasValidator() ] }],
    premios: ['', { validators: [Validators.maxLength(500)] }],
    web: ['', { validators: [Validators.maxLength(100)] }],
    comentario: [''],
  });
  get af() { return this.autorForm.controls; }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private fb: FormBuilder,
    private location: Location,
    private outrosService: OutrosService,
    private autoresService: AutoresService,
    private livrosService: LivrosService,
    private dadosPaginasService: DadosPaginasService) { }

  ngOnInit(): void {
    const state = history.state;
    if (state?.id) {
      if (state.id === '0')
        this.modo = this.engadir;
      else {
        this.modo = this.guardar;
        this.obterLivros(state.id);
      }
    }
    this.obterNacionalidades(state.id);
  }

  /**
   * Valida que la fecha desde no sea mayor que la hasta.
   * @param control control que lanza la validación.
   */
  checkDuasDatasValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        //const value = control.value;
        if (this.autorForm != null && this.autorForm.controls != null
          && this.autorForm.controls.dataDefuncom != null
          && this.autorForm.controls.dataDefuncom.value != null
          && this.autorForm.controls.dataNacemento != null
          && this.autorForm.controls.dataNacemento.value != null) {

          let dateConvert = new DateConvert();
          let dFrom = dateConvert.getDate(this.autorForm.controls.dataNacemento.value);
          let dTo = dateConvert.getDate(this.autorForm.controls.dataDefuncom.value);

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

            if (this.autorForm.controls.dataNacemento.status !== 'VALID')
              this.autorForm.controls.dataNacemento.updateValueAndValidity();
            if (this.autorForm.controls.dataDefuncom.status !== 'VALID')
              this.autorForm.controls.dataDefuncom.updateValueAndValidity();
          }
        }
        return null;
    }
  }

  //#region Obtençom de dados
  private obterLivros(id: string): void {
    this.livrosService
      .getLivrosPorAutor(id)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosLivrosDoAutor = this.dadosLivrosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os livros do autor'}); },
          complete: () => console.debug('completada a obtençom dos livros do autor')
    });
  }

  private dadosLivrosObtidos(data: object): ListadoLivros[] {
    let resultados: ListadoLivros[];
    const dados = <ListadoLivrosData>data;
    if (dados != null) {
      resultados = dados.data;
    } else {
      resultados = [];
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados dos livros do autor'});
      console.debug('Nom se obtiverom dados dos livros do autor');
    }
    return resultados
  }

  private obterNacionalidades(idAutor: string): void {
    this.outrosService
      .getNacionalidades()
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosNacionalidades = this.dadosNacionalidadesObtidas(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: 'Nom se puiderom obter os dados das nacionalidades'}); },
          complete: () => this.obterPaises(idAutor)
    });
  }

  private dadosNacionalidadesObtidas(data: object): Nacionalidade[] {
    const dados = <DadosObtidos>data;
    if (dados != null && dados.data.length > 0) {
      let dadosReducidos: SimpleObjet[] = [];
      dados.data.forEach(function (value) {
        dadosReducidos.push({id: value.id, value: value.nome});
      });
      this.dadosNacionalidadesCombo = dadosReducidos;

      this.dadosNacionalidadesFiltradas = this.af.nacom.valueChanges
        .pipe(
          startWith(''),
          map(value => this.filtroDeNacionalidades(value as string))
        );

      return dados.data;
    }
    else return [];
  }

  /**
  * Filtra os valores do despregável.
  * @param value Filtro inserido polo usuario.
  */
  private filtroDeNacionalidades(value: string): SimpleObjet[] {
    const filterValue = value.toLowerCase();

    return this.dadosNacionalidadesCombo.filter(option => option.value.toLowerCase().includes(filterValue));
  }

  private obterPaises(idAutor: string): void {
    this.outrosService
      .getPaises()
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosPaises = this.dadosPaisesObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados dos paises'}); },
          complete: () => this.obterDadosDoAutor(idAutor)
    });
  }

  private dadosPaisesObtidos(data: object): Pais[] {
    const dados = <DadosObtidos>data;
    if (dados != null && dados.data.length > 0) {
      let dadosReducidos: SimpleObjet[] = [];
      dados.data.forEach(function (value) {
        dadosReducidos.push({id: value.id, value: value.nome});
      });
      this.dadosPaisesCombo = dadosReducidos;

      this.dadosPaisesFiltrados = this.af.pais.valueChanges
        .pipe(
          startWith(''),
          map(value => this.filtroDePaises(value as string))
        );

      return dados.data;
    }
    else return [];
  }

  /**
  * Filtra os valores do despregável.
  * @param value Filtro inserido polo usuario.
  */
   private filtroDePaises(value: string): SimpleObjet[] {
    const filterValue = value.toLowerCase();

    return this.dadosPaisesCombo.filter(option => option.value.toLowerCase().includes(filterValue));
  }

  private obterDadosDoAutor(id: string): void {
    if (id !== '0') {
      this.autoresService
        .getAutor(id)
        .pipe(first())
        .subscribe({
          next: (v: object) => this.dadosDoAutor = this.dadosAutorObtidos(v),
          error: (e: any) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do autor'}); },
            complete: () => console.debug('completada a obtençom dos dados do autor')
      });
    }
  }

  private dadosAutorObtidos(data: object): Autor  | undefined {
    let resultados: Autor | undefined;
    const dados = <AutorData>data;
    if (dados.autor.length > 0) {
      resultados = dados.autor[0];
      if (resultados != undefined) {
        this.af.nome.setValue(dados.autor[0].nome);
        this.af.nomeReal.setValue(dados.autor[0].nomeReal);
        this.af.lugarNacemento.setValue(dados.autor[0].lugarNacemento);
        if (dados.autor[0].idNacionalidade != null) {
          const findResource = this.dadosNacionalidadesCombo.find(x => x.id == dados.autor[0].idNacionalidade);
          if (findResource !== undefined)
            this.af.nacom.setValue(findResource.value);
        }
        if (dados.autor[0].idPais != null) {
          const findResource = this.dadosPaisesCombo.find(x => x.id == dados.autor[0].idPais);
          if (findResource !== undefined)
            this.af.pais.setValue(findResource.value);
        }
        let dateConvert = new DateConvert();
        let dN = dateConvert.getDateFromMySQL(dados.autor[0].dataNacemento);
        if (dN.year > 0) {
          let data = <FormControl>this.af.dataNacemento;
          data.setValue(new Date(dN.year, dN.month - 1, dN.day));
        }
        let dD = dateConvert.getDateFromMySQL(dados.autor[0].dataDefuncom);
        if (dD.year > 0) {
          let data = <FormControl>this.af.dataDefuncom;
          data.setValue(new Date(dD.year, dD.month - 1, dD.day));
        }

        this.af.web.setValue(dados.autor[0].web);
        this.af.comentario.setValue(dados.autor[0].comentario);
      }
    }
    else{
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados do autor'});
      resultados = undefined;
    }
    return resultados
  }
  //#region

  onSubmit(event: any) {
    if (this.af.nome.status === 'VALID' && this.af.nomeReal.status === 'VALID'
      && this.af.lugarNacemento.status === 'VALID'
      && this.af.dataNacemento.status === 'VALID' && this.af.dataDefuncom.status === 'VALID'
      && this.af.premios.status === 'VALID' && this.af.web.status === 'VALID') {

      let autorRepetido: AutorData;
      this.autoresService
        .getAutorPorNome(String(this.af.nome.value).trim())
        .pipe(first())
        .subscribe({
          next: (v: object) => autorRepetido = <AutorData>v,
          error: (e: any) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do autor.'}); },
            complete: () => this.guardarAutor(event, autorRepetido)
      });
    }
  }

  guardarAutor(event: any, autorRepetido: AutorData) {
    if (autorRepetido != undefined && autorRepetido.meta.quantidade > 0 && (
      (event.submitter.value === this.engadir)
      ||
      (event.submitter.value !== this.engadir && autorRepetido.meta.id != this.dadosDoAutor?.id))) { // se está actualizando os ids deben ser inguais
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'O nome do autor já existe na base de dados'});
    }
    else {

      let dateConvert = new DateConvert();
      let dN = dateConvert.getDate(this.af.dataNacemento.value);
      let dD = dateConvert.getDate(this.af.dataDefuncom.value);

      let nacom = this.dadosNacionalidadesCombo.find(option => option.value === this.af.nacom.value);
      let pais = this.dadosPaisesCombo.find(option => option.value === this.af.pais.value);
      const autor: Autor = {
        id: Number(this.dadosDoAutor?.id),
        nome: String(this.af.nome.value).trim(),
        nomeReal: (this.af.nomeReal.value == null) ? null : String(this.af.nomeReal.value).trim(),
        lugarNacemento: (this.af.lugarNacemento.value == null) ? null : String(this.af.lugarNacemento.value).trim(),
        dataNacemento: (dN.year > 0) ? dN.year + '-' + dN.month + '-' + dN.day : '',
        dataDefuncom: (dD.year > 0) ? dD.year + '-' + dD.month + '-' + dD.day : '',
        idNacionalidade: (nacom != undefined) ? nacom.id : null,
        idPais: (pais != undefined) ? pais.id : null,
        premios: (this.af.premios.value == null) ? null : String(this.af.premios.value).trim(),
        web: (this.af.web.value == null) ? null : String(this.af.web.value).trim(),
        comentario: (this.af.comentario.value == null) ? null : String(this.af.comentario.value).trim(),
        nomeNacionalidade: '',
        nomePais: '',
        quantidade: 0
      };

      if (event.submitter.value === this.engadir) {
        this.autoresService
          .postAutor(autor)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, autor)},
            error: (e: any) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir o autor.'});
              console.error(e) },
              complete: () => {
                this.modo = this.guardar;
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Autor engadido.'});
                // console.debug('post completado');
              }
        });
      }
      else {
        this.autoresService
          .putAutor(autor)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, autor)},
            error: (e: any) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido guardar o autor.'});
              console.error(e) },
              complete: () => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Autor guardado.'});
              console.debug('put completado') }
        });
      }
    }
  }

  private gestionarRetroceso(data: object, autor: Autor) {
    const dados = <ListadoLivrosData>data;
    if (dados) {
      autor.id = dados.meta.id;
      this.dadosDoAutor = autor;
      let novoDado = this.dadosPaginasService.getNovoDado();
      if (novoDado) {
        novoDado.elemento = autor;
        this.layoutService.amosarInfo(undefined);
        this.location.back();
      }
    }
  }

  onCancelar() {
    this.dadosPaginasService.setNovoDado(undefined);
    this.layoutService.amosarInfo(undefined);
    this.location.back();
  }

  isString(value: any): boolean {
    return typeof value === 'string' || value instanceof String;
  }

  onIrPagina(rota: string, id: string): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }
}

