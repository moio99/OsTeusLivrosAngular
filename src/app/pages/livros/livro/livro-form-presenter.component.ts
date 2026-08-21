import { Component, EventEmitter, inject, input, Input, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { EstrelasPontuacomComponent } from '@componhentesComuns';
import { LivroForm } from '@interfaces';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { DadosComplentarios } from '../../../shared/enums/estadisticasTipos';
import { SimpleObjet } from '../../../shared/models/outros.model';
import { LivroRelacionsComponent } from './livro-relacions.component';
import { LivroFormStateService } from './livro-form-state.service';

@Component({
  selector: 'omla-livro-form-presenter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    EstrelasPontuacomComponent,
    LivroRelacionsComponent
  ],
  templateUrl: './livro-form-presenter.component.html',
  styleUrls: ['./livro-form-presenter.component.scss']
})
export class LivroFormPresenterComponent {
  readonly formState = inject(LivroFormStateService);

  livroForm = input.required<FormGroup<LivroForm>>();
  modo = input(EstadosPagina.soVisualizar);
  modoRelectura = input(false);
  idLivro = input('0');
  pontuacomEstrelas = input<number | undefined>();
  autoresLivro = input<SimpleObjet[]>([]);
  generosLivro = input<SimpleObjet[]>([]);

  readonly estadosPagina = EstadosPagina;
  readonly dadosComplentarios = DadosComplentarios;

  submitForm = output<SubmitEvent>();
  novaRelectura = output<void>();
  cancelarRelectura = output<void>();
  pontuacaoAlterada = output<number | undefined>();
  somSerieAlterado = output<MatCheckboxChange>();
  gestionarAutores = output<void>();
  engadirAutor = output<void>();
  gestionarGeneros = output<void>();
  engadirGenero = output<void>();
  navegarAutor = output<number>();
  navegarGenero = output<number>();
  engadirComplementario = output<DadosComplentarios>();
  editarBiblioteca = output<void>();
  editarEditorial = output<void>();
  editarColecom = output<void>();
  editarEstilo = output<void>();
}
