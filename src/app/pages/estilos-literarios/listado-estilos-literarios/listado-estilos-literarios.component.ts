import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { first } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { OrdeColunaComponent } from '../../../core/components/orde-coluna/orde-coluna.component';
import { EstiloLiterarioComponent } from '../estilo-literario/estilo-literario.component';
import { EstilosLiterariosService } from '../../../core/services/api/estilos-literarios.service';
import { ListadoEstilosLiterarios, ListadoEstilosLiterariosData } from '../../../core/models/listado-estilos-literarios.interface';

@Component({
  selector: 'omla-listado-estilos-literarios',
  standalone: true,
  imports: [CommonModule, OrdeColunaComponent],
  templateUrl: './listado-estilos-literarios.component.html',
  styleUrls: ['./listado-estilos-literarios.component.scss']
})
export class ListadoEstilosLiterariosComponent implements OnInit {

  numeroLivros = ', número de livros';
  numeroLivrosLidos = ', número de livros lidos';
  tipoOrdeacom = '';
  inverso = false;
  tipoListado = '';
  listadoDados: ListadoEstilosLiterarios[] = [];

  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private estilosLiterariosService: EstilosLiterariosService) { }

  ngOnInit(): void {
    this.obterDadosDoListado();
  }

  private obterDadosDoListado(): void {
    this.estilosLiterariosService
      .getListadoEstilosLiterariosCosLivros()
      .pipe(first())
      .subscribe({
        next: (v: object) => this.listadoDados = this.dadosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os géneros.'}); },
          // complete: () => console.info('completado listado de estilosLiterarios')
    });
  }

  private dadosObtidos(data: object): ListadoEstilosLiterarios[] {
    let resultados: ListadoEstilosLiterarios[];
    const dados = <ListadoEstilosLiterariosData>data;
    if (dados != null) {
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Info, mensagem: dados.estilosLiterarios.length + ' registros obtidos'});
      resultados = dados.estilosLiterarios;
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
        this.estilosLiterariosService
              .borrarEstiloLiterario(id)
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
      let pergunta = 'Nom se pode borrar o Estilo Literario ' + nome + ' mentres tenha ' + livros;
      let singular = ' livro asociado';
      let plural = ' livros asociados';
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: pergunta + ((livros == 1) ? singular : plural)});
      alert(pergunta + ((livros == 1) ? singular : plural));
    }
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
    component: ListadoEstilosLiterariosComponent,
  },
  {
    path: 'estilo-literario',
    component: EstiloLiterarioComponent
  }
];
