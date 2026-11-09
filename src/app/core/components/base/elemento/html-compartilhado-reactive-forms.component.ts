import { Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { EstadosPagina } from '@enumerados';

@Component({
  selector: 'omla-html-compartilhado-rf',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, ReactiveFormsModule, TranslocoPipe, TranslocoPipe ],
  templateUrl: './html-compartilhado-reactive-forms.component.html',
  styles: []
})
export class HtmlCompartilhadoRFComponent {
  estadosPagina = EstadosPagina;

  modo = input(EstadosPagina.soVisualizar);
  nome = input<FormControl<string | null> | undefined>(undefined);
  comentario = input<FormControl<string | null> | undefined>(undefined);

  onCancelar = output<void>();
}
