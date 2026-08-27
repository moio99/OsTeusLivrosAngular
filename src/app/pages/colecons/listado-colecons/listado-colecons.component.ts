import { Component, inject, OnInit, signal } from '@angular/core';
import { Routes } from '@angular/router';
import { ColecomComponent } from '../colecom/colecom.component';
import { CommonModule } from '@angular/common';
import { ListadoColecons } from '@interfaces';
import { ColeconsService } from '@servizosApi';
import { environment, environments } from '../../../../environments/environment';
import { BaseListadoComponent } from '@componhentesComuns';

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

  private coleconsService = inject(ColeconsService);

  ngOnInit(): void {
    super.obterDadosDoListado(
    // super.obterDadosDoListado<Colecom>(  // nom ponhoo o tipado <Colecom> porque typescript o infire do que
    // retorna this.coleconsService.getListadoCosLivros(),
      'as coleçons',
      this.coleconsService.getListadoCosLivros(),
      // this.coleconsService.setListadoCosLivros.bind(this.coleconsService)
      (datos) => this.coleconsService.setListadoCosLivros(datos) // <-- Alternativa a .bind() para que nom perdta o contexto (this)
    );
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
