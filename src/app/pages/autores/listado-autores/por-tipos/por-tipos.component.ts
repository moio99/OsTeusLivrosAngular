import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { ListadoConcretoAutores, ListadoConcretoAutoresData } from '../../../../core/models/listado-autores.interface';
import { AutoresService } from '../../../../core/services/api/autores.service';
import { LayoutService } from '../../../../core/services/flow/layout.service';
import { ListadosAutoresTipos, InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';

@Component({
  selector: 'omla-por-tipos',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './por-tipos.component.html',
  styleUrls: ['./por-tipos.component.scss']
})
export class PorTiposComponent implements OnInit {

  tipos = ListadosAutoresTipos;
  tipo = ListadosAutoresTipos.porNacionalidade;
  listadoDados: ListadoConcretoAutores[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private autoresService: AutoresService) { }

  ngOnInit(): void {
    if (this.route.snapshot.url[0].path == 'porNacionalidade') {
      this.tipo = ListadosAutoresTipos.porNacionalidade;
      this.obterDadosDoListadoPorNacionalidade();
    }
    else {
      this.tipo = ListadosAutoresTipos.porPais;
      this.obterDadosDoListadoPorPais();
    }
  }

  private obterDadosDoListadoPorNacionalidade(): void {
    this.autoresService
      .getListadoAutoresPorNacons()
      .pipe(first())
      .subscribe({
        next: (v: object) => this.listadoDados = this.dadosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: 'Nom se puido obter o listado de autores por paises.'}); },
          // complete: () => console.info('completado listado de autores por paises')
    });
  }

  private obterDadosDoListadoPorPais(): void {
    this.autoresService
      .getListadoAutoresPorPaises()
      .pipe(first())
      .subscribe({
        next: (v: object) => this.listadoDados = this.dadosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: 'Nom se puido obter o listado de autores por naçons.'}); },
          // complete: () => console.info('completado listado de autores por naçons')
    });
  }

  private dadosObtidos(data: object): ListadoConcretoAutores[] {
    let resultados: ListadoConcretoAutores[];
    const dados = <ListadoConcretoAutoresData>data;
    if (dados != null) {
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Info, mensagem: dados.data.length + ' registros obtidos'});
      resultados = dados.data;
    } else {
      resultados = [];
      console.debug('Nom se obtiverom dados');
    }
    return resultados
  }

  onIrPagina(rota: string, id: number): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.router.navigate(['../../' + rota], {relativeTo: this.route,
      queryParams: {id: id, tipo: this.tipo}});
  }
}
