import { Component, inject, signal } from '@angular/core';
import { Routes } from '@angular/router';
import { GeneroComponent } from '../genero/genero.component';
import { CommonModule } from '@angular/common';
import { Genero, ListadoGeneros } from '@interfaces';
import { GenerosService } from '@servizosApi';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { OrdeColunaComponent, BaseListadoComponent } from '@componhentesComuns';
import { Observable } from 'rxjs';
import { environment, environments } from '../../../../environments/environment';
import { BaseListadoDadosApi } from '../../../shared/models/base-dados';
import { DadosComplentarios } from '../../../shared/enums/estadisticasTipos';
import { DadosOutrosService } from '../../../core/services/flow/dados-outros.service';

@Component({
  selector: 'omla-listado-generos',
  standalone: true,
  imports: [CommonModule, OrdeColunaComponent],
  templateUrl: './listado-generos.component.html',
  styleUrls: ['./listado-generos.component.scss']
})
export class ListadoGenerosComponent extends BaseListadoComponent<ListadoGeneros> {

  protected nomePlural = 'as editoriais';

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  nomeAlfabetico = ', alfabético';
  numeroLivros = ', número de livros';
  numeroLivrosLidos = ', número de livros lidos';
  tipoOrdeacom = signal<string>(this.nomeAlfabetico);
  inverso = false;
  tipoListado = '';

  private generosService = inject(GenerosService);
  private dadosOutrosService = inject(DadosOutrosService);

  // Indicamos a chamada correspondente (TypeScript infire o tipo correctamente)
  protected definirChamadaApi(): Observable<BaseListadoDadosApi<Genero>> {
    return this.generosService.getListadoCosLivros();
  }

  onBorrar(id: string, nome: string, quantidadeLivros: number) {
    this.onBorrarElemento(
      id,
      quantidadeLivros,
      nome,
      'o género',
      'Género borrada correctamente',
      (id) => this.generosService.borrar(id),
      (id) => this.dadosOutrosService.removerElementoDadosOutrosCache(id, DadosComplentarios.Genero)
    );
  }

  ordeAlfabetico() {
    this.inverso = (this.tipoOrdeacom() === this.nomeAlfabetico) ? !this.inverso : false;
    this.tipoOrdeacom.set(this.nomeAlfabetico);

    // Actualizamos o valor interno do recurso modificando o array 'data'
    this.listadoResource.value.update(respostaApi => {
      if (!respostaApi) return respostaApi;

      return {
        ...respostaApi,
        data: [...respostaApi.data].sort((a, b) =>
          new Ordeacom().ordear(a.nome, b.nome, this.inverso)
        )
      };
    });
  }

  ordeNumeroLivros() {
    this.inverso = (this.tipoOrdeacom() === this.numeroLivros) ? !this.inverso : false;
    this.tipoOrdeacom.set(this.numeroLivros);

    // Actualizamos o valor interno do recurso modificando o array 'data'
    this.listadoResource.value.update(respostaApi => {
      if (!respostaApi) return respostaApi;

      return {
        ...respostaApi,
        data: [...respostaApi.data].sort((a, b) =>
          new Ordeacom().ordear(a.quantidadeLivros, b.quantidadeLivros, this.inverso, false)
        )
      };
    });
  }

  ordeNumeroLivrosLidos() {
    this.inverso = (this.tipoOrdeacom() === this.numeroLivrosLidos) ? !this.inverso : false;
    this.tipoOrdeacom.set(this.numeroLivrosLidos);

    // Actualizamos o valor interno do recurso modificando o array 'data'
    this.listadoResource.value.update(respostaApi => {
      if (!respostaApi) return respostaApi;

      return {
        ...respostaApi,
        data: [...respostaApi.data].sort((a, b) =>
          new Ordeacom().ordear(a.quantidadeLidos, b.quantidadeLidos, this.inverso, false)
        )
      };
    });
  }
}

export const childRoutes: Routes = [
  {
    path: '',
    component: ListadoGenerosComponent,
  },
  {
    path: 'genero',
    component: GeneroComponent
  }
];
