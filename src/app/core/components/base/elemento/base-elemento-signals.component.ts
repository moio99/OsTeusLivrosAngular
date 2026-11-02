import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DadosComplentarios, InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { ListadoLivros } from '../../../models/listado-livros.interface';
import { of } from 'rxjs';
import { SimpleObjet } from '../../../../shared/models/outros.model';
import { BaseElemento, BaseListadoDadosApi, ParametrosId, ResultadoMeta } from '../../../../shared/models/base-dados';
import { BaseGardarComponent } from './base-gardar.component';
import { BaseApiService } from '@servizosApi';
import { environment, environments } from '../../../../../environments/environment';
import { EstadosPagina } from '../../../../shared/enums/estadosPagina';

@Component({
  template: ''
})
export abstract class BaseElementoSignalsComponent<TElemento extends BaseElemento, TServico extends BaseApiService<TElemento>>
  extends BaseGardarComponent<TElemento, TServico> {

  protected route = inject(ActivatedRoute);
  protected router = inject(Router);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const parametros = params as ParametrosId;
      this.elementoId = parametros.id;

      if (parametros.id === '0') {
        this.modo.set(EstadosPagina.engadir);
      } else {
        this.modo.set(EstadosPagina.guardar);
      }

      if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) {
        this.modo.set(EstadosPagina.soVisualizar);
      }
    });
  }

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
    }
    else{
      resultados = undefined;
    }
    return resultados
  }

  protected manejarErroSoporte(e: any, complemntoMensagem: string) {
    console.error(e);
    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Erro,
      mensagem: this.translocoService.translate('common.loadRelatedError', {
        name: this.translocoService.translate(complemntoMensagem)
      })
    });
    return of([]);
  }

  /**
   * Gestiona o resultado da acçom de guardado ou modifcaçom, e estabelece o novo dado para a pagina à que se retrocede
   * @param data resultado da accom
   * @param elemento elemento que se guardou ou modificou
   * @param tipo tipo de dado, podendo ser Autor, Genero, Biblioteca, Editorial, Colecom ou EstiloLiterario
   */
  protected gestionarRetroceso(data: ResultadoMeta, elemento: TElemento, tipo: DadosComplentarios) {
    if (data?.idResult > 0) {
      elemento.id = data.idResult;
      this.dadosOutrosService.setElementoDadosOutrosCache(elemento, tipo);
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
