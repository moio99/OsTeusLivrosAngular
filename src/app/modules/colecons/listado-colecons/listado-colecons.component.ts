import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { ColeconsService } from 'src/app/core/services/api/colecons.service';
import { LayoutService } from 'src/app/core/services/flow/layout.service';
import { InformacomPeTipo } from 'src/app/shared/enums/estadisticasTipos';
import { ListadoColecons, ListadoColeconsData } from './listado-colecons.interface';

@Component({
  selector: 'omla-listado-colecons',
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
        next: (v) => this.listadoDados = this.dadosObtidos(v),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter as coleçons.'}); },
        complete: () => console.info('completado listado de coleçons')
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

  onBorrarElemento(id: number, nome: string, livros: number) {
    if (livros == 0) {
      if(confirm("Está certo de querer borrar a colecom " + nome + "?")) {
        this.coleconsService
              .borrarColecom(id)
              .pipe(first())
              .subscribe({
                next: (v) => console.debug(v),
                error: (e) => { console.error(e),
                  this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido borrara a coleçom.'}); },
                complete: () => { console.debug('Borrado feito'); this.obterDadosDoListado();
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

  onIrPagina(rota: string, id: number): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }
}
