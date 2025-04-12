import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { first } from 'rxjs';
import { ColecomComponent } from '../colecom/colecom.component';
import { CommonModule } from '@angular/common';
import { OrdeColunaComponent } from '../../../core/components/orde-coluna/orde-coluna.component';
import { ListadoColecons, ListadoColeconsData } from '../../../core/models/listado-colecons.interface';
import { ColeconsService } from '../../../core/services/api/colecons.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';

@Component({
  selector: 'omla-listado-colecons',
  standalone: true,
  imports: [CommonModule, OrdeColunaComponent],
  templateUrl: './listado-colecons.component.html',
  styleUrls: ['./listado-colecons.component.scss']
})
export class ListadoColeconsComponent implements OnInit {
  tipoListado = '';
  listadoDados: ListadoColecons[] = [];

  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private coleconsService: ColeconsService) { }

  ngOnInit(): void {
    this.obterDadosDoListado();
  }

  private obterDadosDoListado(): void {
    this.coleconsService
      .getListadoColeconsCosLivros()
      .pipe(first())
      .subscribe({
        next: (v: object) => this.listadoDados = this.dadosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter as coleçons.'}); },
          // complete: () => console.info('completado listado de coleçons')
    });
  }

  private dadosObtidos(data: object): ListadoColecons[] {
    let resultados: ListadoColecons[];
    const dados = <ListadoColeconsData>data;
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
    if (livros == 0) {
      if(confirm("Está certo de querer borrar a colecom " + nome + "?")) {
        this.coleconsService
              .borrarColecom(id)
              .pipe(first())
              .subscribe({
                next: (v: object) => console.debug(v),
                error: (e: any) => { console.error(e),
                  this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido borrara a coleçom.'}); },
                  complete: () => { // console.debug('Borrado feito'); this.obterDadosDoListado();
                  this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Coleçom borrada.'}); }
            });
      }
    }
    else {
      let pergunta = 'Nom se pode borrar a colecom ' + nome + ' mentres tenha ' + livros;
      let singular = ' livro asociado.';
      let plural = ' livros asociados.';
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: pergunta + ((livros == 1) ? singular : plural)});
      alert(pergunta + ((livros == 1) ? singular : plural));
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
    component: ListadoColeconsComponent,
  },
  {
    path: 'colecom',
    component: ColecomComponent
  }
];
