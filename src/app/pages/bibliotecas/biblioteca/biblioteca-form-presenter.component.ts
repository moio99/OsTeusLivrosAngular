import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { BibliotecaFormStateService } from './biblioteca-form-state.service';

@Component({
  selector: 'omla-biblioteca-form-presenter',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatNativeDateModule,
    MatDatepickerModule, MatAutocompleteModule ],
  templateUrl: './biblioteca-form-presenter.component.html'
})
export class BibliotecaFormPresenterComponent {

  readonly estadosPagina = EstadosPagina;

  readonly formState = inject(BibliotecaFormStateService);

  modo = input(EstadosPagina.soVisualizar);

  submitForm = output<SubmitEvent>();
  cancelar = output<void>();

  /**
   * Para que ao dar-lhe ao intro nom faga o envio do formulario
   * @param event Evento
   */
  onKeyDownImpedirEnvio(event: Event) {
    const keyboardEvent = event as KeyboardEvent; // Convertir a KeyboardEvent
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault(); // Prevenir que el formulario se envíe
    }
  }
}
