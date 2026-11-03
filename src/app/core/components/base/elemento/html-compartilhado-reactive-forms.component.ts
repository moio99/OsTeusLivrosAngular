import { Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { EstadosPagina } from '../../../../shared/enums/estadosPagina';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'omla-html-compartilhado-rf',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, ReactiveFormsModule, TranslocoPipe, TranslocoPipe ],
  template: `
    @if (modo() === estadosPagina.engadir || modo() === estadosPagina.guardar) {
      <button class="botom-guardar-resgistro" color="primary" type="submit" value="{{modo()}}">
        {{ modo() === estadosPagina.engadir ? ('common.add' | transloco) : ('common.save' | transloco) }}
      </button>
      <button color="primary" type="button" (click)="onCancelar.emit()">
        {{ 'common.back' | transloco }}
      </button>
    }

    <div class="formulario-dados">
      <mat-form-field [style.width.px]=500>
        <mat-label>{{ 'common.name' | transloco }}:</mat-label>
        <input matInput [formControl]="nome()!" width="200">
        @if (nome()?.hasError('maxlength')) {
          <mat-error>
            {{ 'common.lengthAtMost' | transloco: { count: 150 } }}
          </mat-error>
        }
        @if (nome()?.hasError('required')) {
          <mat-error>
            {{ 'common.required' | transloco }}
          </mat-error>
        }
      </mat-form-field>

      <ng-content></ng-content>

      <mat-form-field [style.width.px]=500>
        <mat-label>{{ 'common.comment' | transloco }}:</mat-label>
        <textarea matInput [formControl]="comentario()!" rows="4"></textarea>
        @if (comentario()?.hasError('maxlength')) {
          <mat-error>
            {{ 'common.lengthAtMost' | transloco: { count: 5000 } }}
          </mat-error>
        }
      </mat-form-field>
    </div>
  `,
  styles: []
})
export class HtmlCompartilhadoRFComponent {
  estadosPagina = EstadosPagina;

  modo = input(EstadosPagina.soVisualizar);
  nome = input<FormControl<string | null> | undefined>(undefined);
  comentario = input<FormControl<string | null> | undefined>(undefined);

  onCancelar = output<void>();
}
