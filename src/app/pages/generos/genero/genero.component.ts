import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Genero } from '../../../core/models/genero.interface';
import { ListadoLivros, ListadoLivrosData } from '../../../core/models/listado-livros.interface';
import { GenerosService } from '../../../core/services/api/generos.service';
import { LivrosService } from '../../../core/services/api/livros.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { Parametros } from '../../../core/models/comun.interface';
import { environment, environments } from '../../../../environments/environment';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { UsuarioAppService } from '../../../core/services/flow/usuario-app.service';
import { BaseDadosApi } from '../../../core/models/base-dados-api';
import { BaseElementoComponent } from '../../../core/components/base/elemento/base-elemento.component';

@Component({
  selector: 'omla-genero',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule
    /* , MatDatepickerModule, MatNativeDateModule */],
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.scss']
})
export class GeneroComponent extends BaseElementoComponent<Genero, GenerosService> {

  ef: FormGroup;
  override dadosDoElemento: Genero | undefined = {
    id: 0,
    nome: '',
    comentario: ''
  };

  constructor(
    route: ActivatedRoute,
    router: Router,
    location: Location,
    layoutService: LayoutService,
    generosService: GenerosService,
    dadosPaginasService: DadosPaginasService,
    usuarioAppService: UsuarioAppService,
    private livrosService: LivrosService
  ) {
    super(route, router, layoutService, location, dadosPaginasService, usuarioAppService, generosService);

    this.ef = new FormGroup({
      nome: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.required, Validators.maxLength(150)]),
      comentario: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(50000))
    });
  }

  protected get formuario(): any {
    return this.ef;
  }

  protected serviceGetLivros(id: string) {
    return this.livrosService.getListadoLivrosPorGenero(id);
  }

  protected updateFormValues(estiloLiterario: Genero) {
    this.ef.patchValue({
      nome: estiloLiterario.nome,
      comentario: estiloLiterario.comentario
    });
  }

  protected createElementoForm(): Genero {
    const estiloLiterario: Genero = {
      tipo: 'propriedade para saver que o tipo é Género',
      id: Number(this.dadosDoElemento?.id),
      nome: String(this.formuario.get('nome').value),
      comentario: (this.formuario.get('comentario').value == null) ? null : String(this.formuario.get('comentario').value).trim()
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
    return 'do género';
  }
}
