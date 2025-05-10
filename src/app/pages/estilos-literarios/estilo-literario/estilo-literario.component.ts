import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LivrosService } from '../../../core/services/api/livros.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { BaseElementoComponent } from '../../../core/components/base/elemento/base-elemento.component';
import { EstiloLiterario } from '../../../core/models/estilos-literarios.interface';
import { EstilosLiterariosService } from '../../../core/services/api/estilos-literarios.service';
import { UsuarioAppService } from '../../../core/services/flow/usuario-app.service';

@Component({
  selector: 'omla-estilo-literario',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule
    /* , MatDatepickerModule, MatNativeDateModule */],
  templateUrl: './estilo-literario.component.html',
  styleUrls: ['./estilo-literario.component.scss']
})
export class EstiloLiterarioComponent extends BaseElementoComponent<EstiloLiterario, EstilosLiterariosService> {

  ef: FormGroup;
  override dadosDoElemento: EstiloLiterario | undefined = {
    id: 0,
    nome: '',
    comentario: ''
  };

  constructor(
    route: ActivatedRoute,
    router: Router,
    location: Location,
    layoutService: LayoutService,
    estilosLiterariosService: EstilosLiterariosService,
    dadosPaginasService: DadosPaginasService,
    usuarioAppService: UsuarioAppService,
    private livrosService: LivrosService
  ) {
    super(route, router, layoutService, location, dadosPaginasService, usuarioAppService, estilosLiterariosService);

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
    return 'do estilo literario';
  }
}
