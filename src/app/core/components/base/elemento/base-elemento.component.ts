import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { environment, environments } from '../../../../../environments/environment';
import { InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { LayoutService } from '../../../services/flow/layout.service';
import { EstadosPagina } from '../../../../shared/enums/estadosPagina';

interface Parametros {
  id: string;
}

@Component({
  template: ''
})
export abstract class BaseElementoComponent<TEntity> implements OnInit {
  modo: EstadosPagina = EstadosPagina.engadir;
  protected entityId: string | null = null;
  protected dadosEntity: TEntity | undefined;
  protected dadosLivros: any[] = [];

  constructor(
    protected route: ActivatedRoute,
    protected layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const parametros = params as Parametros;
      this.entityId = parametros.id;

      if (parametros.id === '0') {
        this.modo = EstadosPagina.engadir;
      } else {
        this.modo = EstadosPagina.guardar;
        this.obterDadosDaEntity(parametros.id);
      }

      if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) {
        this.modo = EstadosPagina.soVisualizar;
      }
    });
  }

  protected abstract get form(): FormGroup;
  protected abstract serviceGetById(id: string): any;
  protected abstract serviceGetLivros(id: string): any;
  protected abstract updateFormValues(entity: TEntity): void;

  protected obterDadosDaEntity(id: string): void {
    this.serviceGetById(id)
      .pipe(first())
      .subscribe({
        next: (v: object) => {
          this.dadosEntity = this.dadosObtidos(v);
          if (this.dadosEntity) {
            this.updateFormValues(this.dadosEntity);
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

  protected dadosObtidos(data: object): TEntity | undefined {
    const dados = data as { data: TEntity[] };
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

  protected abstract getErrorMessage(context: string): string;
  protected abstract getLivrosErrorMessage(): string;

}
