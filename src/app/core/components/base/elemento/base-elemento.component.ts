import { Component, computed, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { first } from 'rxjs/operators';
import { environment, environments } from '../../../../../environments/environment';
import { DadosComplentarios, InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { LayoutService, DadosPaginasService } from '@servizosFlow';
import { EstadosPagina } from '../../../../shared/enums/estadosPagina';
import { FormGroup } from '@angular/forms';
import { BaseApiService } from '@servizosApi';
import { ListadoLivros } from '../../../models/listado-livros.interface';
import { SimpleObjet } from '../../../../shared/models/outros.model';
import { BaseElemento, ParametrosId, BaseListadoDadosApi, ResultadoMeta } from '../../../../shared/models/base-dados';
import { DadosOutrosService } from '../../../services/flow/dados-outros.service';
import { BaseGardarComponent } from './base-gardar.component';

@Component({
  template: ''
})
export abstract class BaseElementoComponent<TElemento extends BaseElemento, TServico extends BaseApiService<TElemento>>
  extends BaseGardarComponent<TElemento, TServico> implements OnInit {

  protected livrosDoElemento = signal<ListadoLivros[]>([]);
  protected readonly temLivros = computed(() => this.livrosDoElemento().length > 0); // só se le umha vez (quando cambia dadosRelecturas) polo que evita a cpu habaliar a expreson cada vez que pinta ou que sucede um evento na página relacionado.

  protected abstract serviceGetLivros(id: string): any;
  protected abstract getLivrosErrorMessage(): string;

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
        this.obterDadosDoElemento(parametros.id);
      }

      if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) {
        this.modo.set(EstadosPagina.soVisualizar);
      }
    });
  }

  onCancelar() {
    this.layoutService.amosarInfo(undefined);
    this.location.back();
  }

  onIrPagina(rota: string, id: string, idRelectura: string = '0'): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);

    const relectura = idRelectura != '0' ? `&idRelectura=${idRelectura}` : '';
    const rotaCompleta = `${rota}?id=${id}${relectura}`;

    this.router.navigateByUrl(rotaCompleta);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }

  protected obterDadosDoElemento(id: string): void {
    this.servicoElemento.getPorId(id)
      .pipe(first())
      .subscribe({
        next: (v) => {
          this.dadosDoElemento = this.dadosObtidos(v);
          if (this.dadosDoElemento) {
            this.updateFormValues(this.dadosDoElemento);
          }
        },
        error: (e: unknown) => {
          console.error(e);
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Erro,
            mensagem: this.translocoService.translate(this.getErrorMessage('obtención'))
          });
        },
        complete: () => this.obterLivros(id)
      });
  }

  protected dadosObtidos(data: any): TElemento | undefined {
    const dados = data as BaseListadoDadosApi<TElemento>;
    if (dados?.data?.length > 0) {
      return dados.data[0];
    } else {
      this.layoutService.amosarInfo({
        tipo: InformacomPeTipo.Erro,
        mensagem: this.translocoService.translate(this.getErrorMessage('datos'))
      });
      return undefined;
    }
  }

  protected obterLivros(id: string): void {
    console.debug(`completada a obtençom dos dados da entidade ${id}`);
    this.serviceGetLivros(id)
      .pipe(first())
      .subscribe({
        next: (v: BaseListadoDadosApi<ListadoLivros>) => {
          console.log(`completada a obtençom dos livros da entidade ${id}`, v);
          this.livrosDoElemento.set(v?.data ?? []);
        },
        error: (e: unknown) => {
          console.error(e);
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Erro,
            mensagem: this.translocoService.translate('common.loadRelatedError', {
              name: this.translocoService.translate(this.getLivrosErrorMessage())
            })
          });
        },
        complete: () => console.debug('completada a obtençom dos livros')
      });
  }
}
