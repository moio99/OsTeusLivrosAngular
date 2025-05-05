import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { first } from 'rxjs/operators';
import { environment, environments } from '../../../../../environments/environment';
import { InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { LayoutService } from '../../../services/flow/layout.service';
import { EstadosPagina } from '../../../../shared/enums/estadosPagina';
import { FormGroup } from '@angular/forms';
import { BaseDadosApi, BaseElemento } from '../../../models/base-dados-api';
import { BaseApiService } from '../../../services/api/base-api.service.ts';
import { DadosPaginasService } from '../../../services/flow/dados-paginas.service';

interface Parametros {
  id: string;
}

@Component({
  template: ''
})
export abstract class BaseElementoComponent<TElemento extends BaseElemento, TServico extends BaseApiService<TElemento>>
    implements OnInit {

  modo: EstadosPagina = EstadosPagina.engadir;
  protected entityId: string | null = null;
  protected dadosDoElemento: TElemento | undefined;
  protected dadosLivros: any[] = [];

  protected abstract get form(): FormGroup;
  protected abstract serviceGetLivros(id: string): any;
  protected abstract updateFormValues(entity: TElemento): void;

  protected abstract createElementoForm(): TElemento;
  protected abstract getEntityName(): string;
  protected abstract getErrorMessage(context: string): string;
  protected abstract getLivrosErrorMessage(): string;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected layoutService: LayoutService,
    protected location: Location,
    protected dadosPaginasService: DadosPaginasService,
    @Inject('MyServiceToken') protected servicoElemento: TServico
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const parametros = params as Parametros;
      this.entityId = parametros.id;

      if (parametros.id === '0') {
        this.modo = EstadosPagina.engadir;
      } else {
        this.modo = EstadosPagina.guardar;
        this.obterDadosDoElemento(parametros.id);
      }

      if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) {
        this.modo = EstadosPagina.soVisualizar;
      }
    });
  }

  onSubmit(event: SubmitEvent) {
    if (this.isFormValid()) {
      this.checkForDuplicates(event);
    }
  }

  onCancelar() {
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

  protected obterDadosDoElemento(id: string): void {
    this.servicoElemento.getPorId(id)
      .pipe(first())
      .subscribe({
        next: (v: any) => {
          this.dadosDoElemento = this.dadosObtidos(v);
          if (this.dadosDoElemento) {
            this.updateFormValues(this.dadosDoElemento);
          }
        },
        error: (e: any) => {
          console.error(e);
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Erro,
            mensagem: this.getErrorMessage('obtención')
          });
        },
        complete: () => this.obterLivros(id)
      });
  }

  protected dadosObtidos(data: any): TElemento | undefined {
    const dados = data as { data: TElemento[] };
    if (dados?.data?.length > 0) {
      return dados.data[0];
    } else {
      this.layoutService.amosarInfo({
        tipo: InformacomPeTipo.Erro,
        mensagem: this.getErrorMessage('datos')
      });
      return undefined;
    }
  }

  protected obterLivros(id: string): void {
    console.debug(`completada a obtençom dos dados da entidade ${id}`);
    this.serviceGetLivros(id)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosLivros = this.dadosLivrosObtidos(v),
        error: (e: any) => {
          console.error(e);
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Erro,
            mensagem: this.getLivrosErrorMessage()
          });
        },
        complete: () => console.debug('completada a obtençom dos livros')
      });
  }

  protected dadosLivrosObtidos(data: object): any[] {
    const dados = data as { data: any[], meta?: any };
    return dados?.data ?? [];
  }

  protected isFormValid(): boolean {
    return Object.values(this.form.controls).every(control => control.status === 'VALID');
  }

  protected checkForDuplicates(event: SubmitEvent) {
    const nameValue = String(this.form.get('nome')?.value).trim();

    this.servicoElemento.getPorNome(nameValue)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.handleDuplicateCheck(event, v as BaseDadosApi<TElemento>),
        error: (e: any) => this.handleError('obtención', e),
        complete: () => {}
      });
  }

  protected handleDuplicateCheck(event: SubmitEvent, existingEntity: BaseDadosApi<TElemento>) {
    const isDuplicate = existingEntity?.meta?.quantidade > 0 &&
      (this.isAdding(event) ||
       (!this.isAdding(event) && existingEntity.meta.id !== (this.dadosDoElemento as any)?.id));

    if (isDuplicate) {
      this.layoutService.amosarInfo({
        tipo: InformacomPeTipo.Aviso,
        mensagem: `O nome ${this.getEntityName()} já existe na base de dados`
      });
    } else {
      this.saveElemento(event);
    }
  }

  protected handleSaveError(error: any) {
    console.error(error);
    this.amosarMensagemErro();
  }

  protected handleSaveComplete() {
    const action = this.modo === EstadosPagina.engadir ? 'engadida' : 'guardada';
    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Sucesso,
      mensagem: `${this.getEntityName()} ${action}.`
    });
  }

  protected handleError(context: string, error: any) {
    console.error(error);
    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Erro,
      mensagem: `Nom se puiderom obter os dados ${this.getEntityName()}.`
    });
  }

  protected isAdding(event: SubmitEvent): boolean {
    return (event.submitter as HTMLButtonElement)?.value === EstadosPagina.engadir;
  }

  protected handleNavigation(data: any, elemento: TElemento) {
    const dados = data as { meta: { id: number } };
    if (dados) {
      elemento.id = dados.meta.id;
      this.dadosDoElemento = elemento;
      const novoDado = this.dadosPaginasService.getNovoDado();
      if (novoDado) {
        novoDado.elemento = elemento;
        this.layoutService.amosarInfo(undefined);
        this.location.back();
      }
    }
  }

  private saveElemento(event: SubmitEvent) {
    const elemento = this.createElementoForm();

    const serviceCall = this.isAdding(event)
      ? this.servicoElemento.create(elemento)
      : this.servicoElemento.update(elemento);

    serviceCall.pipe(first()).subscribe({
      next: (v: any) => this.handleSaveSuccess(v, elemento),
      error: (e: any) => this.handleSaveError(e),
      complete: () => this.handleSaveComplete()
    });
  }

  private handleSaveSuccess(data: any, entity: TElemento) {
    console.debug(data);
    if (data.idResult > 0) {
      this.handleNavigation(data, entity);
      this.modo = EstadosPagina.guardar;
    } else {
      this.amosarMensagemErro();
    }
  }

  private amosarMensagemErro() {
    const action = this.modo === EstadosPagina.engadir ? 'engadir' : 'guardar';
    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Erro,
      mensagem: `Nom se puido ${action} ${this.getEntityName()}.`
    });
  }
}
