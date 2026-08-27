import { Component, inject, signal } from '@angular/core';
import { Routes } from '@angular/router';
import { ColecomComponent } from '../colecom/colecom.component';
import { CommonModule } from '@angular/common';
import { BaseListadoDadosApi, Colecom, ListadoColecons } from '@interfaces';
import { ColeconsService } from '@servizosApi';
import { BaseListadoComponent } from '@componhentesComuns';
import { Observable } from 'rxjs';
import { environment, environments } from '../../../../environments/environment';

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

  // Indicamos a chamada correspondente (TypeScript infire o tipo correctamente)
  protected definirChamadaApi(): Observable<BaseListadoDadosApi<Colecom>> {
    return this.coleconsService.getListadoCosLivros();
  }

  // Pasamos a funçom para guardar na caché sen erros de tipos
  protected guardarNaCache(dados: BaseListadoDadosApi<Colecom>): void {
    this.coleconsService.setListadoCosLivros(dados);
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
