import { Component, OnInit, signal } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { ColecomComponent } from '../colecom/colecom.component';
import { CommonModule } from '@angular/common';
import { ListadoColecons } from '../../../core/models/listado-colecons.interface';
import { ColeconsService } from '../../../core/services/api/colecons.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { environment, environments } from '../../../../environments/environment';
import { BaseListadoComponent } from '../../../core/components/base/listado/base-listado.component';

@Component({
  selector: 'omla-listado-colecons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-colecons.component.html',
  styleUrls: ['./listado-colecons.component.scss']
})
export class ListadoColeconsComponent extends BaseListadoComponent<ListadoColecons> implements OnInit {

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  override listadoDados = signal<ListadoColecons[]>([]);

  constructor(
    private router: Router,
    private coleconsService: ColeconsService,
    layoutService: LayoutService) {
      super(layoutService);
    }

  ngOnInit(): void {
    super.obterDadosDoListado('as coleçons',
      this.coleconsService.getListadoCosLivros(),
      this.coleconsService.setListadoCosLivros.bind(this.coleconsService));
  }

  onBorrar(id: string, nome: string, quantidadeLivros: number) {
    this.onBorrarElemento(
      id,
      quantidadeLivros,
      nome,
      'a coleçom',
      'Coleçom borrada correctamente',
      (id) => this.coleconsService.borrar(id)
    );
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
