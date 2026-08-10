import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, Location } from '@angular/common';
import { Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { first, map, Observable, startWith } from 'rxjs';
import { Autor, AutorData, AutorForm } from '../../../core/models/autor.interface';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { ListadoLivros } from '../../../core/models/listado-livros.interface';
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
import { environment, environments } from '../../../../environments/environment';
import { UsuarioAppService } from '../../../core/services/flow/usuario-app.service';
import { BaseListadoDadosApi } from '../../../core/models/base-dados-api.interface';

@Component({
  selector: 'omla-autor',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule
    , MatInputModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule ],
  templateUrl: './autor.component.html',
  styleUrls: ['./autor.component.scss']
})
export class AutorComponent implements OnInit {

  estadosPagina = EstadosPagina;
  modo = EstadosPagina.soVisualizar;
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
  dadosPaises: Pais[] = [];
  date = new Date();

  private fb = inject(FormBuilder);
  autorForm = this.fb.group<AutorForm>({
        nome: new FormControl('', {
            validators: [
               Validators.required,
               Validators.maxLength(150)
            ],
            // asyncValidators: [ ... array of asynchronous validators ...]
            updateOn: 'blur' // 'change' or 'blur' or 'submit'
        },),
        nomeReal: new FormControl('', { validators: [Validators.maxLength(150)] }),
        lugarNacemento: new FormControl('', { validators: [Validators.maxLength(150)] }),
        dataNacemento: new FormControl(null, { validators: [ this.checkDuasDatasValidator() ] }),
        dataDefuncom: new FormControl(null, { validators: [ this.checkDuasDatasValidator() ] }),
        premios: new FormControl(null),
        web: new FormControl('', { validators: [Validators.maxLength(100)] }),
        comentario: new FormControl(null),
        idNacionalidade: new FormControl(null),
        nomeNacionalidade: new FormControl(null),
        idPais: new FormControl(null),
        nomePais: new FormControl(null),
        quantidade: new FormControl(null),
      });

  private idNacionalidadeSignal = toSignal(
    // startWith('') // Para que emita um valor inicial '' cando o usuario inda nom escreveu nada e for do combo itere o listado completo
    this.autorForm.controls.idNacionalidade.valueChanges.pipe(startWith(''))
  );
  private dadosNacionalidadesComboSignal = signal<SimpleObjet[]>([]);
  // Creamos un signal auxiliar para controlar cando se forza ver todo o listado
  private forzarListaCompletaNacionalidades = signal<boolean>(false);

  private idPaisSignal = toSignal(
    // startWith('') // Para que emita um valor inicial '' cando o usuario inda nom escreveu nada e for do combo itere o listado completo
    this.autorForm.controls.idPais.valueChanges.pipe(startWith(''))
  );
  private dadosPaisesComboSignal = signal<SimpleObjet[]>([]);
  // Creamos un signal auxiliar para controlar cando se forza ver todo o listado
  private forzarListaCompletaPaises = signal<boolean>(false);

  // O filtro é un Signal derivado ('computed'). Reexecútase só cando cambia o input ou o combo.
  dadosNacionalidadesFiltradas = computed(() => {
    const listaCompleta = this.dadosNacionalidadesComboSignal();    // se cambia este lanza o computed
    if (this.forzarListaCompletaNacionalidades()) {
      return this.filtroDeNacionalidades('');
    }
    const valorInput = this.idNacionalidadeSignal();                // se cambia este lanza o computed

    // Se o valor é un número (un ID), tamén queremos que por defecto amose todo o listado ao abrir
    if (typeof valorInput === 'number' || !isNaN(Number(valorInput))) {
      return this.filtroDeNacionalidades('');
    }
    return this.filtroDeNacionalidades(valorInput?.toString() || '');
  });

