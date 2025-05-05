import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { OrdeColunaComponent } from '../../../core/components/orde-coluna/orde-coluna.component';
import { ListadoEditoriais } from '../../../core/models/listado-editoriais.interface';
import { EditoriaisService } from '../../../core/services/api/editoriais.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { EditorialComponent } from '../editorial/editorial.component';
import { environment, environments } from '../../../../environments/environment';
import { BaseListadoComponent } from '../../../core/components/base/listado/base-listado.component';

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
  override listadoDados: ListadoEditoriais[] = [];

  constructor(
    private router: Router,
    private editoriaisService: EditoriaisService,
    layoutService: LayoutService) {
      super(layoutService);
    }

  ngOnInit(): void {
    super.obterDadosDoListado('as editoriais',
      this.editoriaisService.getListadoCosLivros(),
      this.editoriaisService.setListadoCosLivros.bind(this.editoriaisService));
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

  onIrPagina(rota: string, id: string): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
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
