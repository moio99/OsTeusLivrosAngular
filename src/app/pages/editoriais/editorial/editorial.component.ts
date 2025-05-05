import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { Editorial } from '../../../core/models/editorial.interface';
import { ListadoLivros, ListadoLivrosData } from '../../../core/models/listado-livros.interface';
import { EditoriaisService } from '../../../core/services/api/editoriais.service';
import { LivrosService } from '../../../core/services/api/livros.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment, environments } from '../../../../environments/environment';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { BaseDadosApi } from '../../../core/models/base-dados-api';
import { BaseElementoComponent } from '../../../core/components/base/elemento/base-elemento.component';

@Component({
  selector: 'omla-editorial',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule ],
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.scss']
})
export class EditorialComponent extends BaseElementoComponent<Editorial> {
  ef: FormGroup;

  estadosPagina = EstadosPagina;
  disabledFormulario = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro ? true : false;
  dadosDaEditorial: Editorial | undefined = {
    id: 0,
    nome: '',
    web: '',
    direicom: '',
    comentario: ''
  };
  dadosLivrosDaEditorial: ListadoLivros[] = [];

  protected get form(): any {
    return this.ef;
  }

  constructor(
    private fb: FormBuilder,
    route: ActivatedRoute,
    private router: Router,
    layoutService: LayoutService,
    private location: Location,
    private editoriaisService: EditoriaisService,
    private livrosService: LivrosService,
    private dadosPaginasService: DadosPaginasService
  ) {
      super(route, layoutService);

      this.ef = new FormGroup({
        nome: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.required, Validators.maxLength(150)]),
        direicom: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(150)),
        web: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(150)),
        comentario: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(50000))
      });
    }

  protected serviceGetById(id: string) {
    return this.editoriaisService.getPorId(id);
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

  onSubmit(event: any) {
    if (this.form.nome.status === 'VALID' && this.form.direicom.status === 'VALID'
      && this.form.web.status === 'VALID' && this.form.comentario.status === 'VALID') {

      let editorialRepetido: BaseDadosApi<Editorial>;
      this.editoriaisService
        .getPorNome(String(this.form.nome.value).trim())
        .pipe(first())
        .subscribe({
          next: (v: object) => editorialRepetido = <BaseDadosApi<Editorial>>v,
          error: (e: any) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados da editorial.'}); },
            complete: () => this.guardarEditorial(event, editorialRepetido)
      });
    }
  }

  guardarEditorial(event: any, editorialRepetido: BaseDadosApi<Editorial>) {
    if (editorialRepetido != undefined && editorialRepetido.meta.quantidade > 0 && (
      (event.submitter.value === EstadosPagina.engadir)
      ||
      (event.submitter.value !== EstadosPagina.engadir && editorialRepetido.meta.id != this.dadosDaEditorial?.id))) { // se está actualizando os ids deben ser inguais
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'O nome da editorial já existe na base de dados'});
    }
    else {
      const editorial: Editorial = {
        id: Number(this.dadosDaEditorial?.id),
        nome: String(this.form.nome.value),
        direicom: (this.form.direicom.value == null) ? null : String(this.form.direicom.value).trim(),
        web: (this.form.web.value == null) ? null : String(this.form.web.value).trim(),
        comentario: (this.form.comentario.value == null) ? null : String(this.form.comentario.value).trim()
      };

      if (event.submitter.value === EstadosPagina.engadir) {
        this.editoriaisService
          .create(editorial)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, editorial)},
            error: (e: any) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir a editorial.'});
              console.error(e) },
              complete: () => {
                this.modo = EstadosPagina.guardar;
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Editorial engadida.'});
                // console.debug('post completado');
              }
        });
      }
      else {
        this.editoriaisService
          .update(editorial)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, editorial)},
            error: (e: any) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido guardar a editorial.'});
              console.error(e) },
              complete: () => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Editorial guardada.'});
              console.debug('put completado') }
        });
      }
    }
  }

  private gestionarRetroceso(data: object, editorial: Editorial) {
    const dados = <ListadoLivrosData>data;
    if (dados) {
      editorial.id = dados.meta.id;
      this.dadosDaEditorial = editorial;
      let novoDado = this.dadosPaginasService.getNovoDado();
      if (novoDado) {
        novoDado.elemento = editorial;
        this.layoutService.amosarInfo(undefined);
        this.location.back();
      }
    }
  }

  onCancelar() {
    this.dadosPaginasService.setNovoDado(undefined);
    this.layoutService.amosarInfo(undefined);
    this.location.back();
  }

  onIrPagina(rota: string, id: string): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }
}

