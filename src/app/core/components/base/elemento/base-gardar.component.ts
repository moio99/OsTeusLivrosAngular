import { Component, signal, inject } from '@angular/core';
import { Location } from '@angular/common';
import { first } from 'rxjs/operators';
import { environment, environments } from '../../../../../environments/environment';
import { DadosComplentarios, InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { LayoutService, DadosPaginasService } from '@servizosFlow';
import { EstadosPagina } from '../../../../shared/enums/estadosPagina';
import { FormGroup } from '@angular/forms';
import { BaseApiService } from '@servizosApi';
import { SimpleObjet } from '../../../../shared/models/outros.model';
import { BaseElemento, BaseListadoDadosApi, ResultadoMeta } from '../../../../shared/models/base-dados';
import { DadosOutrosService } from '../../../services/flow/dados-outros.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  template: ''
})
export abstract class BaseGardarComponent<TElemento extends BaseElemento, TServico extends BaseApiService<TElemento>> {

  disabledFormulario = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro ? true : false;
  estadosPagina = EstadosPagina;
  modo = signal<EstadosPagina>(EstadosPagina.engadir);

  protected dadosComplentarios = DadosComplentarios;
  protected elementoId: string | null = null;
  protected dadosDoElemento: TElemento | undefined;

  protected abstract get formuario(): FormGroup;
  protected abstract getNomeElemento(): string;
  protected abstract getErrorMessage(context: string): string;

  protected abstract updateFormValues(eleemnto: TElemento): void;
  protected abstract createElementoForm(): TElemento;

  protected layoutService = inject(LayoutService);
  protected location = inject(Location);
  protected dadosPaginasService = inject(DadosPaginasService);
  protected dadosOutrosService = inject(DadosOutrosService);
  protected translocoService = inject(TranslocoService);

  // Para poder passar TServico dende os filhos
  protected servicoElemento = inject<TServico>('OMeuServizoToken' as any);

  onSubmit(event: SubmitEvent, tipo: DadosComplentarios) {
    if (this.isFormValid()) {
      this.checkForDuplicates(event, tipo);
    }
  }

  protected isFormValid(): boolean {
    return Object.values(this.formuario.controls).every(control => control.status === 'VALID');
  }

  protected checkForDuplicates(event: SubmitEvent, tipo: DadosComplentarios) {
    const nameValue = String(this.formuario.get('nome')?.value).trim();

    this.servicoElemento.getPorNome(nameValue)
      .pipe(first())
      .subscribe({
        next: (v) => this.manejaDuplicadosEGarda(event, v as BaseListadoDadosApi<TElemento>, tipo),
        error: (e: unknown) => this.handleError('obtención', e),
        complete: () => {}
      });
  }

  protected manejaDuplicadosEGarda(
    event: SubmitEvent, elementoExistente: BaseListadoDadosApi<TElemento>, tipo: DadosComplentarios) {

    const isDuplicate = elementoExistente?.meta?.quantidade > 0 &&
      (this.isAdding(event) ||
       (!this.isAdding(event) && elementoExistente.meta.id !== (this.dadosDoElemento as any)?.id));

    if (isDuplicate) {
      this.layoutService.amosarInfo({
        tipo: InformacomPeTipo.Aviso,
        mensagem: this.translocoService.translate('common.nameExists', { name: this.getNomeElemento() })
      });
    } else {
      this.saveElemento(event, tipo);
    }
  }

  private saveElemento(event: SubmitEvent, tipo: DadosComplentarios) {
    const elemento = this.createElementoForm();

    const serviceCall = this.isAdding(event)
      ? this.servicoElemento.create(elemento)
      : this.servicoElemento.update(elemento);

    serviceCall.pipe(first()).subscribe({
      next: (v) => this.handleSaveSuccess(v, elemento, tipo),
      error: (e: unknown) => this.handleSaveError(e),
      complete: () => this.handleSaveComplete(this.isAdding(event))
    });
  }

  protected handleSaveError(error: any) {
    console.error(error);
    this.amosarMensagemErro();
  }

  protected handleSaveComplete(adding: boolean) {
    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Sucesso,
      mensagem: this.translocoService.translate(
        adding ? 'common.itemAdded' : 'common.itemSaved'
      )
    });
  }

  protected handleError(context: string, error: any) {
    console.error(error);
    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Erro,
      mensagem: this.translocoService.translate('common.loadDataError')
    });
  }

  protected isAdding(event: SubmitEvent): boolean {
    return (event.submitter as HTMLButtonElement)?.value === EstadosPagina.engadir;
  }

  private handleSaveSuccess(data: ResultadoMeta, elemento: TElemento, tipo: DadosComplentarios) {
    if (data?.idResult > 0) {
      elemento.id = data.idResult;
      this.dadosOutrosService.setElementoDadosOutrosCache(elemento, tipo);
      this.handleNavigation(data, elemento);
      this.modo.set(EstadosPagina.guardar);
    } else {
      this.amosarMensagemErro();
    }
  }

  protected handleNavigation(data: any, elemento: TElemento) {
    const dados = data as { meta: { id: number } };
    if (dados) {
      elemento.id = dados.meta.id;
      this.dadosDoElemento = elemento;
      const dadoRequerido = this.dadosPaginasService.getNovoDadoLivro();
      if (dadoRequerido) {
        const novoDado: SimpleObjet = { id: elemento.id, value: elemento.nome };
        dadoRequerido.elemento = novoDado;
        this.dadosPaginasService.setNovoDadoLivro(dadoRequerido);
        this.layoutService.amosarInfo(undefined);
        this.location.back();
      }
    }
  }

  private amosarMensagemErro() {
    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Erro,
      mensagem: this.translocoService.translate(
        this.modo() === EstadosPagina.engadir ? 'common.addErrorMessage' : 'common.saveErrorMessage'
      )
    });
  }
}
