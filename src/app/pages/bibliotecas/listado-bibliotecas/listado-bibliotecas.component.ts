import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { first } from 'rxjs';
import { ListadoBibliotecas, ListadoBibliotecasData } from '../../../core/models/listado-bibliotecas.interface';
import { BibliotecasService } from '../../../core/services/api/bibliotecas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { CommonModule } from '@angular/common';
import { BibliotecaComponent } from '../biblioteca/biblioteca.component';
import { environment, environments } from '../../../../environments/environment';
import { BaseListadoComponent } from '../../../core/components/base/listado/base-listado.component';

@Component({
  selector: 'omla-listado-bibliotecas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-bibliotecas.component.html',
  styleUrls: ['./listado-bibliotecas.component.scss']
})
export class ListadoBibliotecasComponent extends BaseListadoComponent<ListadoBibliotecas> implements OnInit {

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  tipoListado = '';
  override listadoDados: ListadoBibliotecas[] = [];

  constructor(
    private router: Router,
    private bibliotecasService: BibliotecasService,
    layoutService: LayoutService) {
      super(layoutService);
    }

  ngOnInit(): void {
    super.obterDadosDoListado('as bibliotecas',
      this.bibliotecasService.getListadoCosLivros(),
      this.bibliotecasService.setListadoCosLivros.bind(this.bibliotecasService));
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

  onIrPagina(rota: string, id: string): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
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
