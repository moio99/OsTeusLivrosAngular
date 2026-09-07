import { Component, inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Biblioteca, ListadoBibliotecas } from '@interfaces';
import { BibliotecasService } from '@servizosApi';
import { CommonModule } from '@angular/common';
import { BibliotecaComponent } from '../biblioteca/biblioteca.component';
import { environment, environments } from '../../../../environments/environment';
import { BaseListadoComponent } from '@componhentesComuns';
import { Observable } from 'rxjs';
import { BaseListadoDadosApi } from '../../../shared/models/base-dados';

@Component({
  selector: 'omla-listado-bibliotecas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-bibliotecas.component.html',
  styleUrls: ['./listado-bibliotecas.component.scss']
})
export class ListadoBibliotecasComponent extends BaseListadoComponent<ListadoBibliotecas> {

  protected nomePlural = 'as bibliotecas';

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;

  private bibliotecasService = inject(BibliotecasService);

  // Indicamos a chamada correspondente (TypeScript infire o tipo correctamente)
  protected definirChamadaApi(): Observable<BaseListadoDadosApi<Biblioteca>> {
    return this.bibliotecasService.getListadoCosLivros();
  }

  // Pasamos a funçom para guardar na caché sen erros de tipos
  protected guardarNaCache(dados: BaseListadoDadosApi<Biblioteca>): void {
    this.bibliotecasService.setListadoCosLivros(dados);
  }

  onBorrar(id: string, nome: string, quantidadeLivros: number) {
    this.onBorrarElemento(
      id,
      quantidadeLivros,
      nome,
      'a biblioteca',
      'Biblioteca borrada correctamente',
      (id) => this.bibliotecasService.borrar(id)
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
