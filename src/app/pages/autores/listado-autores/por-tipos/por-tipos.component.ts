import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ListadoConcretoAutores, ListadoConcretoAutoresData } from '@interfaces';
import { AutoresService } from '@servizosApi';
import { LayoutService } from '@servizosFlow';
import { ListadosAutoresTipos, InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'omla-por-tipos',
  standalone: true,
  imports: [ CommonModule, TranslocoPipe ],
  templateUrl: './por-tipos.component.html',
  styleUrls: ['./por-tipos.component.scss']
})
export class PorTiposComponent {

  tipos = ListadosAutoresTipos;

  private layoutService = inject(LayoutService);
  private autoresService = inject(AutoresService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  tipo = signal<ListadosAutoresTipos | undefined>(
    this.route.snapshot.url[1].path === 'porPais' ? ListadosAutoresTipos.porPais : ListadosAutoresTipos.porNacionalidade
  );

  listadoResource = rxResource({
    params: () => this.tipo(),
    stream: ({ params }) => {

      if (params && params === ListadosAutoresTipos.porNacionalidade) {
        return this.autoresService.getListadoAutoresPorNacons().pipe(
          map(v => this.dadosObtidos(v, true)),
          catchError((erro) => {
            return this.gestomErro(erro);
          })
        );
      }

      return this.autoresService.getListadoAutoresPorPaises().pipe(
        map(v => this.dadosObtidos(v, false)),
        catchError((erro) => {
          return this.gestomErro(erro);
        })
      );
    }
  });

  constructor() {
    effect(() => {
      if (this.listadoResource.hasValue()) {
        this.layoutService.amosarInfo({
          tipo: InformacomPeTipo.Info,
          mensagem: this.translocoService.translate('common.recordsLoaded', { count: this.listadoResource.value().length })
        });
      }
    });
  }

  onIrPagina(rota: string, id: number): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    // this.router.navigate(['../../' + rota], {relativeTo: this.route,
    //   queryParams: {id: id, tipo: this.tipo()}});
    this.router.navigate([`../../${rota}`], {relativeTo: this.route,
      queryParams: {id: id, tipo: this.tipo()}});
  }

  private dadosObtidos(data: object, porNacons: boolean): ListadoConcretoAutores[] {
    let resultados: ListadoConcretoAutores[];
    const dados = <ListadoConcretoAutoresData>data;
    if (dados != null) {
      if (porNacons)
        this.autoresService.setListadoAutoresPorNacons(dados);
      else
        this.autoresService.setListadoAutoresPorPaises(dados);
      resultados = dados.data;
    } else {
      resultados = [];
      console.debug('Nom se obtiverom dados');
    }
    return resultados
  }

  private gestomErro(erro: unknown) {
    console.error(erro);
    this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
      mensagem: this.translocoService.translate('common.loadError')});
    // Retorno un array baleiro para que a app non rompa
    return of([]);
  }
}
