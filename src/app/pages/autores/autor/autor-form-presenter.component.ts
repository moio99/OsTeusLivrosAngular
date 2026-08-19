import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AutorForm } from '@interfaces';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { SimpleObjet } from '../../../shared/models/outros.model';

@Component({
  selector: 'omla-autor-form-presenter',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatNativeDateModule,
    MatDatepickerModule, MatAutocompleteModule ],
  templateUrl: './autor-form-presenter.component.html'
})
export class AutorFormPresenterComponent {

  estadosPagina = EstadosPagina;

  @Input({ required: true }) autorForm!: FormGroup<AutorForm>;
  @Input({ required: true }) modo!: EstadosPagina;
  @Input() dadosNacionalidadesFiltradas: SimpleObjet[] = [];
  @Input() dadosPaisesFiltrados: SimpleObjet[] = [];
  @Input() amosarNacionalidade!: (id: number | null) => string;
  @Input() amosarPais!: (id: number | null) => string;

  @Output() submitForm = new EventEmitter<SubmitEvent>();
  @Output() cancelar = new EventEmitter<void>();
}
