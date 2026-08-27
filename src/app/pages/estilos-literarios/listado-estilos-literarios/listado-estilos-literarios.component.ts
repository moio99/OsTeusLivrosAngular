import { Component, inject, signal } from '@angular/core';
import { Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { OrdeColunaComponent, BaseListadoComponent } from '@componhentesComuns';
import { EstiloLiterarioComponent } from '../estilo-literario/estilo-literario.component';
import { EstilosLiterariosService } from '@servizosApi';
import { BaseListadoDadosApi, Editorial, EstiloLiterario, ListadoEstilosLiterarios } from '@interfaces';
import { Observable } from 'rxjs';
import { environment, environments } from '../../../../environments/environment';

@Component({
  selector: 'omla-listado-estilos-literarios',
  standalone: true,
  imports: [CommonModule, OrdeColunaComponent],
  templateUrl: './listado-estilos-literarios.component.html',
  styleUrls: ['./listado-estilos-literarios.component.scss']
})
export class ListadoEstilosLiterariosComponent extends BaseListadoComponent<ListadoEstilosLiterarios> {

  protected nomePlural = 'os estilos literarios';

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  numeroLivros = ', número de livros';
  numeroLivrosLidos = ', número de livros lidos';
  tipoOrdeacom = '';
  inverso = false;
  tipoListado = '';

  private estilosLiterariosService = inject(EstilosLiterariosService);

  // Indicamos a chamada correspondente (TypeScript infire o tipo correctamente)
  protected definirChamadaApi(): Observable<BaseListadoDadosApi<EstiloLiterario>> {
    return this.estilosLiterariosService.getListadoCosLivros();
  }

  // Pasamos a funçom para guardar na caché sen erros de tipos
  protected guardarNaCache(dados: BaseListadoDadosApi<Editorial>): void {
    this.estilosLiterariosService.setListadoCosLivros(dados);
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
    this.inverso = (this.tipoOrdeacom == this.numeroLivrosLidos) ? !this.inverso : false;
    this.tipoOrdeacom = this.numeroLivrosLidos;

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
    component: ListadoEstilosLiterariosComponent,
  },
  {
    path: 'estilo-literario',
    component: EstiloLiterarioComponent
  }
];
