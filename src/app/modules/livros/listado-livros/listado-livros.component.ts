import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { GenerosService } from 'src/app/core/services/api/generos.service';
import { LivrosService } from 'src/app/core/services/api/livros.service';
import { OutrosService } from 'src/app/core/services/api/outros.service';
import { DadosPaginasService } from 'src/app/core/services/flow/dados-paginas.service';
import { LayoutService } from 'src/app/core/services/flow/layout.service';
import { Ordeacom } from 'src/app/shared/classes/ordeacom';
import { EstadisticasTipo, InformacomPeTipo, ListadosLivrosTipos } from 'src/app/shared/enums/estadisticasTipos';
import { ListadoLivros, ListadoLivrosData, Parametros } from './listado-livros.interface';

@Component({
  selector: 'omla-listado-livros',
  templateUrl: './listado-livros.component.html',
  styleUrls: ['./listado-livros.component.scss']
})
export class ListadoLivrosComponent implements OnInit {

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
  parametros: Parametros = { tipo: EstadisticasTipo.Ano, id: 0 };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private livrosService: LivrosService,
    private generosService: GenerosService,
    private outrosService: OutrosService,
    private dadosPaginas: DadosPaginasService) { }

  ngOnInit(): void {
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
              next: (v) => this.listadoDados = this.dadosObtidos(v),
              error: (e) => { console.error(e),
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
                  mensagem: 'Nom se puiderom obter os livros polo idioma ' + this.parametros.id}); },
              complete: () => console.info('completado listado de livros por Idioma')
          });
          this.outrosService.getIdiomaNome(this.parametros.id)
            .pipe(first())
            .subscribe({
              next: (v) => this.titulo += v,
              error: (e) => { console.error(e) },
              complete: () => console.info('completado listado de livros por Idioma')
            });
          break;
        case EstadisticasTipo.Ano:
          this.titulo = this.tituloListado + ' polo ano ' + this.parametros.id;
          this.livrosService
            .getListadoLivrosPorAno(this.parametros.id)
            .pipe(first())
            .subscribe({
              next: (v) => this.listadoDados = this.dadosObtidos(v),
              error: (e) => { console.error(e),
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
                  mensagem: 'Nom se puiderom obter os livros polo ano ' + this.parametros.id}); },
              complete: () => console.info('completado listado de livros por Ano')
          });
          break;
        case EstadisticasTipo.Genero:
          this.titulo = this.tituloListado + ' polo género ';
          this.livrosService
            .getListadoLivrosPorGenero(this.parametros.id)
            .pipe(first())
            .subscribe({
              next: (v) => this.listadoDados = this.dadosObtidos(v),
              error: (e) => { console.error(e),
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
                  mensagem: 'Nom se puiderom obter os livros polo género ' + this.parametros.id}); },
              complete: () => console.info('completado listado de livros por Genero')
          });
          this.generosService.getGeneroNome(this.parametros.id)
            .pipe(first())
            .subscribe({
              next: (v) => this.titulo += v,
              error: (e) => { console.error(e) },
              complete: () => console.info('completado listado de livros por Genero')
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
      .pipe(first())
      .subscribe({
        next: (v) => this.listadoDados = this.dadosObtidos(v),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os livros.'}); },
        complete: () => console.info('completado listado de livros')
    });
  }

  private dadosObtidos(data: object): ListadoLivros[] {
    let resultados: ListadoLivros[];
    const dados = <ListadoLivrosData>data;
    if (dados != null) {
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Info, mensagem: dados.data.length + ' registros obtidos'});
      resultados = dados.data.sort((a,b) => new Ordeacom().ordear(a.titulo, b.titulo, this.inverso));
    } else {
      resultados = [];
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados.'});
      console.debug('Nom se obtiverom dados');
    }
    return resultados
  }

  setOrdeTituloAlfabetico() {
    this.inverso = (this.tipoOrdeacom == this.ordeTituloAlfabetico) ? !this.inverso : false;
    this.tipoOrdeacom = this.ordeTituloAlfabetico;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(a.titulo, b.titulo, this.inverso));
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

  onIrPagina(rota: string, id: number): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    //let livro = this.dadosPaginas.getDadosPagina(id, 'livro');
    if (rota === '/livro') {
      // borro por se engadira um novo elemento (autor, genero...) pero nom guardou o livro.
      //this.dadosPaginas.setDadosPagina({id: 0, nomePagina: 'livro', elemento: undefined});
      this.dadosPaginas.setDadosPagina({id: id, nomePagina: 'livro', elemento: undefined});
    }
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }

  onBorrarElemento(id: number, nome: string, livrosSerie: number, relecturas: number) {
    if (livrosSerie == undefined || livrosSerie == 0) {
      if (relecturas == undefined || relecturas == 0) {
        if(confirm("Está certo de querer borrar o livro " + nome + "?")) {
          this.livrosService
                .borrarLivro(id)
                .pipe(first())
                .subscribe({
                  next: (v) => console.debug(v),
                  error: (e) => { console.error(e),
                    this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido borrara o livro.'}); },
                  complete: () => { console.debug('Borrado feito'); this.obterDadosDoListado();
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
