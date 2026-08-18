import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Editorial } from '../../../core/models/editorial.interface';
import { EditoriaisService, LivrosService } from '@servizosApi';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseElementoComponent } from '@componhentesComuns';

@Component({
  selector: 'omla-editorial',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule ],
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.scss'],
  providers: [ {provide: 'OMeuServizoToeken', useClass: EditoriaisService} ]
})
export class EditorialComponent extends BaseElementoComponent<Editorial, EditoriaisService> {

  ef: FormGroup;
  override dadosDoElemento: Editorial | undefined = {
    id: 0,
    nome: '',
    web: '',
    direicom: '',
    comentario: ''
  };

  private livrosService = inject(LivrosService);

  constructor() {
    super();

    this.ef = new FormGroup({
      nome: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.required, Validators.maxLength(150)]),
      direicom: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(150)),
      web: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(150)),
      comentario: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(50000))
    });
  }

  protected get formuario(): any {
    return this.ef;
  }

  protected serviceGetLivros(id: string) {
    return this.livrosService.getLivrosPorEditorial(id);
  }

  protected updateFormValues(editorial: Editorial) {
    this.ef.patchValue({
      nome: editorial.nome,
      direicom: editorial.direicom,
      web: editorial.web,
      comentario: editorial.comentario
    });
  }

  protected getErrorMessage(context: string): string {
    return context === 'obtención'
      ? 'Nom se puiderom obter os dados da editorial.'
      : 'Nom chegarom dados da editorial';
  }

  protected getLivrosErrorMessage(): string {
    return 'Nom se puiderom obter os Livros da editorial.';
  }

  protected createElementoForm(): Editorial {
    const editorial: Editorial = {
      id: Number(this.dadosDoElemento?.id),
      nome: String(this.formuario.get('nome').value),
      direicom: (this.formuario.get('direicom').value == null) ? null : String(this.formuario.get('direicom').value).trim(),
      web: (this.formuario.get('web').value == null) ? null : String(this.formuario.get('web').value).trim(),
      comentario: (this.formuario.get('comentario').value == null) ? null : String(this.formuario.get('comentario').value).trim()
    };
    return editorial;
  }

  protected getNomeElemento(): string {
    return this.ef.controls['nome'].value ?? '';
  }
}
