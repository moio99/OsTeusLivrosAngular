import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Routes } from '@angular/router';
import { OrdeColunaComponent, BaseListadoComponent } from '@componhentesComuns';
import { Editorial, ListadoEditoriais } from '@interfaces';
import { EditoriaisService } from '@servizosApi';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { EditorialComponent } from '../editorial/editorial.component';
import { Observable } from 'rxjs';
import { environment, environments } from '../../../../environments/environment';
import { BaseListadoDadosApi } from '../../../shared/models/base-dados';
import { DadosComplentarios } from '../../../shared/enums/estadisticasTipos';
import { DadosOutrosService } from '../../../core/services/flow/dados-outros.service';

@Component({
  selector: 'omla-listado-editoriais',
  standalone: true,
  imports: [CommonModule, OrdeColunaComponent],
  templateUrl: './listado-editoriais.component.html',
  styleUrls: ['./listado-editoriais.component.scss']
})
export class ListadoEditoriaisComponent extends BaseListadoComponent<ListadoEditoriais> {

  protected nomePlural = 'as editoriais';

  // Obligatorio, no listado de autores sim que se usa, se for undefined en vez de null nom se chama a búsqueda no rxResource
  protected parametrosBusqueda = signal<any>(null);

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  nomeAlfabetico = ', alfabético';
  numeroLivros = ', número de livros';
  tipoOrdeacom = this.nomeAlfabetico;
  inverso = false;
  tipoListado = '';

  private editoriaisService = inject(EditoriaisService);
  private dadosOutrosService = inject(DadosOutrosService);

  // Indicamos a chamada correspondente (TypeScript infire o tipo correctamente)
  protected definirChamadaApi(): Observable<BaseListadoDadosApi<Editorial>> {
    return this.editoriaisService.getListadoCosLivros();
  }

  onBorrar(id: string, nome: string, quantidadeLivros: number) {
    this.onBorrarElemento(
      id,
      quantidadeLivros,
      nome,
      'a editorial',
      'Editorial borrada correctamente',
      (id) => this.editoriaisService.borrar(id),
      (id) => this.dadosOutrosService.removerElementoDadosOutrosCache(id, DadosComplentarios.Editorial)
    );
  }

  ordeAlfabetico() {
    this.inverso = (this.tipoOrdeacom == this.nomeAlfabetico) ? !this.inverso : false;
    this.tipoOrdeacom = this.nomeAlfabetico;

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
    this.inverso = (this.tipoOrdeacom == this.numeroLivros) ? !this.inverso : false;
    this.tipoOrdeacom = this.numeroLivros;

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
}

export const childRoutes: Routes = [
  {
    path: '',
    component: ListadoEditoriaisComponent,
  },
  {
    path: 'editorial',
    component: EditorialComponent
  }
];
