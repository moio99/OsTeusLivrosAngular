import { Component, inject, signal } from '@angular/core';
import { Routes } from '@angular/router';
import { Biblioteca, ListadoBibliotecas } from '@interfaces';
import { BibliotecasService } from '@servizosApi';
import { CommonModule } from '@angular/common';
import { BibliotecaComponent } from '../biblioteca/biblioteca.component';
import { environment, environments } from '../../../../environments/environment';
import { BaseListadoComponent } from '@componhentesComuns';
import { Observable } from 'rxjs';
import { BaseListadoDadosApi } from '../../../shared/models/base-dados';
import { DadosComplentarios } from '../../../shared/enums/estadisticasTipos';
import { DadosOutrosService } from '../../../core/services/flow/dados-outros.service';

@Component({
  selector: 'omla-listado-bibliotecas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-bibliotecas.component.html',
  styleUrls: ['./listado-bibliotecas.component.scss']
})
export class ListadoBibliotecasComponent extends BaseListadoComponent<ListadoBibliotecas> {

  protected nomePlural = 'as bibliotecas';

  // Obligatorio, no listado de autores sim que se usa, se for undefined en vez de null nom se chama a búsqueda no rxResource
  protected parametrosBusqueda = signal<any>(null);

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;

  private bibliotecasService = inject(BibliotecasService);
  private dadosOutrosService = inject(DadosOutrosService);

  // Indicamos a chamada correspondente (TypeScript infire o tipo correctamente)
  protected definirChamadaApi(): Observable<BaseListadoDadosApi<Biblioteca>> {
    return this.bibliotecasService.getListadoCosLivros();
  }

  onBorrar(id: string, nome: string, quantidadeLivros: number) {
    this.onBorrarElemento(
      id,
      quantidadeLivros,
      nome,
      'a biblioteca',
      'Biblioteca borrada correctamente',
      (id) => this.bibliotecasService.borrar(id),
      (id) => this.dadosOutrosService.removerElementoDadosOutrosCache(id, DadosComplentarios.Biblioteca)
    );
  }
}

export const childRoutes: Routes = [
  {
    path: '',
    component: ListadoBibliotecasComponent,
  },
  {
    path: 'biblioteca',
    component: BibliotecaComponent
  }
];
