import { Component, inject, OnInit, signal } from '@angular/core';
import { Routes } from '@angular/router';
import { GeneroComponent } from '../genero/genero.component';
import { CommonModule } from '@angular/common';
import { ListadoGeneros } from '@interfaces';
import { GenerosService } from '@servizosApi';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { OrdeColunaComponent, BaseListadoComponent } from '@componhentesComuns';
import { environment, environments } from '../../../../environments/environment';

@Component({
  selector: 'omla-listado-generos',
  standalone: true,
  imports: [CommonModule, OrdeColunaComponent],
  templateUrl: './listado-generos.component.html',
  styleUrls: ['./listado-generos.component.scss']
})
export class ListadoGenerosComponent extends BaseListadoComponent<ListadoGeneros> implements OnInit {

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  nomeAlfabetico = ', alfabético';
  numeroLivros = ', número de livros';
  numeroLivrosLidos = ', número de livros lidos';
  tipoOrdeacom = this.nomeAlfabetico;
  inverso = false;
  tipoListado = '';
  override listadoDados = signal<ListadoGeneros[]>([]);

  private generosService = inject(GenerosService);

  ngOnInit(): void {
    super.obterDadosDoListado(
    // super.obterDadosDoListado<Genero>(  // nom ponhoo o tipado <Genero> porque typescript o infire do que
    // retorna this.coleconsService.getListadoCosLivros(),
      'as editoriais',
      this.generosService.getListadoCosLivros(),
      // this.generosService.setListadoCosLivros.bind(this.generosService)
      (dados) => this.generosService.setListadoCosLivros(dados) // <-- Alternativa a .bind() para que nom perdta o contexto (this)
    );
  }

  onBorrar(id: string, nome: string, quantidadeLivros: number) {
    // TODO: this.usuarioAppService.removerGenero(id); Gestionar o borrado da chaché
    this.onBorrarElemento(
      id,
      quantidadeLivros,
      nome,
      'o género',
      'Género borrada correctamente',
      (id) => this.generosService.borrar(id)
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

  ordeNumeroLivrosLidos() {
    this.inverso = (this.tipoOrdeacom == this.numeroLivrosLidos) ? !this.inverso : false;
    this.tipoOrdeacom = this.numeroLivrosLidos;

    this.listadoDados.update(dados =>
      [...dados].sort((a, b) => new Ordeacom().ordear(a.quantidadeLidos, b.quantidadeLidos, this.inverso, false))
    );
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
