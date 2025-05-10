import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Colecom } from '../../../core/models/colecom.interface';
import { ColeconsService } from '../../../core/services/api/colecons.service';
import { LivrosService } from '../../../core/services/api/livros.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { BaseElementoComponent } from '../../../core/components/base/elemento/base-elemento.component';
import { UsuarioAppService } from '../../../core/services/flow/usuario-app.service';

@Component({
  selector: 'omla-colecom',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule ],
  templateUrl: './colecom.component.html',
  styleUrls: ['./colecom.component.scss']
})
export class ColecomComponent extends BaseElementoComponent<Colecom, ColeconsService> {

  ef: FormGroup;
  override dadosDoElemento: Colecom | undefined = {
    id: 0,
    nome: '',
    isbn: '',
    web: '',
    comentario: ''
  };

  constructor(
    route: ActivatedRoute,
    router: Router,
    location: Location,
    layoutService: LayoutService,
    coleconsService: ColeconsService,
    dadosPaginasService: DadosPaginasService,
    usuarioAppService: UsuarioAppService,
    private livrosService: LivrosService
  ) {
    super(route, router, layoutService, location, dadosPaginasService, usuarioAppService, coleconsService);

    this.ef = new FormGroup({
      nome: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.required, Validators.maxLength(150)]),
      isbn: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.maxLength(20)]),
      web: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.maxLength(150)]),
      comentario: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(50000))
    });
  }

  protected get formuario(): any {
    return this.ef;
  }

  protected serviceGetLivros(id: string) {
    return this.livrosService.getLivrosPorColecom(id);
  }

  protected updateFormValues(colecom: Colecom) {
    this.ef.patchValue({
      nome: colecom.nome,
      isbn: colecom.isbn,
      web: colecom.web,
      comentario: colecom.comentario
    });
  }

  protected createElementoForm(): Colecom {
    const colecom: Colecom = {
      id: Number(this.dadosDoElemento?.id),
      nome: String(this.formuario.get('nome').value),
      isbn: (this.formuario.get('isbn').value == null) ? null : String(this.formuario.get('isbn').value).trim(),
      web: (this.formuario.get('web').value == null) ? null : String(this.formuario.get('web').value).trim(),
      comentario: (this.formuario.get('comentario').value == null) ? null : String(this.formuario.get('comentario').value).trim()
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
    return 'da colecom';
  }
}