  // O filtro é un Signal derivado ('computed'). Reexecútase só cando cambia o input ou o combo.
  dadosPaisesFiltrados = computed(() => {
    const listaCompleta = this.dadosPaisesComboSignal();    // se cambia este lanza o computed
    if (this.forzarListaCompletaPaises()) {
      return this.filtroDePaises('');
    }
    const valorInput = this.idPaisSignal();                 // se cambia este lanza o computed

    // Se o valor é un número (un ID), tamén queremos que por defecto amose todo o listado ao abrir
    if (typeof valorInput === 'number' || !isNaN(Number(valorInput))) {
      return this.filtroDePaises('');
    }
    return this.filtroDePaises(valorInput?.toString() || '');
  });

  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private location: Location,
    private usuarioAppService: UsuarioAppService,
    private outrosService: OutrosService,
    private autoresService: AutoresService,
    private livrosService: LivrosService,
    private dadosPaginasService: DadosPaginasService) {
    }

  ngOnInit(): void {
    const state = history.state;
    if (state?.id) {
      if (state.id === '0')
        this.modo = EstadosPagina.engadir;
      else {
        this.modo = EstadosPagina.guardar;
        this.obterLivros(state.id);
      }
    }

    if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) {
      this.modo = EstadosPagina.soVisualizar;
    }

    this.estabelecerDisponibilidade();
    this.obterOutrosDados(state.id);
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
    const dados = <BaseListadoDadosApi<ListadoLivros>>data;
    if (dados != null) {
      resultados = dados.data;
    } else {
      resultados = [];
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados dos livros do autor'});
      console.debug('Nom se obtiverom dados dos livros do autor');
    }
    return resultados
  }

  private obterOutrosDados(idAutor: string): void {
    const dados = this.usuarioAppService.getDadosOutros();
    if (dados) {                                            // Já os tinhamos
      this.dadosNacionalidades = this.dadosNacionalidadesObtidas(dados.nacionalidades);
      this.dadosPaises = this.dadosPaisesObtidos(dados.paises);
      this.obterDadosDoAutor(idAutor);
    } else {
      this.obterNacionalidades(idAutor);
    }
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

      // Isto actualizará o Signal automaticamente
      this.dadosNacionalidadesComboSignal.set(dadosReducidos);

      return dados.data;
    }
    return [];
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

      // Isto actualizará o Signal automaticamente
      this.dadosPaisesComboSignal.set(dadosReducidos);

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

    return this.dadosNacionalidadesComboSignal().filter(option => option.value.toLowerCase().includes(filterValue));
  }

  /**
  * Filtra os valores do despregável.
  * @param value Filtro inserido polo usuario.
  */
  private filtroDePaises(value: string): SimpleObjet[] {
    const filterValue = value.toLowerCase();

    return this.dadosPaisesComboSignal().filter(option => option.value.toLowerCase().includes(filterValue));
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

  amosarNacionalidade = (id: number | null): string => {
    if (!id) return '';
    const nacionalidade = this.dadosNacionalidadesComboSignal().find(n => n.id === id);
    return nacionalidade ? nacionalidade.value : '';
  };

  amosarPais = (id: number | null): string => {
    if (!id) return '';
    const pais = this.dadosPaisesComboSignal().find(n => n.id === id);
    return pais ? pais.value : '';
  };

  private dadosAutorObtidos(data: object): Autor | undefined {
    let resultados: Autor | undefined;
    const dados = <AutorData<Autor>>data;
    if (dados.data != null && dados.data.length > 0) {
      resultados = dados.data[0];
      if (resultados) {
        this.autorForm.controls.nome.setValue(resultados.nome);
        this.autorForm.controls.nomeReal.setValue(resultados.nomeReal);
        this.autorForm.controls.lugarNacemento.setValue(resultados.lugarNacemento);

        const idNac = resultados.idNacionalidade;
        if (idNac) this.autorForm.controls.idNacionalidade.setValue(idNac);

        const idPais = resultados.idPais;
        if (idPais) this.autorForm.controls.idPais.setValue(idPais);

        const dN = new DateConvert().getDateFromMySQL(resultados?.dataNacemento);
        if (dN?.year > 0) {
          const dataModificada = new Date(dN.year, dN.month - 1, dN.day);
          this.autorForm.controls.dataNacemento.setValue(dataModificada);
        }

        const dD = new DateConvert().getDateFromMySQL(resultados?.dataDefuncom);
        if (dD?.year > 0) {
          const dataModificada = new Date(dD.year, dD.month - 1, dD.day);
          this.autorForm.controls.dataDefuncom.setValue(dataModificada);
        }

        this.autorForm.controls.web.setValue(resultados.web);
        this.autorForm.controls.comentario.setValue(resultados.comentario);
      }
    }
    else{
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados do autor'});
      resultados = undefined;
    }
    return resultados
  }

  private estabelecerDisponibilidade() {
    if (this.modo === EstadosPagina.soVisualizar) {
      this.autorForm.disable();
    } else {
      this.autorForm.enable();
    }
  }
  //#region

  onSubmit(event: any) {
    if (this.autorForm.controls.nome.status === 'VALID' && this.autorForm.controls.nomeReal.status === 'VALID'
      && this.autorForm.controls.lugarNacemento.status === 'VALID'
      && this.autorForm.controls.dataNacemento.status === 'VALID' && this.autorForm.controls.dataDefuncom.status === 'VALID'
      && this.autorForm.controls.premios.status === 'VALID' && this.autorForm.controls.web.status === 'VALID') {

      let autorRepetido: AutorData<Autor>;
      this.autoresService
        .getAutorPorNome(String(this.autorForm.controls.nome.value).trim())
        .pipe(first())
        .subscribe({
          next: (v: object) => autorRepetido = <AutorData<Autor>>v,
          error: (e: any) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do autor.'}); },
            complete: () => this.guardarAutor(event, autorRepetido)
      });
    }
  }

  guardarAutor(event: any, autorRepetido: AutorData<Autor>) {
    if (autorRepetido != undefined && autorRepetido.meta.quantidade > 0 && (
      (event.submitter.value === EstadosPagina.engadir)
      ||
      (event.submitter.value !== EstadosPagina.engadir && autorRepetido.meta.id != this.dadosDoAutor?.id))) { // se está actualizando os ids deben ser inguais
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'O nome do autor já existe na base de dados'});
    }
    else {

      let dateConvert = new DateConvert();
      let dN = dateConvert.getDate(this.autorForm.controls.dataNacemento.value);
      let dD = dateConvert.getDate(this.autorForm.controls.dataDefuncom.value);

      let nacom = this.dadosNacionalidadesComboSignal().find(option => option.id === this.autorForm.controls.idNacionalidade.value);
      let pais = this.dadosPaisesComboSignal().find(option => option.id === this.autorForm.controls.idPais.value);
      const autor: Autor = {
        id: Number(this.dadosDoAutor?.id),
        nome: String(this.autorForm.controls.nome.value).trim(),
        nomeReal: (this.autorForm.controls.nomeReal.value == null) ? null : String(this.autorForm.controls.nomeReal.value).trim(),
        lugarNacemento: (this.autorForm.controls.lugarNacemento.value == null) ? null : String(this.autorForm.controls.lugarNacemento.value).trim(),
        dataNacemento: (dN.year > 0) ? dN.year + '-' + dN.month + '-' + dN.day : '',
        dataDefuncom: (dD.year > 0) ? dD.year + '-' + dD.month + '-' + dD.day : '',
        idNacionalidade: (nacom != undefined) ? nacom.id : null,
        idPais: (pais != undefined) ? pais.id : null,
        premios: (this.autorForm.controls.premios.value == null) ? null : String(this.autorForm.controls.premios.value).trim(),
        web: (this.autorForm.controls.web.value == null) ? null : String(this.autorForm.controls.web.value).trim(),
        comentario: (this.autorForm.controls.comentario.value == null) ? null : String(this.autorForm.controls.comentario.value).trim(),
        nomeNacionalidade: '',
        nomePais: '',
        quantidade: 0
      };

      if (event.submitter.value === EstadosPagina.engadir) {
        this.autoresService
          .postAutor(autor)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, autor)},
            error: (e: any) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir o autor.'});
              console.error(e) },
              complete: () => {
                this.modo = EstadosPagina.guardar;
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
    const dados = <BaseListadoDadosApi<ListadoLivros>>data;
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

