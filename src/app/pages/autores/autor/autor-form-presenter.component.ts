import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { AutorFormStateService } from './autor-form-state.service';

@Component({
  selector: 'omla-autor-form-presenter',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatNativeDateModule,
    MatDatepickerModule, MatAutocompleteModule ],
  templateUrl: './autor-form-presenter.component.html'
})
export class AutorFormPresenterComponent {

  readonly estadosPagina = EstadosPagina;

  readonly formState = inject(AutorFormStateService);

  modo = input(EstadosPagina.soVisualizar);

  submitForm = output<SubmitEvent>();
  cancelar = output<void>();
}
