import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, first, map, of } from 'rxjs';
import { Autor, ListadoLivros } from '@interfaces';
import { AutoresService, LivrosService, OutrosService } from '@servizosApi';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { Nacionalidade, SimpleObjet, Pais } from '../../../shared/models/outros.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AutorFormPresenterComponent } from './autor-form-presenter.component';
import { AutorFormStateService } from './autor-form-state.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ListadoLivrosElementoComponent } from '../../../core/components/listado-livros-elemento/listado-livros-elemento.component';
import { BaseElementoSignalsComponent } from '../../../core/components/base/elemento/base-elemento-signals.component';

@Component({
  selector: 'omla-autor',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule,
    MatNativeDateModule, MatAutocompleteModule, AutorFormPresenterComponent, ListadoLivrosElementoComponent ],
  templateUrl: './autor.component.html',
  styleUrls: ['./autor.component.scss'],
  providers: [{provide: 'OMeuServizoToken', useClass: AutoresService}, AutorFormStateService]
})
export class AutorComponent extends BaseElementoSignalsComponent<Autor, AutoresService> {

  private outrosService = inject(OutrosService);
  private autoresService = inject(AutoresService);
  private livrosService = inject(LivrosService);

  private readonly formState = inject(AutorFormStateService);

  dadosLivrosDoAutor = signal<ListadoLivros[]>([]);
  date = new Date();

  idAutor = toSignal(
    this.route.queryParams.pipe(
      map(params => params['id'] ?? '0')
    ),
    { initialValue: '0' }
  );
  // modo = computed(() => {
  //   if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) {
  //     return EstadosPagina.soVisualizar;
  //   };
  //   return this.idAutor() === '0' ? EstadosPagina.engadir : EstadosPagina.guardar;
  // });

  nacionalidadesResource = rxResource({
    stream: () => {
      const cache = this.dadosOutrosService.getDadosOutrosCache();
      // Se xa están en caché, devolvemos un observable inmediato para non ir ao servidor
      if (cache?.nacionalidades) return of(cache.nacionalidades);

      return this.outrosService.getNacionalidades().pipe(
        first(),
        catchError((e) => this.manejarErroSoporte(e, 'common.nationality'))
      );
    }
  });

  paisesResource = rxResource({
    stream: () => {
      // Se xa están en caché, devolvemos un observable inmediato para non ir ao servidor
      const cache = this.dadosOutrosService.getDadosOutrosCache();
      if (cache?.paises) return of(cache.paises);

      return this.outrosService.getPaises().pipe(
        first(),
        catchError((e) => this.manejarErroSoporte(e, 'common.country'))
      );
    }
  });

  livrosAutorResource = rxResource({
    params: () => this.idAutor(),
    stream: ({ params: id }) => {
      const currentId = id;
      return this.livrosService.getLivrosPorAutor(currentId).pipe(
        first(),
        map(v => this.dadosLivrosElementoObtidos(v)),
        catchError((e) => this.manejarErroSoporte(e, 'common.books'))
      );
    }
  });

  autorResource = rxResource({
    params: () => this.idAutor(),
    stream: ({ params: id }) => {
      const currentId = id;

      // Se o ID é '0' (modo engadir), non facemos petición HTTP e devolvemos null
      if (!currentId || currentId === '0') return of(null);

      return this.autoresService.getPorId(currentId).pipe(
        first(),
        map(v => this.dadosObtidos(v)),
        catchError((e) => {
          this.manejarErroSoporte(e, 'common.authors');
          return of(null); })
      );
    }
  });

  constructor() {
    super();

    // Sincroniza as nacionalidades co FormState cando carguen
    effect(() => {
      const data = this.nacionalidadesResource.value();
      if (data) {
        this.formState.setNacionalidades(this.reducirDadosGerais(data));
      }
    });

    // Sincroniza os países co FormState cando carguen
    effect(() => {
      const data = this.paisesResource.value();
      if (data) {
        this.formState.setPaises(this.reducirDadosGerais(data));
      }
    });

    // Sincroniza os datos do autor (Se os necesitas nunha propiedade local)
    effect(() => {
      const autor = this.autorResource.value();
      if (autor) {
        this.dadosDoElemento = autor;   // para que BaseGardarComponent tenha o id do elemento
      }

      // Lemos os estados de carga dos outros dous recursos
      const nacionalidadesListas = this.nacionalidadesResource.hasValue();
      const paisesListos = this.paisesResource.hasValue();

      // Se o autor chegou, pero os combos aínda non teñen datos, AGARDAMOS.
      // O effect volverá a executarse automaticamente en canto as outras sinais cambien.
      if (autor && nacionalidadesListas && paisesListos) {
        this.formState.atualizarFromAutor(autor); // Establece os datos para o formulario
      }
    });

    effect(() => {
      const autor = this.autorResource.value();
      const libros = this.livrosAutorResource.value();
      if (autor && autor.id > 0 && this.livrosAutorResource.hasValue() && libros?.length === 0) {
        this.layoutService.amosarInfo({
          tipo: InformacomPeTipo.Aviso,
          mensagem: this.translocoService.translate('common.noDataReceived')
        });
      }
    });
  }

  private reducirDadosGerais(data: any): SimpleObjet[] {
    const dados = data as { data: Array<Nacionalidade | Pais> };
    if (!dados?.data) {
      return [];
    }

    return dados.data.map(value => ({
      id: value.id,
      value: value.nome
    }));
  }

  protected isFormValid(): boolean {
    return !this.formState.autorForm().invalid();
  }

  protected createElementoForm(): Autor {
    const elemento = this.formState.criarObjetoAutor(this.idAutor());
    return elemento;
  }

  protected getNomeElemento(): string {
    return String(this.formState.autorModel().nome).trim();
  }
}
