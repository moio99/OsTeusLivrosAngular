import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { first } from 'rxjs';
import { GeneroComponent } from '../genero/genero.component';
import { CommonModule } from '@angular/common';
import { ListadoGeneros, ListadoGenerosData } from '../../../core/models/listado-generos.interface';
import { GenerosService } from '../../../core/services/api/generos.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { OrdeColunaComponent } from '../../../core/components/orde-coluna/orde-coluna.component';
import { environment, environments } from '../../../../environments/environment';

@Component({
  selector: 'omla-listado-generos',
  standalone: true,
  imports: [CommonModule, OrdeColunaComponent],
  templateUrl: './listado-generos.component.html',
  styleUrls: ['./listado-generos.component.scss']
})
export class ListadoGenerosComponent implements OnInit {

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  nomeAlfabetico = ', alfabético';
  numeroLivros = ', número de livros';
  numeroLivrosLidos = ', número de livros lidos';
  tipoOrdeacom = this.nomeAlfabetico;
  inverso = false;
  tipoListado = '';
  listadoDados: ListadoGeneros[] = [];

  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private generosService: GenerosService) { }

  ngOnInit(): void {
    this.obterDadosDoListado();
  }

  private obterDadosDoListado(): void {
    this.generosService
      .getListadoGenerosCosLivros()
      .pipe(first())
      .subscribe({
        next: (v: object) => this.listadoDados = this.dadosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os géneros.'}); },
          // complete: () => console.info('completado listado de generos')
    });
  }

  private dadosObtidos(data: object): ListadoGeneros[] {
    let resultados: ListadoGeneros[];
    const dados = <ListadoGenerosData>data;
    if (dados != null) {
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Info, mensagem: dados.data.length + ' registros obtidos'});
      resultados = dados.data.sort((a,b) => new Ordeacom().ordear(a.nome, b.nome, this.inverso));
    } else {
      resultados = [];
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados.'});
      console.debug('Nom se obtiverom dados');
    }
    return resultados
  }

  onBorrarElemento(id: string, nome: string, livros: number) {
    if (livros == 0) {
      if(confirm("Está certo de querer borrar o género " + nome + "?")) {
        this.generosService
              .borrarGenero(id)
              .pipe(first())
              .subscribe({
                next: (v: object) => console.debug(v),
                error: (e: any) => { console.error(e),
                  this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido borrara o género.'}); },
                  complete: () => { // console.debug('Borrado feito'); this.obterDadosDoListado();
                  this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Género borrado.'}); }
            });
      }
    }
    else {
      let pergunta = 'Nom se pode borrar o genero ' + nome + ' mentres tenha ' + livros;
      let singular = ' livro asociado';
      let plural = ' livros asociados';
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: pergunta + ((livros == 1) ? singular : plural)});
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

  onIrPagina(rota: string, id: string): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }
}

export const childRoutes: Routes = [
  {
    path: '',
    component: ListadoGenerosComponent,
  },
  {
    path: 'genero',
    component: GeneroComponent
  }
];
