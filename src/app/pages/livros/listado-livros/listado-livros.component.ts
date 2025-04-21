import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { first, map, tap } from 'rxjs/operators';
import { GenerosService } from '../../../core/services/api/generos.service';
import { LivrosService } from '../../../core/services/api/livros.service';
import { OutrosService } from '../../../core/services/api/outros.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { EstadisticasTipo, InformacomPeTipo, ListadosLivrosTipos } from '../../../shared/enums/estadisticasTipos';
import { CommonModule } from '@angular/common';
import { OrdeColunaComponent } from '../../../core/components/orde-coluna/orde-coluna.component';
import { ListadoLivros, ListadoLivrosData, Parametros } from '../../../core/models/listado-livros.interface';
import { LivroComponent } from '../livro/livro.component';
import {
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";
import { TartaChartOptions } from '../../../core/types/chart.options';
import { CoresIdiomasService } from '../../../core/services/flow/cores-idiomas.sevice';
import { CoresIdioma } from '../../../shared/cores.idiomas.config';
import { environment, environments } from '../../../../environments/environment';

@Component({
  selector: 'omla-listado-livros',
  standalone: true,
  imports: [ CommonModule, OrdeColunaComponent, NgApexchartsModule ],
  templateUrl: './listado-livros.component.html',
  styleUrls: ['./listado-livros.component.scss']
})
export class ListadoLivrosComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<TartaChartOptions>;

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  titulo = '';
  tituloListado = 'Listado';
  ordeTituloAlfabetico = ', título alfabético';
  ordeAutorAlfabetico = ', autor alfabético';
  ordePaginas = ', páginas';
  ordeRelecturas = ', relecturas';
  tituloUltimaLectura = ', última lectura';
  tipoOrdeacom = this.ordeTituloAlfabetico;
  inverso = false;
  listadoDados: ListadoLivros[] = [];
  tipo = ListadosLivrosTipos.alfabetico;
  tipos = ListadosLivrosTipos;
  parametros: Parametros = { tipo: EstadisticasTipo.Ano, id: '0' };
  coresIdiomas: { [key: string]: CoresIdioma } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private livrosService: LivrosService,
    private coresIdiomasService: CoresIdiomasService,
    private generosService: GenerosService,
    private outrosService: OutrosService,
    private dadosPaginasService: DadosPaginasService) {
      this.chartOptions = {
        series: [],
        colors: [],
        chart: {
          width: 380,
          type: "pie"
        },
        labels: [],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };
    }

  ngOnInit(): void {
    this.coresIdiomas = this.coresIdiomasService.getCoresIdiomas();
    this.route.queryParams
      .subscribe(params => {
        this.parametros = <Parametros>params;
        this.obterDadosDoListado();
      }
    );
  }

  private obterDadosDoListado(): void {
    if (this.parametros.tipo) {
      switch (+this.parametros.tipo) {
        case EstadisticasTipo.Idioma:
          this.titulo = this.tituloListado + ' polo idioma ';
          this.livrosService
            .getListadoLivrosPorIdioma(this.parametros.id)
            .pipe(first())
            .subscribe({
              next: (v: object) => this.listadoDados = this.dadosObtidos(v),
              error: (e: any) => { console.error(e),
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
                  mensagem: 'Nom se puiderom obter os livros polo idioma ' + this.parametros.id}); },
            //complete: () => console.info('completado listado de livros por Idioma')
          });
          this.outrosService.getIdiomaNome(this.parametros.id)
            .pipe(first())
            .subscribe({
              next: (v: object) => this.titulo += v,
              error: (e: any) => { console.error(e) },
            //complete: () => console.info('completado listado de livros por Idioma')
            });
          break;
        case EstadisticasTipo.Ano:
          this.titulo = this.tituloListado + ' polo ano ' + this.parametros.id;
          this.livrosService
            .getListadoLivrosPorAno(this.parametros.id)
            .pipe(first())
            .subscribe({
              next: (v: object) => this.listadoDados = this.dadosObtidos(v, true),
              error: (e: any) => { console.error(e),
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
                  mensagem: 'Nom se puiderom obter os livros polo ano ' + this.parametros.id}); },
            //complete: () => console.info('completado listado de livros por Ano')
          });
          break;
        case EstadisticasTipo.Genero:
          this.titulo = this.tituloListado + ' polo género ';
          this.livrosService
            .getListadoLivrosPorGenero(this.parametros.id)
            .pipe(first())
            .subscribe({
              next: (v: object) => this.listadoDados = this.dadosObtidos(v, true),
              error: (e: any) => { console.error(e),
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
                  mensagem: 'Nom se puiderom obter os livros polo género ' + this.parametros.id}); },
            //complete: () => console.info('completado listado de livros por Genero')
          });
          this.generosService.getGeneroNome(this.parametros.id)
            .pipe(first())
            .subscribe({
              next: (v: object) => this.titulo += v,
              error: (e: any) => { console.error(e) },
            //complete: () => console.info('completado listado de livros por Genero')
            });
          break;
        default:
          this.listadoPorDefectoAlfabetico();
          break;
      }
    }
    else {
      this.listadoPorDefectoAlfabetico();
    }
  }

  listadoPorDefectoAlfabetico() {
    this.titulo = this.tituloListado;
    this.livrosService
      .getListadoLivros()
      .pipe(
        first(),
        tap((v) => {
          // console.log(v)
        }),
        /* map((v) => {
          const dados = <ListadoLivrosData>v;
          return dados.data;
        }) */
      )
      .subscribe({
        next: (v: object) => this.listadoDados = this.dadosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os livros.'}); },
      //complete: () => console.info('completado listado de livros')
    });
  }

  private dadosObtidos(data: object, amosarGrafico?: boolean): ListadoLivros[] {
    let resultados: ListadoLivros[];
    const dados = <ListadoLivrosData>data;
    if (dados != null) {
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Info, mensagem: dados.data.length + ' registros obtidossss'});
      resultados = dados.data.sort((a,b) => new Ordeacom().ordear(
        a.titulo.replace(/[¿?¡!]/g,''), b.titulo.replace(/[¿?¡!]/g,'').replace('¡',''), this.inverso));
      if (amosarGrafico) {
        this.separarDadosGrafico(resultados);
      }
    } else {
      resultados = [];
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados.'});
      console.debug('Nom se obtiverom dados');
    }
    return resultados
  }


  private separarDadosGrafico(dados: ListadoLivros[]) {
    let paginasPorIdioma: { [key: number]: number } = {};   // Dados agrupados por idioma
    let totalIdiomasIds: number[] = [];

    dados.forEach(dado => {
      if (!paginasPorIdioma[dado.idioma]) {   // Se nom existe a matriz a vou criar
        paginasPorIdioma[dado.idioma] = 0;
      }
      paginasPorIdioma[dado.idioma] += dado.paginas

      if (!totalIdiomasIds.includes(dado.idioma)) {
        totalIdiomasIds.push(dado.idioma);
      }
    });

    let totalPaginasPorIdioma: number[] = [];
    let labelsIdiomas: string[] = [];                       // Etiquetas para amosar no gráfico ejo das x
    let cores: string[] = [];                               // cores para amosar
    totalIdiomasIds.forEach(idioma => {
      totalPaginasPorIdioma.push(paginasPorIdioma[idioma]);
      labelsIdiomas.push(this.coresIdiomas[idioma].nome);
      cores.push(this.coresIdiomas[idioma].cor);
    });

    this.chartOptions.series = totalPaginasPorIdioma;
    this.chartOptions.labels = labelsIdiomas;
    this.chartOptions.colors = cores;
  }

  setOrdeTituloAlfabetico() {
    this.inverso = (this.tipoOrdeacom == this.ordeTituloAlfabetico) ? !this.inverso : false;
    this.tipoOrdeacom = this.ordeTituloAlfabetico;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(
      a.titulo.replace(/[¿?¡!]/g,''), b.titulo.replace(/[¿?¡!]/g,''), this.inverso));
  }

  setOrdeAutorAlfabetico() {
    this.inverso = (this.tipoOrdeacom == this.ordeAutorAlfabetico) ? !this.inverso : false;
    this.tipoOrdeacom = this.ordeAutorAlfabetico;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(a.nomeAutor, b.nomeAutor, this.inverso));
  }

  setOrdePaginas() {
    this.inverso = (this.tipoOrdeacom == this.ordePaginas) ? !this.inverso : false;
    this.tipoOrdeacom = this.ordePaginas;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(a.paginas, b.paginas, this.inverso, false));
  }

  setOrdeRelecturas() {
    this.inverso = (this.tipoOrdeacom == this.ordeRelecturas) ? !this.inverso : false;
    this.tipoOrdeacom = this.ordeRelecturas;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(a.quantidadeRelecturas, b.quantidadeRelecturas, this.inverso, false));
  }

  setOrdeUltmaLectura() {
    this.inverso = (this.tipoOrdeacom == this.tituloUltimaLectura) ? !this.inverso : false;
    this.tipoOrdeacom = this.tituloUltimaLectura;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(a.dataFimLeitura, b.dataFimLeitura, this.inverso, false));
  }

  onIrPagina(rota: string, id: string, idRelectura: string = '0'): void{
    this.layoutService.amosarInfo(undefined);
    if (rota === 'livros/livro') {
      this.dadosPaginasService.setDadosPagina({id: id, nomePagina: 'livro', elemento: undefined});
      this.router.navigateByUrl(rota + '?id=' + id + '&idRelectura=' + idRelectura);
    } else {
      // A autores navegase co state
      this.router.navigate([rota], {
        state: { id: id, idRelectura: 'algo mais de probas' },
      });
    }
  }

  onBorrarElemento(id: string, nome: string, livrosSerie: number, relecturas: number) {
    if (livrosSerie == undefined || livrosSerie == 0) {
      if (relecturas == undefined || relecturas == 0) {
        if(confirm("Está certo de querer borrar o livro " + nome + "?")) {
          this.livrosService
                .borrarLivro(id)
                .pipe(first())
                .subscribe({
                  next: (v: object) => console.debug(v),
                  error: (e: any) => { console.error(e),
                    this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido borrara o livro.'}); },
                  complete: () => { // console.debug('Borrado feito'); this.obterDadosDoListado();
                    this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Livro borrado.'}); }
              });
        }
      }
      else {
        let aviso = 'Nom se pode borrar o livro ' + nome + ' mentres tenha relecturas asociadas ' + relecturas;
        this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: aviso});
        alert(aviso);
      }
    }
    else {
      let aviso = 'Nom se pode borrar o livro ' + nome + ' mentres seja o primeiro dumha serie de ' + livrosSerie + ' livros';
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: aviso});
      alert(aviso);
    }
  }
}

export const childRoutes: Routes = [
  {
    path: '',
    component: ListadoLivrosComponent,
  },
  {
    path: 'livro',
    component: LivroComponent
  }
];
