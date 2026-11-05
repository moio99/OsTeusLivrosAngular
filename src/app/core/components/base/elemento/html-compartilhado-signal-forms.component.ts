import { Component, computed, input, output } from '@angular/core';
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
  template: `
    @if (modo() === estadosPagina.engadir || modo() === estadosPagina.guardar) {
      <button class="botom-guardar-resgistro" color="primary" type="submit" value="{{modo()}}">
        <i class="icon-disk"></i>
        {{ modo() === estadosPagina.engadir ? ('common.add' | transloco) : ('common.save' | transloco) }}
      </button>
      <button color="primary" type="button" (click)="onCancelar.emit()">
        {{ 'common.back' | transloco }}
      </button>
    }

    <div class="matriz-dados">
      <mat-form-field class="nome">
        <mat-label>{{ 'common.name' | transloco }}:</mat-label>
        <input matInput [formField]="nome()!" width="200">
        @let estadoNome = nome()?.();
        @if (estadoNome?.getError('maxLength'); as erro) {
          <mat-error>
            {{ 'common.lengthAtMost' | transloco: { count: 150 } }}
          </mat-error>
        }
        @if (estadoNome?.getError('required'); as erro) {
          <mat-error>
            {{ 'common.required' | transloco }}
          </mat-error>
        }
      </mat-form-field>

      <ng-content></ng-content>

      <mat-form-field [style.grid-area]="gridAreaComentario()">
        <mat-label>{{ 'common.comment' | transloco }}:</mat-label>
        <textarea matInput [formField]="comentario()!" rows="4"></textarea>
        @let estadoComentario = comentario()?.();
        @if (estadoComentario?.getError('maxLength'); as erro) {
          <mat-error>
            {{ 'common.lengthAtMost' | transloco: { count: 5000 } }}
          </mat-error>
        }
      </mat-form-field>
    </div>
  `,
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
