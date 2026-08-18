import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LivrosService, EstilosLiterariosService } from '@servizosApi';
import { BaseElementoComponent } from '@componhentesComuns';
import { EstiloLiterario } from '../../../core/models/estilos-literarios.interface';

@Component({
  selector: 'omla-estilo-literario',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule
    /* , MatDatepickerModule, MatNativeDateModule */],
  templateUrl: './estilo-literario.component.html',
  styleUrls: ['./estilo-literario.component.scss'],
  providers: [ {provide: 'OMeuServizoToeken', useClass: EstilosLiterariosService} ]
})
export class EstiloLiterarioComponent extends BaseElementoComponent<EstiloLiterario, EstilosLiterariosService> {

  ef: FormGroup;
  override dadosDoElemento: EstiloLiterario | undefined = {
    id: 0,
    nome: '',
    comentario: ''
  };

  private livrosService = inject(LivrosService);

  constructor() {
    super();

    this.ef = new FormGroup({
      nome: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.required, Validators.maxLength(150)]),
      comentario: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(50000))
    });
  }

  protected get formuario(): any {
    return this.ef;
  }

  protected serviceGetLivros(id: string) {
    return this.livrosService.getListadoLivrosPorEstiloLiterario(id);
  }

  protected updateFormValues(estiloLiterario: EstiloLiterario) {
    this.ef.patchValue({
      nome: estiloLiterario.nome,
      comentario: estiloLiterario.comentario
    });
  }

  protected createElementoForm(): EstiloLiterario {
    const estiloLiterario: EstiloLiterario = {
      id: Number(this.dadosDoElemento?.id),
      nome: String(this.formuario.get('nome').value),
      comentario: (this.formuario.get('comentario').value == null) ? null : String(this.formuario.get('comentario').value).trim()
    };
    return estiloLiterario;
  }

  protected getErrorMessage(context: string): string {
    return context === 'obtención'
      ? 'Nom se puiderom obter os dados dos estilos literarios.'
      : 'Nom chegarom dados dos estilos literarios';
  }

  protected getLivrosErrorMessage(): string {
    return 'Nom se puiderom obter os Livros dos estilos literarios.';
  }

  protected getNomeElemento(): string {
    return this.ef.controls['nome'].value ?? '';
  }
}
