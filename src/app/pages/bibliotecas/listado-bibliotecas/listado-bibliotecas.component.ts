import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { ListadoBibliotecas } from '@interfaces';
import { BibliotecasService } from '@servizosApi';
import { LayoutService } from '@servizosFlow';
import { CommonModule } from '@angular/common';
import { BibliotecaComponent } from '../biblioteca/biblioteca.component';
import { environment, environments } from '../../../../environments/environment';
import { BaseListadoComponent } from '@componhentesComuns';

@Component({
  selector: 'omla-listado-bibliotecas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-bibliotecas.component.html',
  styleUrls: ['./listado-bibliotecas.component.scss']
})
export class ListadoBibliotecasComponent extends BaseListadoComponent<ListadoBibliotecas> implements OnInit {

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  override listadoDados = signal<ListadoBibliotecas[]>([]);

  private bibliotecasService = inject(BibliotecasService);


  ngOnInit(): void {
    super.obterDadosDoListado(
    // super.obterDadosDoListado<Bilioteca>(  // nom ponhoo o tipado <Bilioteca> porque typescript o infire do que
    // retorna this.coleconsService.getListadoCosLivros(),
      'as bibliotecas',
      this.bibliotecasService.getListadoCosLivros(),
      // this.bibliotecasService.setListadoCosLivros.bind(this.bibliotecasService)
      (datos) => this.bibliotecasService.setListadoCosLivros(datos) // <-- Alternativa a .bind() para que nom perdta o contexto (this)
    );
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
