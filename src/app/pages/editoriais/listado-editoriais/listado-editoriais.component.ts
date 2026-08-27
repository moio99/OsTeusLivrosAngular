import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Routes } from '@angular/router';
import { OrdeColunaComponent, BaseListadoComponent } from '@componhentesComuns';
import { ListadoEditoriais } from '@interfaces';
import { EditoriaisService } from '@servizosApi';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { EditorialComponent } from '../editorial/editorial.component';
import { environment, environments } from '../../../../environments/environment';

@Component({
  selector: 'omla-listado-editoriais',
  standalone: true,
  imports: [CommonModule, OrdeColunaComponent],
  templateUrl: './listado-editoriais.component.html',
  styleUrls: ['./listado-editoriais.component.scss']
})
export class ListadoEditoriaisComponent extends BaseListadoComponent<ListadoEditoriais> implements OnInit {

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  nomeAlfabetico = ', alfabético';
  numeroLivros = ', número de livros';
  tipoOrdeacom = this.nomeAlfabetico;
  inverso = false;
  tipoListado = '';
  override listadoDados = signal<ListadoEditoriais[]>([]);

  private editoriaisService = inject(EditoriaisService);

  ngOnInit(): void {
    super.obterDadosDoListado(
    // super.obterDadosDoListado<Editorial>(  // nom ponhoo o tipado <Editorial> porque typescript o infire do que
    // retorna this.coleconsService.getListadoCosLivros(),
      'as editoriais',
      this.editoriaisService.getListadoCosLivros(),
      // this.editoriaisService.setListadoCosLivros.bind(this.editoriaisService)
      (datos) => this.editoriaisService.setListadoCosLivros(datos) // <-- Alternativa a .bind() para que nom perdta o contexto (this)
    );
  }

  onBorrar(id: string, nome: string, quantidadeLivros: number) {
    this.onBorrarElemento(
      id,
      quantidadeLivros,
      nome,
      'a editorial',
      'Editorial borrada correctamente',
      (id) => this.editoriaisService.borrar(id)
    );
  }

  ordeAlfabetico() {
    this.inverso = (this.tipoOrdeacom == this.nomeAlfabetico) ? !this.inverso : false;
    this.tipoOrdeacom = this.nomeAlfabetico;

    this.listadoDados.update(dados =>
      [...dados].sort((a, b) => new Ordeacom().ordear(a.nome, b.nome, this.inverso))
    );
  }

  ordeNumeroLivros() {
    this.inverso = (this.tipoOrdeacom == this.numeroLivros) ? !this.inverso : false;
    this.tipoOrdeacom = this.numeroLivros;

    this.listadoDados.update(dados =>
      [...dados].sort((a, b) => new Ordeacom().ordear(a.quantidadeLivros, b.quantidadeLivros, this.inverso, false))
    );
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
