import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { Autor, AutorData, ListadoLivros, BaseListadoDadosApi } from '@interfaces';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { AutoresService, LivrosService, OutrosService } from '@servizosApi';
import { LayoutService, DadosPaginasService, UsuarioAppService } from '@servizosFlow';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { Nacionalidade, SimpleObjet, Pais, DadosObtidos } from '../../../shared/models/outros.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { environment, environments } from '../../../../environments/environment';
import { AutorFormPresenterComponent } from './autor-form-presenter.component';
import { AutorLivrosComponent } from './autor-livros.component';
import { AutorFormStateService } from './autor-form-state.service';

@Component({
  selector: 'omla-autor',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule,
    MatNativeDateModule, MatAutocompleteModule, AutorFormPresenterComponent, AutorLivrosComponent ],
  templateUrl: './autor.component.html',
  styleUrls: ['./autor.component.scss'],
  providers: [AutorFormStateService]
})
export class AutorComponent implements OnInit {

  estadosPagina = EstadosPagina;
  modo = signal<EstadosPagina>(EstadosPagina.soVisualizar);
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
  dadosLivrosDoAutor = signal<ListadoLivros[]>([]);
  dadosNacionalidades: Nacionalidade[] = [];
  dadosPaises: Pais[] = [];
  date = new Date();

  private router = inject(Router);
  private location = inject(Location);
  private layoutService = inject(LayoutService);
  private usuarioAppService = inject(UsuarioAppService);
  private outrosService = inject(OutrosService);
  private autoresService = inject(AutoresService);
  private livrosService = inject(LivrosService);
  private dadosPaginasService = inject(DadosPaginasService);

  private readonly formState = inject(AutorFormStateService);
  autorForm = this.formState.autorForm;
  dadosNacionalidadesFiltradas = this.formState.dadosNacionalidadesFiltradas;
  dadosPaisesFiltrados = this.formState.dadosPaisesFiltrados;
  amosarNacionalidade = this.formState.amosarNacionalidade;
  amosarPais = this.formState.amosarPais;

  ngOnInit(): void {
    const state = history.state;
    if (state?.id) {
      if (state.id === '0')
        this.modo.set(EstadosPagina.engadir);
      else {
        this.modo.set(EstadosPagina.guardar);
        this.obterLivros(state.id);
      }
    }

    if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) {
      this.modo.set(EstadosPagina.soVisualizar);
    }

    this.estabelecerDisponibilidade();
    this.obterOutrosDados(state.id);
  }

  //#region Obtençom de dados
  private obterLivros(id: string): void {
    this.livrosService
      .getLivrosPorAutor(id)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosLivrosDoAutor.set(this.dadosLivrosObtidos(v)),
        error: (e: unknown) => { console.error(e),
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
        error: (e: unknown) => { console.error(e),
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
        this.formState.setNacionalidades(dadosReducidos);

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
        error: (e: unknown) => { console.error(e),
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
        this.formState.setPaises(dadosReducidos);

      return dados.data;
    }
    else return [];
  }

  private obterDadosDoAutor(id: string): void {
    if (id !== '0') {
      this.autoresService
        .getAutor(id)
        .pipe(first())
        .subscribe({
          next: (v: object) => this.dadosDoAutor = this.dadosAutorObtidos(v),
          error: (e: unknown) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do autor'}); },
            complete: () => console.debug('completada a obtençom dos dados do autor')
      });
    }
  }

  private dadosAutorObtidos(data: object): Autor | undefined {
    let resultados: Autor | undefined;
    const dados = <AutorData<Autor>>data;
    if (dados.data != null && dados.data.length > 0) {
      resultados = dados.data[0];
      if (resultados) {
        this.formState.atualizarFromAutor(resultados);
      }
    }
    else{
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados do autor'});
      resultados = undefined;
    }
    return resultados
  }

  private estabelecerDisponibilidade() {
    if (this.modo() === EstadosPagina.soVisualizar) {
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

      let autorRepetido: AutorData<Autor> | undefined;
      this.autoresService
        .getAutorPorNome(String(this.autorForm.controls.nome.value).trim())
        .pipe(first())
        .subscribe({
          next: (v) => autorRepetido = v,
          error: (e: unknown) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do autor.'}); },
          complete: () => this.guardarAutor(event, autorRepetido)
      });
    }
  }

  guardarAutor(event: any, autorRepetido: AutorData<Autor> | undefined) {
    if (autorRepetido != undefined && autorRepetido.meta.quantidade > 0 && (
      (event.submitter.value === EstadosPagina.engadir)
      ||
      (event.submitter.value !== EstadosPagina.engadir && autorRepetido.meta.id != this.dadosDoAutor?.id))) { // se está actualizando os ids deben ser inguais
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'O nome do autor já existe na base de dados'});
    }
    else {

      const autor = this.formState.criarObjetoAutor(this.dadosDoAutor?.id);

      if (event.submitter.value === EstadosPagina.engadir) {
        this.autoresService
          .postAutor(autor)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, autor)},
            error: (e: unknown) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir o autor.'});
              console.error(e) },
              complete: () => {
                this.modo.set(EstadosPagina.guardar);
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
            error: (e: unknown) => {
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

