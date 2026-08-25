import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ListadoConcretoAutores, ListadoConcretoAutoresData } from '@interfaces';
import { AutoresService } from '@servizosApi';
import { LayoutService } from '@servizosFlow';
import { ListadosAutoresTipos, InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'omla-por-tipos',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './por-tipos.component.html',
  styleUrls: ['./por-tipos.component.scss']
})
export class PorTiposComponent implements OnInit {

  tipos = ListadosAutoresTipos;
  tipo = signal<ListadosAutoresTipos | undefined>(undefined);

  private layoutService = inject(LayoutService);
  private autoresService = inject(AutoresService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  listadoDados = rxResource({
    params: () => this.tipo(),
    stream: ({ params }) => {

      if (params && params === ListadosAutoresTipos.porNacionalidade) {
        return this.autoresService.getListadoAutoresPorNacons().pipe(
          map(v => this.dadosObtidos(v, true)),
          catchError((erro) => {
            return this.gestomErro(erro, 'naçons');
          })
        );
      }

      return this.autoresService.getListadoAutoresPorPaises().pipe(
        map(v => this.dadosObtidos(v, true)),
        catchError((erro) => {
          return this.gestomErro(erro, 'paises');
        })
      );
    }
  });


  ngOnInit(): void {
    if (this.route.snapshot.url[1].path == 'porPais') {
      this.tipo.set(ListadosAutoresTipos.porPais);
    }
    else {
      this.tipo.set(ListadosAutoresTipos.porNacionalidade);
    }
  }

  private dadosObtidos(data: object, porNacons: boolean): ListadoConcretoAutores[] {
    let resultados: ListadoConcretoAutores[];
    const dados = <ListadoConcretoAutoresData>data;
    if (dados != null) {
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Info, mensagem: dados.data.length + ' registros obtidos'});
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

  private gestomErro(erro: unknown, palabraMensagem: string): ListadoConcretoAutores[] {
    console.error(erro);
    this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
      mensagem: `Nom se puido obter o listado de autores por ${palabraMensagem}.`});
    // Retorno un array baleiro para que a app non rompa
    return [];
  }

  onIrPagina(rota: string, id: number): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    // this.router.navigate(['../../' + rota], {relativeTo: this.route,
    //   queryParams: {id: id, tipo: this.tipo()}});
    this.router.navigate([`../../${rota}`], {relativeTo: this.route,
      queryParams: {id: id, tipo: this.tipo()}});
  }
}
