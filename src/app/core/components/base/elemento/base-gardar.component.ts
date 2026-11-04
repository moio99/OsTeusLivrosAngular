import { Component, signal, inject } from '@angular/core';
import { Location } from '@angular/common';
import { concatMap, first, tap } from 'rxjs/operators';
import { environment, environments } from '../../../../../environments/environment';
import { DadosComplentarios, InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { LayoutService, DadosPaginasService } from '@servizosFlow';
import { EstadosPagina } from '../../../../shared/enums/estadosPagina';
import { BaseApiService } from '@servizosApi';
import { SimpleObjet } from '../../../../shared/models/outros.model';
import { BaseElemento, BaseListadoDadosApi, ResultadoMeta } from '../../../../shared/models/base-dados';
import { DadosOutrosService } from '../../../services/flow/dados-outros.service';
import { TranslocoService } from '@jsverse/transloco';
import { EMPTY } from 'rxjs';

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

  protected abstract getNomeElemento(): string;
  protected abstract isFormValid(): boolean;
  protected abstract createElementoForm(): TElemento;

  protected layoutService = inject(LayoutService);
  protected location = inject(Location);
  protected dadosPaginasService = inject(DadosPaginasService);
  protected dadosOutrosService = inject(DadosOutrosService);
  protected translocoService = inject(TranslocoService);

  // Para poder passar TServico dende os filhos
  protected servicoElemento = inject<TServico>('OMeuServizoToken' as any);

  onSubmit(event: Event, tipo: DadosComplentarios) {
    if (!this.isFormValid()) return;

    // const botonPremido = (event.submitter as HTMLButtonElement)?.value;
    const nomeFormulario = String(this.getNomeElemento()).trim();

    this.servicoElemento.getPorNome(nomeFormulario).pipe(
      first(),  // Collo o primeiro valor da consulta do nome e pechamos esa canle
      concatMap((elementoExistente) => {  // concatMap asegura que a seguinte chamada agarde a que esta remate sem cancelarse
        const isDuplicate = elementoExistente?.meta?.quantidade > 0 &&
          (this.modo() === EstadosPagina.engadir ||
          (this.modo() === EstadosPagina.guardar && elementoExistente.meta.id !== (this.dadosDoElemento as any)?.id));

        if (isDuplicate) {
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Aviso,
            mensagem: this.translocoService.translate('common.nameExists', { name: this.getNomeElemento() })
          });
          return EMPTY;
        } else {
          const elemento = this.createElementoForm();
          const serviceCall =this.modo() === EstadosPagina.engadir
            ? this.servicoElemento.create(elemento)
            : this.servicoElemento.update(elemento);

          return serviceCall.pipe(
            first(),
            tap({
              next: (v) => this.handleSaveSuccess(v, elemento, tipo),
              complete: () => this.handleSaveComplete()
            })
          );
        }
      })
    ).subscribe({
      next: () => {
        console.debug('Proceso finalizado');
      },
      error: (e: unknown) => {
        this.handleSaveError(e);
      }
    });
  }

  protected handleSaveError(error: any) {
    console.error(error);
    this.amosarMensagemErro();
  }

  protected handleSaveComplete() {
    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Sucesso,
      mensagem: this.translocoService.translate(
        this.modo() === EstadosPagina.engadir ? 'common.itemAdded' : 'common.itemSaved'
      )
    });
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
