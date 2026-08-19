import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, first, forkJoin, switchMap } from 'rxjs';
import { Autor, AutorData, ListadoLivros, BaseListadoDadosApi, BaseQuantidadesLivros } from '@interfaces';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { AutoresService, LivrosService, OutrosService } from '@servizosApi';
import { LayoutService, DadosPaginasService, UsuarioAppService } from '@servizosFlow';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { Nacionalidade, SimpleObjet, Pais } from '../../../shared/models/outros.model';
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
        next: (v) => this.dadosLivrosDoAutor.set(this.dadosLivrosObtidos(v)),
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
    if (dados) {                                            // Já os tínhamos
      this.dadosNacionalidades = this.procesarDadosGerais<Nacionalidade>(dados.nacionalidades, (datos) =>
          this.formState.setNacionalidades(datos)
      );
        this.dadosPaises = this.procesarDadosGerais<Pais>(dados.paises, (datos) =>
          this.formState.setPaises(datos)
      );
      this.obterDadosDoAutor(idAutor);
    } else {
      this.iniciarCargaDatos(idAutor);
    }
  }

  private iniciarCargaDatos(idAutor: string): void {
    // Lánzanse as dúas peticións en paralelo
    forkJoin({
      nacionalidades: this.outrosService.getNacionalidades().pipe(first()),
      paises: this.outrosService.getPaises().pipe(first())
    }).subscribe({
      next: ({ nacionalidades, paises }) => {
        // Procesamos as nacionalidades
        this.dadosNacionalidades = this.procesarDadosGerais(nacionalidades, (datos) =>
          this.formState.setNacionalidades(datos)
        );

        // Procesamos os países
        this.dadosPaises = this.procesarDadosGerais(paises, (datos) =>
          this.formState.setPaises(datos)
        );
      },
      error: (e: unknown) => {
        console.error(e);
        this.layoutService.amosarInfo({
          tipo: InformacomPeTipo.Erro,
          mensagem: 'Nom se puiderom obter os dados de soporte (nacionalidades/países).'
        });
      },
      complete: () => {
        // Cando ambas rematan con éxito, cargamos o autor
        this.obterDadosDoAutor(idAutor);
      }
    });
  }

  private procesarDadosGerais<T extends Nacionalidade | Pais>(
    data: object,
    actualizarSignal: (dados: SimpleObjet[]) => void
  ): T[] {
    const dados = data as { data: T[] };

    if (!dados || !dados.data || dados.data.length === 0) {
      return [];
    }

    // Mapeado moderno con .map() en lugar de forEach + push
    const dadosReducidos: SimpleObjet[] = dados.data.map(value => ({
      id: value.id,
      value: value.nome
    }));

    // Actualiza o Signal correspondente no formState
    actualizarSignal(dadosReducidos);

    return dados.data;
  }

  private obterDadosDoAutor(id: string): void {
    if (id !== '0') {
      this.autoresService
        .getAutor(id)
        .pipe(first())
        .subscribe({
          next: (v) => this.dadosDoAutor = this.dadosAutorObtidos(v),
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

  onSubmit(event: SubmitEvent) {
    if (this.autorForm.invalid) {
      return;
    }

    const botonPremido = (event.submitter as HTMLButtonElement)?.value;
    const nomeFormulario = String(this.autorForm.controls.nome.value).trim();

    this.autoresService.getAutorPorNome(nomeFormulario).pipe(
      first(),
      switchMap((autorRepetido) => {
        // Validar se o autor xa existe antes de gardar
        if (autorRepetido && autorRepetido.meta.quantidade > 0) {

          if (botonPremido === EstadosPagina.engadir || autorRepetido.meta.id !== this.dadosDoAutor?.id) {
            this.layoutService.amosarInfo({
              tipo: InformacomPeTipo.Aviso,
              mensagem: 'O nome do autor já existe na base de dados'
            });
            return EMPTY; // Cancela o fluxo se o autor está repetido
          }
        }

        // Se todo está ben, creamos o obxecto e devolvemos o Observable correcto
        const autor = this.formState.criarObjetoAutor(this.dadosDoAutor?.id);

        if (botonPremido === EstadosPagina.engadir) {
          return this.autoresService.postAutor(autor).pipe(
            first(),
            switchMap((v) => {
              this.gestionarRetroceso(v, autor);
              this.modo.set(EstadosPagina.guardar);
              this.layoutService.amosarInfo({ tipo: InformacomPeTipo.Sucesso, mensagem: 'Autor engadido.' });
              return EMPTY;
            })
          );
        } else {
          return this.autoresService.putAutor(autor).pipe(
            first(),
            switchMap((v) => {
              this.gestionarRetroceso(v, autor);
              this.layoutService.amosarInfo({ tipo: InformacomPeTipo.Sucesso, mensagem: 'Autor guardado.' });
              return EMPTY;
            })
          );
        }
      })
    ).subscribe({
      error: (e: unknown) => {
        console.error(e);
        this.layoutService.amosarInfo({
          tipo: InformacomPeTipo.Erro,
          mensagem: botonPremido === EstadosPagina.engadir ? 'Houbo un erro ao engadir o autor.' : 'Houbo un erro ao guardar o autor.'
        });
      }
    });
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

