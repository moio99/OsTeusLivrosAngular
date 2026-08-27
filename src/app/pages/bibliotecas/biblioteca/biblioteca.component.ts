import { Component, computed, inject } from '@angular/core';
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
import { first, map, catchError, of, switchMap, EMPTY } from 'rxjs';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { BibliotecaFormPresenterComponent } from './biblioteca-form-presenter.component';
import { BibliotecaFormStateService } from './biblioteca-form-state.service';
import { ActivatedRoute } from '@angular/router';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { BaseElementoSignalsComponent } from '../../../core/components/base/elemento/base-elemento-signals.component';

@Component({
  selector: 'omla-biblioteca',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule
    , MatDatepickerModule, MatNativeDateModule, BibliotecaFormPresenterComponent, ListadoLivrosElementoComponent],
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.scss'],
  providers: [ {provide: 'OMeuServizoToeken', useClass: BibliotecasService}, BibliotecaFormStateService ]
})
export class BibliotecaComponent extends BaseElementoSignalsComponent<Biblioteca> {

  private route = inject(ActivatedRoute);
  private livrosService = inject(LivrosService);
  private bibliotecasService = inject(BibliotecasService);
  private formState = inject(BibliotecaFormStateService);

  idBiblioteca = toSignal(
    this.route.queryParams.pipe(
      map(params => params['id'] ?? '0')
    ),
    { initialValue: '0' }
  );
  modo = computed(() => {
    return this.idBiblioteca() === '0' ? EstadosPagina.engadir : EstadosPagina.guardar;
  });

  bibliotecaResource = rxResource({
    params: () => this.idBiblioteca(),
    stream: ({ params: id }) => {
      const currentId = id;
      if (this.modo() === EstadosPagina.engadir) return of(null);

      return this.bibliotecasService.getPorId(currentId).pipe(
        first(),
        map(v => this.dadosBibliotecaObtidos(v)),
        catchError((e) => {
          this.manexarErroSoporte(e, 'do autor');
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
        map(v => this.dadosLivrosObtidos(v)),
        catchError((e) => this.manexarErroSoporte(e, 'dos livros da biblioteca'))
      );
    }
  });

  onSubmit(): void {
    if (this.formState.bibliotecaForm.invalid) return;

    const nomeValue = String(this.formState.bibliotecaForm.controls.nome.value).trim();
    const elemento = this.formState.criarObjetoBiblioteca(this.idBiblioteca());

    // Encadeamos de xeito reactivo as dúas peticións do servidor
    this.bibliotecasService.getPorNome(nomeValue).pipe(
      first(),
      // O operador switchMap intercepta o resultado de duplicados e decide o seguinte fluxo
      switchMap((elementoExistente: any) => {
        const isDuplicate = elementoExistente?.meta?.quantidade > 0 &&
          (this.modo() === EstadosPagina.engadir ||
          (this.modo() === EstadosPagina.guardar && elementoExistente.meta.id.toString() !== this.idBiblioteca()));

        if (isDuplicate) {
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Aviso,
            mensagem: `O nome ${nomeValue} já existe na base de dados`
          });
          // Cortamos o fluxo devolvendo un observable baleiro sen facer o gardado
          return EMPTY;
        }

        return this.modo() === EstadosPagina.engadir
          ? this.bibliotecasService.create(elemento)
          : this.bibliotecasService.update(elemento);
      })
    ).subscribe({
      next: (v: any) => this.gestionarRetroceso(v, elemento),
      error: (e: unknown) => {
        console.error(e);
        this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
          mensagem: this.modo() === EstadosPagina.engadir
            ? 'Houbo un erro ao engadir a biblioteca.'
            : 'Houbo un erro ao guardar a biblioteca.'
        });
      },
      complete: () => {
        this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso,
          mensagem: this.modo() === EstadosPagina.engadir
            ? 'Biblioteca engadida.'
            : 'Biblioteca guardada.'
        });
        console.debug('Proceso de formulario completado de forma segura.');
      }
    });
  }

  protected aplicarDatosAoFormulario(datos: Biblioteca): void {
    this.formState.atualizarFromBiblioteca(datos);
  }
}
