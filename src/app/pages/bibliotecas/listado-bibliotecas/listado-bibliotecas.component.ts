import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { first } from 'rxjs';
import { ListadoBibliotecas, ListadoBibliotecasData } from '../../../core/models/listado-bibliotecas.interface';
import { BibliotecasService } from '../../../core/services/api/bibliotecas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { CommonModule } from '@angular/common';
import { BibliotecaComponent } from '../biblioteca/biblioteca.component';

@Component({
  selector: 'omla-listado-bibliotecas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-bibliotecas.component.html',
  styleUrls: ['./listado-bibliotecas.component.scss']
})
export class ListadoBibliotecasComponent implements OnInit {
  tipoListado = '';
  listadoDados: ListadoBibliotecas[] = [];

  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private bibliotecasService: BibliotecasService) { }

  ngOnInit(): void {
    this.obterDadosDoListado();
  }

  private obterDadosDoListado(): void {
    this.bibliotecasService
      .getListadoBibliotecasCosLivros()
      .pipe(first())
      .subscribe({
        next: (v) => this.listadoDados = this.dadosObtidos(v),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter as biblioteca.'}); },
          // complete: () => console.info('completado listado de bibliotecas')
    });
  }

  private dadosObtidos(data: object): ListadoBibliotecas[] {
    let resultados: ListadoBibliotecas[];
    const dados = <ListadoBibliotecasData>data;
    if (dados != null) {
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Info, mensagem: dados.data.length + ' registros obtidos'});
      resultados = dados.data;
    } else {
      resultados = [];
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados.'});
      console.debug('Nom se obtiverom dados');
    }
    return resultados
  }

  onBorrarElemento(id: string, nome: string, livros: number) {
    if (livros === 0) {
      if(confirm("Está certo de querer borrar a biblioteca " + nome + "?")) {
        this.bibliotecasService
              .borrarBiblioteca(id)
              .pipe(first())
              .subscribe({
                next: (v) => console.debug(v),
                error: (e) => { console.error(e),
                  this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido borrara a biblioteca.'}); },
                  complete: () => { // console.debug('Borrado feito'); this.obterDadosDoListado();
                  this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Biblioteca borrada.'}); }
            });
      }
    }
    else {
      let pergunta = 'Nom se pode borrar a biblioteca ' + nome + ' mentres tenha ' + livros;
      let singular = ' livro asociado';
      let plural = ' livros asociados';
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: pergunta + ((livros === 1) ? singular : plural)});
      alert(pergunta + ((livros === 1) ? singular : plural));
    }
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
    component: ListadoBibliotecasComponent,
  },
  {
    path: 'biblioteca',
    component: BibliotecaComponent
  }
];
