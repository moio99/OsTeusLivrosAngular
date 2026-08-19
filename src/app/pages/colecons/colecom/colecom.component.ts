import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Colecom, ColecomForm } from '@interfaces';
import { ColeconsService, LivrosService } from '@servizosApi';
import { BaseElementoComponent } from '@componhentesComuns';

@Component({
  selector: 'omla-colecom',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule ],
  templateUrl: './colecom.component.html',
  styleUrls: ['./colecom.component.scss'],
  providers: [ {provide: 'OMeuServizoToeken', useClass: ColeconsService} ]
})
export class ColecomComponent extends BaseElementoComponent<Colecom, ColeconsService> {

  override dadosDoElemento: Colecom | undefined = {
    id: 0,
    nome: '',
    isbn: '',
    web: '',
    comentario: ''
  };

  private fb = inject(FormBuilder);
  colecomForm = this.fb.group<ColecomForm>({
      nome: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.required, Validators.maxLength(150)]),
      isbn: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.maxLength(20)]),
      web: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.maxLength(150)]),
      comentario: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(50000))
    });

  private livrosService = inject(LivrosService);

  protected get formuario(): any {
    return this.colecomForm;
  }

  protected serviceGetLivros(id: string) {
    return this.livrosService.getLivrosPorColecom(id);
  }

  protected updateFormValues(colecom: Colecom) {
    this.colecomForm.patchValue({
      nome: colecom.nome,
      isbn: colecom.isbn,
      web: colecom.web,
      comentario: colecom.comentario
    });
  }

  protected createElementoForm(): Colecom {
    const colecom: Colecom = {
      id: Number(this.dadosDoElemento?.id),
      nome: String(this.colecomForm.controls.nome.value),
      isbn: (this.colecomForm.controls.isbn.value == null) ? null : String(this.colecomForm.controls.isbn.value).trim(),
      web: (this.colecomForm.controls.web.value == null) ? null : String(this.colecomForm.controls.web.value).trim(),
      comentario: (this.colecomForm.controls.comentario.value == null) ? null : String(this.colecomForm.controls.comentario.value).trim()
    };
    return colecom;
  }

  protected getErrorMessage(context: string): string {
    return context === 'obtención'
      ? 'Nom se puiderom obter os dados da coleçom.'
      : 'Nom chegarom dados da coleçom';
  }

  protected getLivrosErrorMessage(): string {
    return 'Nom se puiderom obter os Livros da coleçom.';
  }

  protected getNomeElemento(): string {
    return this.colecomForm.controls.nome.value ?? '';
  }
}
