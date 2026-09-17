import { Component, inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ColecomComponent } from '../colecom/colecom.component';
import { CommonModule } from '@angular/common';
import { Colecom, ListadoColecons } from '@interfaces';
import { ColeconsService } from '@servizosApi';
import { BaseListadoComponent } from '@componhentesComuns';
import { Observable } from 'rxjs';
import { environment, environments } from '../../../../environments/environment';
import { BaseListadoDadosApi } from '../../../shared/models/base-dados';
import { DadosComplentarios } from '../../../shared/enums/estadisticasTipos';
import { DadosOutrosService } from '../../../core/services/flow/dados-outros.service';

@Component({
  selector: 'omla-listado-colecons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-colecons.component.html',
  styleUrls: ['./listado-colecons.component.scss']
})
export class ListadoColeconsComponent extends BaseListadoComponent<ListadoColecons> {

  protected nomePlural = 'as coleçons';

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;

  private coleconsService = inject(ColeconsService);
  private dadosOutrosService = inject(DadosOutrosService);

  // Para que BaseListadoComponent saiba de onde obter os dados
  // Indicamos a chamada correspondente (TypeScript infire o tipo correctamente)
  protected definirChamadaApi(): Observable<BaseListadoDadosApi<Colecom>> {
    return this.coleconsService.getListadoCosLivros();
  }

  onBorrar(id: string, nome: string, quantidadeLivros: number) {
    this.onBorrarElemento(
      id,
      quantidadeLivros,
      nome,
      'a coleçom',
      'Coleçom borrada correctamente',
      (id) => this.coleconsService.borrar(id),
      (id) => this.dadosOutrosService.removerElementoDadosOutrosCache(id, DadosComplentarios.Colecom)
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
