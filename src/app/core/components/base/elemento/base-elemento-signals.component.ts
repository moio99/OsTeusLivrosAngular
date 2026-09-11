import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { LayoutService, DadosPaginasService } from '@servizosFlow';
import { ListadoLivros } from '../../../models/listado-livros.interface';
import { of } from 'rxjs';
import { SimpleObjet } from '../../../../shared/models/outros.model';
import { BaseElemento, BaseListadoDadosApi, ResultadoMeta } from '../../../../shared/models/base-dados';

@Component({
  template: ''
})
export abstract class BaseElementoSignalsComponent<TElemento extends BaseElemento> {

  protected layoutService = inject(LayoutService);
  protected router = inject(Router);
  private location = inject(Location);
  private dadosPaginasService = inject(DadosPaginasService);

  // No componhente que herda de BaseElementoSignalsComponent, tem que se que implementar esta funçom
  // é para poder acceder a this.formState.atualizarFromBiblioteca
  protected abstract aplicarDatosAoFormulario(datos: TElemento): void;

  protected dadosLivrosElementoObtidos(data: object): ListadoLivros[] {
    let resultados: ListadoLivros[];
    const dados = <BaseListadoDadosApi<ListadoLivros>>data;
    if (dados != null) {
      resultados = dados.data;
    } else {
      resultados = [];
    }
    return resultados
  }

  protected dadosObtidos(dados: BaseListadoDadosApi<TElemento>): TElemento | undefined {
    let resultados: TElemento | undefined;
    if (dados.data != null && dados.data.length > 0) {
      resultados = dados.data[0];
      if (resultados) {
        this.aplicarDatosAoFormulario(resultados);
      }
    }
    else{
      resultados = undefined;
    }
    return resultados
  }

  protected manexarErroSoporte(e: any, complemntoMensagem: string) {
    console.error(e);
    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Erro,
      mensagem: `Nom se puiderom obter os dados ${complemntoMensagem}.`
    });
    return of([]);
  }

  /**
   * Gestiona o resultado da acçom de guardado ou modifcaçom, e estabelece o novo dado para a pagina à que se retrocede
   * @param data resultado da accom
   * @param elemento elemento que se guardou ou modificou
   */
  protected gestionarRetroceso(data: ResultadoMeta, elemento: TElemento) {
    if (data?.idResult > 0) {
      elemento.id = data.idResult;
      const dadoModificado = this.dadosPaginasService.getNovoDadoLivro();
      if (dadoModificado) {
        const novoDado: SimpleObjet = { id: elemento.id, value: elemento.nome };
        dadoModificado.elemento = novoDado;
        this.dadosPaginasService.setNovoDadoLivro(dadoModificado);
        this.layoutService.amosarInfo(undefined);
        this.location.back();
      }
    }
  }

  onIrPagina(rota: string, id: string | number): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }

  onCancelar() {
    this.dadosPaginasService.setNovoDadoLivro(undefined);
    this.layoutService.amosarInfo(undefined);
    this.location.back();
  }
}
