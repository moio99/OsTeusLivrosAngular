import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BibliotecasService, LivrosService } from '@servizosApi';
import { Biblioteca } from '@interfaces';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ListadoLivrosElementoComponent } from '../../../core/components/listado-livros-elemento/listado-livros-elemento.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { first, map, catchError, of } from 'rxjs';
import { BibliotecaFormPresenterComponent } from './biblioteca-form-presenter.component';
import { BibliotecaFormStateService } from './biblioteca-form-state.service';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { BaseElementoSignalsComponent } from '../../../core/components/base/elemento/base-elemento-signals.component';

@Component({
  selector: 'omla-biblioteca',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule
    , MatDatepickerModule, MatNativeDateModule, BibliotecaFormPresenterComponent, ListadoLivrosElementoComponent],
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.scss'],
  providers: [ {provide: 'OMeuServizoToken', useClass: BibliotecasService}, BibliotecaFormStateService ]
})
export class BibliotecaComponent extends BaseElementoSignalsComponent<Biblioteca, BibliotecasService> {

  private livrosService = inject(LivrosService);
  private bibliotecasService = inject(BibliotecasService);
  private formState = inject(BibliotecaFormStateService);

  idBiblioteca = toSignal(
    this.route.queryParams.pipe(
      map(params => params['id'] ?? '0')
    ),
    { initialValue: '0' }
  );

  bibliotecaResource = rxResource({
    params: () => this.idBiblioteca(),
    stream: ({ params: id }) => {
      const currentId = id;
      if (this.modo() === EstadosPagina.engadir) return of(null);

      return this.bibliotecasService.getPorId(currentId).pipe(
        first(),
        map(v => this.dadosObtidos(v)),
        catchError((e) => {
          this.manejarErroSoporte(e, 'nav.libraries');
          return of(null); })
      );
    }
  });

  livrosBibliotecaResource = rxResource({
    params: () => this.idBiblioteca(),
    stream: ({ params: id }) => {
      const currentId = id;
      return this.livrosService.getLivrosPorBiblioteca(currentId).pipe(
        first(),
        map(v => this.dadosLivrosElementoObtidos(v)),
        catchError((e) => this.manejarErroSoporte(e, 'common.books'))
      );
    }
  });

  constructor() {
    super();

    effect(() => {
      const biblioteca = this.bibliotecaResource.value();
      if (biblioteca) {
        this.dadosDoElemento = biblioteca;                    // para que BaseGardarComponent tenha o id do elemento
        this.formState.atualizarFromBiblioteca(biblioteca);   // Establece os datos para o formulario
      }
    });
  }

  protected isFormValid(): boolean {
    return !this.formState.bibliotecaForm().invalid();
  }

  protected createElementoForm(): Biblioteca {
    const elemento = this.formState.criarObjetoBiblioteca(this.idBiblioteca());
    return elemento;
  }

  protected getNomeElemento(): string {
    return String(this.formState.bibliotecaModel().nome).trim();
  }
}
