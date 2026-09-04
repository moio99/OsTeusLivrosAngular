import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { first, map, Observable } from 'rxjs';
import { ListadoAutores, ParametrosAutor } from '@interfaces';
import { AutoresService, OutrosService } from '@servizosApi';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { InformacomPeTipo, ListadosAutoresTipos } from '../../../shared/enums/estadisticasTipos';
import { AutorComponent } from '../autor/autor.component';
import { CommonModule } from '@angular/common';
import { OrdeColunaComponent, BaseListadoComponent } from '@componhentesComuns';
import { environment, environments } from '../../../../environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { BaseListadoDadosApi } from '../../../shared/models/base-dados';

@Component({
  selector: 'omla-listado-autores',
  standalone: true,
  imports: [ CommonModule, OrdeColunaComponent, RouterModule ],
  templateUrl: './listado-autores.component.html',
  styleUrls: ['./listado-autores.component.scss']
})
export class ListadoAutoresComponent extends BaseListadoComponent<ListadoAutores> {

  protected nomePlural = 'os autores';
  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  nomeAlfabetico = ', alfabético';
  numeroLivros = ', número de livros';
  numeroLivrosLidos = ', número de livros lidos';
  filtroPaisOuNacionalidade = signal<string>('');
  tipoOrdeacom = signal<string>(this.nomeAlfabetico);
  inverso = signal<boolean>(false);

  private outrosService = inject(OutrosService);
  private autoresService = inject(AutoresService);
  private route = inject(ActivatedRoute);

  parametrosBusqueda = toSignal(
    this.route.queryParams.pipe(
      map(params => (params && Object.keys(params).length > 0 ? (params as ParametrosAutor) : null))
    ),
    { initialValue: null } // Valor inicial mentres a URL non emita nada
  );

  tipoListadoTitulo = computed(() => {
    const params = this.parametrosBusqueda();
    if (!params) return '';

    return Number(params.tipo) === ListadosAutoresTipos.porNacionalidade
      ? 'por nacionalidade' : 'por país';
  });

  listadoDadosOrdenados = computed(() => {
    // Cada vez que o recurso mude (cheguen datos da API ou cambio o criterio de ordenaçom), o computed execútase
    const respostaApi = this.listadoResource.value();
    if (!respostaApi?.data) return [];

    if (this.tipoOrdeacom() === this.nomeAlfabetico) {
      return [...respostaApi.data].sort((a, b) =>
        new Ordeacom().ordear(a.nome, b.nome, this.inverso())
      );
    } else if (this.tipoOrdeacom() === this.numeroLivros) {
      return [...respostaApi.data].sort((a, b) =>
        new Ordeacom().ordear(a.quantidadeLivros, b.quantidadeLivros, this.inverso(), false)
      );
    } else // if (this.tipoOrdeacom() === this.numeroLivrosLidos) {
      return [...respostaApi.data].sort((a, b) =>
        new Ordeacom().ordear(a.quantidadeLidos, b.quantidadeLidos, this.inverso(), false)
      );
    }
  );

  // EFECTO: Encárgase ÚNICAMENTE de actualizar o título cando cambian os parámetros
  // Angular xestiona este ciclo de vida sen romper a pureza do recurso
  // Poderia mete-lo no constructor e funcionaria igual
  trackTituloEffect = effect(() => {
    const parametros = this.parametrosBusqueda();

    // Se non hai parámetros ou non teñen ID, limpamos o filtro ou non facemos nada
    if (!parametros || parametros.id === undefined) return;

    const { id, tipo } = parametros;
    const porNacionalidade = Number(tipo) === ListadosAutoresTipos.porNacionalidade;

    const obterNome$ = porNacionalidade
      ? this.outrosService.getNacionalidadeNome(id)
      : this.outrosService.getPaisNome(id);

    const mensaxeErroNome = porNacionalidade
      ? `Nom se puiderom obter a nacionalidade ${id}`
      : `Nom se puiderom obter o pais ${id}`;

    obterNome$.pipe(first()).subscribe({
      next: (nome) => this.filtroPaisOuNacionalidade.set(` ${nome}`),
      error: (e) => {
        console.error(e);
        this.layoutService.amosarInfo({ tipo: InformacomPeTipo.Erro, mensagem: mensaxeErroNome });
      }
    });
  });

  constructor() {
    super();

    effect(() => {
      if (this.listadoResource.hasValue()) {
        if (this.listadoDados().length === 0) {
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados.'
          });
        } else {
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Info, mensagem: this.listadoDados()?.length + ' registros obtidos'
          });
        }
      }
    });
  }

  // Indicamos a chamada correspondente (TypeScript infire o tipo correctamente)
  protected definirChamadaApi(): Observable<BaseListadoDadosApi<ListadoAutores>> {

    const parametros = this.parametrosBusqueda();

    // Se há parámetros válidos, filtro
    if (parametros && parametros.id !== undefined) {
      return this.autoresService.getListadoAutoresFiltrados(parametros.id, parametros.tipo);
    }

    return this.autoresService.getListadoAutores();
  }

  // Pasamos a funçom para guardar na caché sen erros de tipos
  protected guardarNaCache(dados: BaseListadoDadosApi<ListadoAutores>): void {
    this.autoresService.setListadoAutores(dados);
  }

  onBorrar(id: string, nome: string, quantidadeLivros: number) {
    this.onBorrarElemento(
      id,
      quantidadeLivros,
      nome,
      'o autor',
      'Autor borrado correctamente',
      (id) => this.autoresService.borrarAutor(+id)
    );
  }

  ordeAlfabetico() {
    this.inverso.update((v) => (this.tipoOrdeacom() === this.nomeAlfabetico) ? !v : false);
    this.tipoOrdeacom.set(this.nomeAlfabetico);
  }

  ordeNumeroLivros() {
    this.inverso.update((v) => (this.tipoOrdeacom() === this.numeroLivros) ? !v : false);
    this.tipoOrdeacom.set(this.numeroLivros);
  }

  ordeNumeroLivrosLidos() {
    this.inverso.update((v) => (this.tipoOrdeacom() === this.numeroLivrosLidos) ? !v : false);
    this.tipoOrdeacom.set(this.numeroLivrosLidos);
  }
}

export const childRoutes: Routes = [
  {
    path: '',
    component: ListadoAutoresComponent,
  },
  {
    path: 'autor',
    component: AutorComponent
  }
];
