import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { first, map } from 'rxjs';
import { ListadoAutores, ParametrosAutor, BaseListadoDadosApi } from '@interfaces';
import { AutoresService, OutrosService } from '@servizosApi';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { InformacomPeTipo, ListadosAutoresTipos } from '../../../shared/enums/estadisticasTipos';
import { AutorComponent } from '../autor/autor.component';
import { CommonModule } from '@angular/common';
import { OrdeColunaComponent, BaseListadoComponent } from '@componhentesComuns';
import { environment, environments } from '../../../../environments/environment';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'omla-listado-autores',
  standalone: true,
  imports: [ CommonModule, OrdeColunaComponent, RouterModule ],
  templateUrl: './listado-autores.component.html',
  styleUrls: ['./listado-autores.component.scss']
})
export class ListadoAutoresComponent extends BaseListadoComponent<ListadoAutores> {

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  nomeAlfabetico = ', alfabético';
  numeroLivros = ', número de livros';
  numeroLivrosLidos = ', número de livros lidos';
  filtroPaisOuNacionalidade = signal<string>('');
  tipoOrdeacom = signal<string>(this.nomeAlfabetico);
  inverso = signal<boolean>(false);
  override listadoDados = signal<ListadoAutores[]>([]);

  private outrosService = inject(OutrosService);
  private autoresService = inject(AutoresService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  parametrosBusqueda = toSignal(
    this.route.queryParams.pipe(
      map(params => (params && Object.keys(params).length > 0 ? (params as ParametrosAutor) : null))
    ),
    { initialValue: null } // Valor inicial mentres a URL non emita nada
  );

  // EFECTO: Encárgase ÚNICAMENTE de actualizar o título cando cambian os parámetros
  // Angular xestiona este ciclo de vida sen romper a pureza do recurso
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

  // RECURSO: Limpo e centrado só en traer a listaxe de autores
  autoresResource = rxResource({
    params: () => this.parametrosBusqueda(),
    stream: ({ params }) => {
      // Se hai parámetros válidos, filtramos
      if (params && params.id !== undefined) {
        return this.autoresService.getListadoAutoresFiltrados(params.id, params.tipo).pipe(
          map(v => this.dadosObtidosListado(v))
        );
      }

      // Se non, listado completo
      return this.autoresService.getListadoAutores().pipe(
        map(v => this.dadosObtidosListado(v))
      );
    }
  });

  constructor() {
    super();

    effect(() => {
      if (this.autoresResource.hasValue()) {
        if (this.autoresResource.value().length === 0) {
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados.'
          });
        }
        this.layoutService.amosarInfo({
          tipo: InformacomPeTipo.Info, mensagem: this.autoresResource.value().length + ' registros obtidos'
        });
      }
    });
  }

  private dadosObtidosListado(data: object): ListadoAutores[] {
    let resultados: ListadoAutores[];
    const dados = <BaseListadoDadosApi<ListadoAutores>>data;
    if (dados != null) {
      this.autoresService.setListadoAutores(dados);
      resultados = dados.data.sort((a,b) => new Ordeacom().ordear(a.nome, b.nome, this.inverso()));
    } else {
      resultados = [];
      console.debug('Nom se obtiverom dados');
    }
    return resultados
  }

  onBorrar(id: string, nome: string, quantidadeLivros: number) {
    this.onBorrarElemento(
      id,
      quantidadeLivros,
      nome,
      'o autor',
      'Autor borrado correctamente',
      (id) => this.autoresService.borrarAutor(+id),
      () => this.autoresResource.reload()     // para que relance o stream e actualice o listado
    );
  }

  ordeAlfabetico() {
    this.inverso.update((v) => (this.tipoOrdeacom() === this.nomeAlfabetico) ? !v : false);
    this.tipoOrdeacom.set(this.nomeAlfabetico);

    this.listadoDados.update(dados =>
      [...dados].sort((a, b) => new Ordeacom().ordear(a.nome, b.nome, this.inverso()))
    );
  }

  ordeNumeroLivros() {
    this.inverso.update((v) => (this.tipoOrdeacom() === this.numeroLivros) ? !v : false);
    this.tipoOrdeacom.set(this.numeroLivros);

    this.listadoDados.update(dados =>
      [...dados].sort((a, b) => new Ordeacom().ordear(a.quantidadeLivros, b.quantidadeLivros, this.inverso(), false))
    );
  }

  ordeNumeroLivrosLidos() {
    this.inverso.update((v) => (this.tipoOrdeacom() === this.numeroLivrosLidos) ? !v : false);
    this.tipoOrdeacom.set(this.numeroLivrosLidos);

    this.listadoDados.update(dados =>
      [...dados].sort((a, b) => new Ordeacom().ordear(a.quantidadeLidos, b.quantidadeLidos, this.inverso(), false))
    );
  }

  onIrPagina(rota: string, id: string): void{
    this.layoutService.amosarInfo(undefined);
    //this.router.navigateByUrl(rota + '?id=' + id);  // Ponho o de abaixo para probar outro jeito de enviar os parámetros
    this.router.navigate([rota], {
      state: { id: id, idRelectura: 'algo mais de probas' },
    });
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
