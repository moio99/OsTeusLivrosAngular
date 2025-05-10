import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BibliotecasService } from '../../../core/services/api/bibliotecas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { LivrosService } from '../../../core/services/api/livros.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { DateConvert } from '../../../shared/classes/date-convert';
import { Biblioteca } from '../../../core/models/biblioteca.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BaseElementoComponent } from '../../../core/components/base/elemento/base-elemento.component';
import { UsuarioAppService } from '../../../core/services/flow/usuario-app.service';

@Component({
  selector: 'omla-biblioteca',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule
    , MatDatepickerModule, MatNativeDateModule],
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.scss']
})
export class BibliotecaComponent extends BaseElementoComponent<Biblioteca, BibliotecasService> {

  ef: FormGroup;
  override dadosDoElemento: Biblioteca | undefined = {
    id: 0,
    nome: '',
    endereco: '',
    localidade: '',
    telefone: '',
    dataAsociamento: '',
    dataRenovacom: '',
    comentario: ''
  };

  constructor(
    route: ActivatedRoute,
    router: Router,
    location: Location,
    layoutService: LayoutService,
    bibliotecasService: BibliotecasService,
    dadosPaginasService: DadosPaginasService,
    usuarioAppService: UsuarioAppService,
    private livrosService: LivrosService
  ) {
    super(route, router, layoutService, location, dadosPaginasService, usuarioAppService, bibliotecasService);

    this.ef = new FormGroup({
      nome: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.required, Validators.maxLength(150)]),
      endereco: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.maxLength(150)]),
      localidade: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.maxLength(100)]),
      telefone: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.maxLength(50)]),
      dataAsociamento: new FormControl({ value: '', disabled: this.disabledFormulario}),
      dataRenovacom: new FormControl({ value: '', disabled: this.disabledFormulario}),
      comentario: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(50000))
    });
  }

  /**
   * Para que ao dar-lhe ao intro nom faga o envio do formulario
   * @param event Evento
   */
  onKeyDownImpedirEnvio(event: Event) {
    const keyboardEvent = event as KeyboardEvent; // Convertir a KeyboardEvent
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault(); // Prevenir que el formulario se envíe
    }
  }

  protected get formuario(): any {
    return this.ef;
  }

  protected serviceGetLivros(id: string) {
    return this.livrosService.getLivrosPorBiblioteca(id);
  }

  protected updateFormValues(biblioteca: Biblioteca) {
    this.ef.patchValue({
      nome: biblioteca.nome,
      endereco: biblioteca.endereco,
      localidade: biblioteca.localidade,
      telefone: biblioteca.telefone,
      dataAsociamento: biblioteca.dataAsociamento,
      dataRenovacom: biblioteca.dataRenovacom,
      comentario: biblioteca.comentario
    });
  }

  protected createElementoForm(): Biblioteca {
    let dateConvert = new DateConvert();
    let dA = dateConvert.getDate(this.formuario.get('dataAsociamento').value);
    let dR = dateConvert.getDate(this.formuario.get('dataRenovacom').value);

    const biblioteca: Biblioteca = {
      id: Number(this.dadosDoElemento?.id),
      nome: String(this.formuario.get('nome').value),
      endereco: (this.formuario.get('endereco').value === null) ? null : String(this.formuario.get('endereco').value).trim(),
      localidade: (this.formuario.get('localidade').value === null) ? null : String(this.formuario.get('localidade').value).trim(),
      telefone: (this.formuario.get('telefone').value === null) ? null : String(this.formuario.get('telefone').value).trim(),
      dataAsociamento: (dA.year > 0) ? dA.year + '-' + dA.month + '-' + dA.day : '',
      dataRenovacom: (dR.year > 0) ? dR.year + '-' + dR.month + '-' + dR.day : '',
      comentario: (this.formuario.get('comentario').value === null) ? null : String(this.formuario.get('comentario').value).trim()
    };
    return biblioteca;
  }

  protected getErrorMessage(context: string): string {
    return context === 'obtención'
      ? 'Nom se puiderom obter os dados da biblioteca.'
      : 'Nom chegarom dados da biblioteca';
  }

  protected getLivrosErrorMessage(): string {
    return 'Nom se puiderom obter os Livros da biblioteca.';
  }

  protected getNomeElemento(): string {
    return 'da biblioteca';
  }
}
