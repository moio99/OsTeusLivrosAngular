import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { first } from 'rxjs';
import { ListadoAutores, ListadoAutoresData } from '../../../core/models/listado-autores.interface';
import { AutoresService } from '../../../core/services/api/autores.service';
import { OutrosService } from '../../../core/services/api/outros.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { InformacomPeTipo, ListadosAutoresTipos } from '../../../shared/enums/estadisticasTipos';
import { AutorComponent } from '../autor/autor.component';
import { CommonModule } from '@angular/common';
import { OrdeColunaComponent } from '../../../core/components/orde-coluna/orde-coluna.component';
import { Parametros } from '../../../core/models/autor.interface';
import { environment, environments } from '../../../../environments/environment';

@Component({
  selector: 'omla-listado-autores',
  standalone: true,
  imports: [ CommonModule, OrdeColunaComponent ],
  templateUrl: './listado-autores.component.html',
  styleUrls: ['./listado-autores.component.scss']
})
export class ListadoAutoresComponent implements OnInit {

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  nomeAlfabetico = ', alfabético';
  numeroLivros = ', número de livros';
  numeroLivrosLidos = ', número de livros lidos';
  filtroPaisOuNacionalidade = '';
  tipoOrdeacom = this.nomeAlfabetico;
  inverso = false;
  listadoDados: ListadoAutores[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private autoresService: AutoresService,
    private outrosService: OutrosService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        let parametros = <Parametros>params;
        if (parametros != undefined && parametros.id != undefined) {
          this.obterDadosDoListadoPorTipo(parametros);
        }
        else
          this.obterDadosDoListado();
      }
    );
  }

  private obterDadosDoListado(): void {
    this.autoresService
      .getListadoAutores()
      .pipe(first())
      .subscribe({
        next: (v: object) => this.listadoDados = this.dadosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do autor'}); },
          // complete: () => console.info('completado listado de autores')
    });
  }

  private obterDadosDoListadoPorTipo(parametros: Parametros): void {
    if (parametros.tipo == ListadosAutoresTipos.porNacionalidade)
    {
      this.outrosService
        .getNacionalidadeNome(parametros.id)
        .pipe(first())
        .subscribe({
          next: (v: object) => this.filtroPaisOuNacionalidade = ' ' + v,
          error: (e: any) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: `Nom se puiderom obter a nacionalidade ${parametros.id}`}); },
            complete: () => console.info(`completada obtençom da nacionalidade ${parametros.id}`)
      });
    }
    else {  // 2 Pais
      this.outrosService
        .getPaisNome(parametros.id)
        .pipe(first())
        .subscribe({
          next: (v: object) => this.filtroPaisOuNacionalidade = ' ' + v,
          error: (e: any) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: `Nom se puiderom obter o pais ${parametros.id}`}); },
            complete: () => console.info(`completada obtençom do pais ${parametros.id}`)
      });
    }
    this.autoresService
      .getListadoAutoresFiltrados(parametros.id, parametros.tipo)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.listadoDados = this.dadosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do autores'}); },
          // complete: () => console.info('completado listado de autores')
    });
  }

  private dadosObtidos(data: object): ListadoAutores[] {
    let resultados: ListadoAutores[];
    const dados = <ListadoAutoresData>data;
    if (dados != null) {
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Info, mensagem: dados.data.length + ' registros obtidos'});
      resultados = dados.data.sort((a,b) => new Ordeacom().ordear(a.nome, b.nome, this.inverso));
    } else {
      resultados = [];
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados'});
      console.debug('Nom se obtiverom dados');
    }
    return resultados
  }

  onBorrarElemento(id: number, nome: string, livros: number) {
    if (livros == 0) {
      if(confirm("Está certo de querer borrar o autor " + nome + "?")) {
        this.autoresService
              .borrarAutor(id)
              .pipe(first())
              .subscribe({
                next: (v: object) => console.debug(v),
                error: (e: any) => { console.error(e),
                  this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido borrara o autor.'}); },
                  complete: () => { // console.debug('Borrado feito'); this.obterDadosDoListado();
                  this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Livro borrado.'}); }
            });
      }
    }
    else {
      let pergunta = 'Nom se pode borrar o autor ' + nome + ' mentres tenha ' + livros;
      let singular = ' livro asociado';
      let plural = ' livros asociados';
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: pergunta});
      alert(pergunta + ((livros == 1) ? singular : plural));
    }
  }

  ordeAlfabetico() {
    this.inverso = (this.tipoOrdeacom == this.nomeAlfabetico) ? !this.inverso : false;
    this.tipoOrdeacom = this.nomeAlfabetico;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(a.nome, b.nome, this.inverso));
  }

  ordeNumeroLivros() {
    this.inverso = (this.tipoOrdeacom == this.numeroLivros) ? !this.inverso : false;
    this.tipoOrdeacom = this.numeroLivros;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(a.quantidadeLivros, b.quantidadeLivros, this.inverso, false));
  }

  ordeNumeroLivrosLidos() {
    this.inverso = (this.tipoOrdeacom == this.numeroLivrosLidos) ? !this.inverso : false;
    this.tipoOrdeacom = this.numeroLivrosLidos;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(a.quantidadeLidos, b.quantidadeLidos, this.inverso, false));
  }

  onIrPagina(rota: string, id: number): void{
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
