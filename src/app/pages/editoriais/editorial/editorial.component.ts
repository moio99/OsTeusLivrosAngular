import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Editorial, EditorialForm } from '@interfaces';
import { EditoriaisService, LivrosService } from '@servizosApi';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseElementoComponent } from '@componhentesComuns';
import { TranslocoPipe } from '@jsverse/transloco';
import { HtmlCompartilhadoRFComponent } from '../../../core/components/base/elemento/html-compartilhado-reactive-forms.component';

@Component({
  selector: 'omla-editorial',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, TranslocoPipe,
    HtmlCompartilhadoRFComponent
   ],
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.scss'],
  providers: [ {provide: 'OMeuServizoToken', useClass: EditoriaisService} ]
})
export class EditorialComponent extends BaseElementoComponent<Editorial, EditoriaisService> {

  override dadosDoElemento: Editorial | undefined = {
    id: 0,
    nome: '',
    web: '',
    direicom: '',
    comentario: ''
  };

  private fb = inject(FormBuilder);
  editorialForm = this.fb.group<EditorialForm>({
    nome: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.required, Validators.maxLength(150)]),
    web: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(150)),
    direicom: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(150)),
    comentario: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(50000))
  });

  private livrosService = inject(LivrosService);

  protected serviceGetLivros(id: string) {
    return this.livrosService.getLivrosPorEditorial(id);
  }

  protected updateFormValues(editorial: Editorial) {
    this.editorialForm.patchValue({
      nome: editorial.nome,
      direicom: editorial.direicom,
      web: editorial.web,
      comentario: editorial.comentario
    });
  }

  protected getLivrosErrorMessage(): string {
    return 'common.books';
  }

  protected createElementoForm(): Editorial {
    const editorial: Editorial = {
      id: Number(this.dadosDoElemento?.id),
      nome: String(this.editorialForm.controls.nome.value),
      direicom: (this.editorialForm.controls.direicom.value == null) ? null : String(this.editorialForm.controls.direicom.value).trim(),
      web: (this.editorialForm.controls.web.value == null) ? null : String(this.editorialForm.controls.web.value).trim(),
      comentario: (this.editorialForm.controls.comentario.value == null) ? null : String(this.editorialForm.controls.comentario.value).trim()
    };
    return editorial;
  }

  protected getNomeElemento(): string {
    return this.editorialForm.controls.nome.value ?? '';
  }

  protected isFormValid(): boolean {
    return Object.values(this.editorialForm.controls).every(control => control.status === 'VALID');
  }
}
