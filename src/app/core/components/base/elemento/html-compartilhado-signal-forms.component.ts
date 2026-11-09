import { Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { EstadosPagina } from '../../../../shared/enums/estadosPagina';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FieldTree, FormField } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'omla-html-compartilhado-sf',
  standalone: true,
  imports: [ CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormField,
    TranslocoPipe, TranslocoPipe ],
  templateUrl: './html-compartilhado-signal-forms.component.html',
  styleUrls: ['./html-compartilhado-signal-forms.component.scss']
})
export class HtmlCompartilhadoSFComponent {
  estadosPagina = EstadosPagina;

  gridAreaComentario = input<string | undefined>('5/1/6/5');

  modo = input(EstadosPagina.soVisualizar);
  nome = input<FieldTree<string> | undefined>(undefined);
  comentario = input<FieldTree<string> | undefined>(undefined);

  onCancelar = output<void>();
}
