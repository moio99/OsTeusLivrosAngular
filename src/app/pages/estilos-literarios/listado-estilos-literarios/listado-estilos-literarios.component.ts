import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '@servizosFlow';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { OrdeColunaComponent, BaseListadoComponent } from '@componhentesComuns';
import { EstiloLiterarioComponent } from '../estilo-literario/estilo-literario.component';
import { EstilosLiterariosService } from '@servizosApi';
import { ListadoEstilosLiterarios } from '@interfaces';
import { environment, environments } from '../../../../environments/environment';

@Component({
  selector: 'omla-listado-estilos-literarios',
  standalone: true,
  imports: [CommonModule, OrdeColunaComponent],
  templateUrl: './listado-estilos-literarios.component.html',
  styleUrls: ['./listado-estilos-literarios.component.scss']
})
export class ListadoEstilosLiterariosComponent extends BaseListadoComponent<ListadoEstilosLiterarios> implements OnInit {

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  numeroLivros = ', número de livros';
  numeroLivrosLidos = ', número de livros lidos';
  tipoOrdeacom = '';
  inverso = false;
  tipoListado = '';
  override listadoDados = signal<ListadoEstilosLiterarios[]>([]);

  private estilosLiterariosService = inject(EstilosLiterariosService);
  private router = inject(Router);

  ngOnInit(): void {
    super.obterDadosDoListado(
      'os estilos literarios',
      this.estilosLiterariosService.getListadoCosLivros(),
      // this.estilosLiterariosService.setListadoCosLivros.bind(this.estilosLiterariosService));
      (datos) => this.estilosLiterariosService.setListadoCosLivros(datos) // <-- Alternativa a .bind() para que nom perdta o contexto (this)
    );
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
    component: ListadoEstilosLiterariosComponent,
  },
  {
    path: 'estilo-literario',
    component: EstiloLiterarioComponent
  }
];
