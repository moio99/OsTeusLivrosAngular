import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { GeneroComponent } from '../genero/genero.component';
import { CommonModule } from '@angular/common';
import { ListadoGeneros } from '../../../core/models/listado-generos.interface';
import { GenerosService } from '../../../core/services/api/generos.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { OrdeColunaComponent } from '../../../core/components/orde-coluna/orde-coluna.component';
import { environment, environments } from '../../../../environments/environment';
import { BaseListadoComponent } from '../../../core/components/base/listado/base-listado.component';

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
  override listadoDados: ListadoGeneros[] = [];

  constructor(
    private router: Router,
    private generosService: GenerosService,
    layoutService: LayoutService) {
      super(layoutService);
    }

  ngOnInit(): void {
    super.obterDadosDoListado(
      'as editoriais',
      this.generosService.getListadoCosLivros(),
      this.generosService.setListadoCosLivros.bind(this.generosService));
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

  trackById(index: number, item: any): number {
    return item.id;
  }

  ordeAlfabetico() {
    this.inverso = (this.tipoOrdeacom == this.nomeAlfabetico) ? !this.inverso : false;
    this.tipoOrdeacom = this.nomeAlfabetico;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(a.nome, b.nome, this.inverso));
  }

  ordeNumeroLivros() {
    this.inverso = (this.tipoOrdeacom == this.numeroLivros) ? !this.inverso : false;
    this.tipoOrdeacom = this.numeroLivros;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(a.quantidadeLivros, b.quantidadeLivros, this.inverso, false));
  }

  ordeNumeroLivrosLidos() {
    this.inverso = (this.tipoOrdeacom == this.numeroLivrosLidos) ? !this.inverso : false;
    this.tipoOrdeacom = this.numeroLivrosLidos;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(a.quantidadeLidos, b.quantidadeLidos, this.inverso, false));
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
    component: ListadoGenerosComponent,
  },
  {
    path: 'genero',
    component: GeneroComponent
  }
];
