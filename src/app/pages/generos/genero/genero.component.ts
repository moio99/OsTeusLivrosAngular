import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Genero, GeneroForm } from '../../../core/models/genero.interface';
import { GenerosService, LivrosService} from '@servizosApi';
import { BaseElementoComponent } from '@componhentesComuns';

@Component({
  selector: 'omla-genero',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule
    /* , MatDatepickerModule, MatNativeDateModule */],
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.scss'],
    providers: [ {provide: 'OMeuServizoToeken', useClass: GenerosService} ]
})
export class GeneroComponent extends BaseElementoComponent<Genero, GenerosService> {

  generoForm!: FormGroup<GeneroForm>;
  override dadosDoElemento: Genero | undefined = {
    id: 0,
    nome: '',
    comentario: ''
  };

  private livrosService = inject(LivrosService);

  constructor() {
    super();

    this.generoForm = new FormGroup<GeneroForm>({
      nome: new FormControl({value: '', disabled: this.disabledFormulario}, { validators: [Validators.required, Validators.maxLength(150)]} ),
      comentario: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(50000))
    })
  }

  protected get formuario(): any {
    return this.generoForm;
  }

  protected serviceGetLivros(id: string) {
    return this.livrosService.getListadoLivrosPorGenero(id);
  }

  protected updateFormValues(estiloLiterario: Genero) {
    this.generoForm.patchValue({
      nome: estiloLiterario.nome,
      comentario: estiloLiterario.comentario
    });
  }

  protected createElementoForm(): Genero {
    const estiloLiterario: Genero = {
      tipo: 'propriedade para saver que o tipo é Género',
      id: Number(this.dadosDoElemento?.id),
      nome: String(this.generoForm.controls.nome.value),
      comentario: (this.generoForm.controls.comentario.value == null) ? null : String(this.generoForm.controls.comentario.value).trim()
    };
    return estiloLiterario;
  }

  protected getErrorMessage(context: string): string {
    return context === 'obtención'
      ? 'Nom se puiderom obter os dados dos géneros.'
      : 'Nom chegarom dados dos géneros';
  }

  protected getLivrosErrorMessage(): string {
    return 'Nom se puiderom obter os Livros dos géneros.';
  }

  protected getNomeElemento(): string {
    return this.generoForm.controls.nome.value ?? '';
  }
}
