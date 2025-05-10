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
import { environment, environments } from '../../../../environments/environment';
import { BaseListadoComponent } from '../../../core/components/base/listado/base-listado.component';

@Component({
  selector: 'omla-listado-estilos-literarios',
  standalone: true,
  imports: [CommonModule, OrdeColunaComponent],
  templateUrl: './listado-estilos-literarios.component.html',
  styleUrls: ['./listado-estilos-literarios.component.scss']
})
export class ListadoEstilosLiterariosComponent extends BaseListadoComponent<ListadoEstilosLiterarios> implements OnInit {

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  numeroLivros = ', número de livros';
  numeroLivrosLidos = ', número de livros lidos';
  tipoOrdeacom = '';
  inverso = false;
  tipoListado = '';
  override listadoDados: ListadoEstilosLiterarios[] = [];

  constructor(
    private router: Router,
    private estilosLiterariosService: EstilosLiterariosService,
    layoutService: LayoutService) {
      super(layoutService);
    }

  ngOnInit(): void {
    super.obterDadosDoListado('os estilos literarios',
      this.estilosLiterariosService.getListadoCosLivros(),
      this.estilosLiterariosService.setListadoCosLivros.bind(this.estilosLiterariosService));
  }

  onBorrar(id: string, nome: string, quantidadeLivros: number) {
    this.onBorrarElemento(
      id,
      quantidadeLivros,
      nome,
      'o Estilo Literario',
      'Estilo Literario borrado correctamente',
      (id) => this.estilosLiterariosService.borrar(id)
    );
  }

  trackById(index: number, item: any): number {
    return item.id;
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
