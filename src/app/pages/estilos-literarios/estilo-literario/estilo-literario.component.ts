import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LivrosService, EstilosLiterariosService } from '@servizosApi';
import { BaseElementoComponent } from '@componhentesComuns';
import { EstiloLiterario, EstiloLiterarioForm } from '@interfaces';
import { TranslocoPipe } from '@jsverse/transloco';
import { HtmlCompartilhadoRFComponent } from '../../../core/components/base/elemento/html-compartilhado-reactive-forms.component';

@Component({
  selector: 'omla-estilo-literario',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, TranslocoPipe,
    HtmlCompartilhadoRFComponent /* , MatDatepickerModule, MatNativeDateModule */],
  templateUrl: './estilo-literario.component.html',
  styleUrls: ['./estilo-literario.component.scss'],
  providers: [ {provide: 'OMeuServizoToken', useClass: EstilosLiterariosService}, EstilosLiterariosService ]
})
export class EstiloLiterarioComponent extends BaseElementoComponent<EstiloLiterario, EstilosLiterariosService> {

  override dadosDoElemento: EstiloLiterario | undefined = {
    id: 0,
    nome: '',
    comentario: ''
  };

  private fb = inject(FormBuilder);
  estiloLiterarioForm = this.fb.group<EstiloLiterarioForm>({
      nome: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.required, Validators.maxLength(150)]),
      comentario: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(50000))
    });

  private livrosService = inject(LivrosService);

  protected get formuario(): FormGroup<EstiloLiterarioForm> {
    return this.estiloLiterarioForm;
  }

  protected serviceGetLivros(id: string) {
    return this.livrosService.getListadoLivrosPorEstiloLiterario(id);
  }

  protected updateFormValues(estiloLiterario: EstiloLiterario) {
    this.estiloLiterarioForm.patchValue({
      nome: estiloLiterario.nome,
      comentario: estiloLiterario.comentario
    });
  }

  protected createElementoForm(): EstiloLiterario {
    const estiloLiterario: EstiloLiterario = {
      id: Number(this.dadosDoElemento?.id),
      nome: String(this.estiloLiterarioForm.controls.nome.value),
      comentario: (this.estiloLiterarioForm.controls.comentario.value == null) ? null : String(this.estiloLiterarioForm.controls.comentario.value).trim()
    };
    return estiloLiterario;
  }

  protected getLivrosErrorMessage(): string {
    return 'common.books';
  }

  protected getNomeElemento(): string {
    return this.estiloLiterarioForm.controls.nome.value ?? '';
  }

  protected isFormValid(): boolean {
    return Object.values(this.formuario.controls).every(control => control.status === 'VALID');
  }
}
